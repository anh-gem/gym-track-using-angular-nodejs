const Member = require("../models/Member");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadImage, deleteImage } = require("../services/imagekit.service");

// helpers
const getExpiryDate = (plan) => {
  const now = new Date();
  if (plan === "basic") now.setMonth(now.getMonth() + 1);
  if (plan === "standard") now.setMonth(now.getMonth() + 3);
  if (plan === "premium") now.setMonth(now.getMonth() + 6);
  return now;
};

const generateToken = (member) => {
  return jwt.sign({ id: member._id, role: "member" }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
};

const setCookies = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("loggedIn", "true", {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// REGISTER
exports.registerMember = async (req, res) => {
  // console.log("FILE:", req.file);
  // console.log("BODY:", req.body);
  try {
    const { name, email, password, phone, plan } = req.body;

    const exists = await Member.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicture = "";
    let imageKitFileId = "";

    if (req.file) {
      const upload = await uploadImage(req.file);
      profilePicture = upload.url;
      imageKitFileId = upload.fileId;
    }

    const member = await Member.create({
      name,
      email,
      password: hashedPassword,
      phone,
      plan,
      expiryDate: getExpiryDate(plan),
      profilePicture,
      imageKitFileId,
    });

    setCookies(res, generateToken(member)); // reusable helper
    res.status(201).json({ message: "Member registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    setCookies(res, generateToken(member)); // reusable helper
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("loggedIn");
  res.json({ message: "Logged out" });
};

// GET ME
exports.getMe = async (req, res) => {
  try {
    const member = await Member.findById(req.user.id).select("-password");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updated = await Member.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true },
    ).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE PICTURE
exports.updateProfilePicture = async (req, res) => {
  try {
    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (member.imageKitFileId) {
      await deleteImage(member.imageKitFileId);
    }

    const uploaded = await uploadImage(req.file);
    member.profilePicture = uploaded.url;
    member.imageKitFileId = uploaded.fileId;
    await member.save();

    res.json({ message: "Profile picture updated", member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL MEMBERS (Admin)
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().select("-password");
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE MEMBER (Admin)
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (member.imageKitFileId) {
      await deleteImage(member.imageKitFileId);
    }

    await member.deleteOne();
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
