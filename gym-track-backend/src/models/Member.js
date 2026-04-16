const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      
    },
    phone: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String, // ImageKit CDN url
      default: "",
    },
    imageKitFileId: {
      type: String, // needed to delete old photo
      default: "",
    },
    plan: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const memberModel = mongoose.model("Member", memberSchema);

module.exports = memberModel;
