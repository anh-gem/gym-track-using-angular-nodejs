const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

const {
  registerMember,
  loginMember,
  updateMyProfile,
  updateProfilePicture,
  getMembers,
  deleteMember,
  getMe,
  logout,
} = require("../controllers/member.controller");

const { protect, isAdmin } = require("../middleware/auth.middleware");

router.post("/register", upload.single("image"), registerMember);
router.post("/login", loginMember);
router.patch("/update", protect, updateMyProfile);
router.patch(
  "/updatepfp",
  protect,
  upload.single("image"),
  updateProfilePicture,
);

router.get("/", protect, isAdmin, getMembers);
router.delete("/:id", protect, isAdmin, deleteMember);
router.get("/me", protect, getMe);
router.post("/logout", logout);

module.exports = router;
