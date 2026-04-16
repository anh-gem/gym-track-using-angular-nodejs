const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminauth.controller");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

module.exports = router;
