const express = require("express");
const router = express.Router();

const {
  createWorkout,
  getMyWorkouts,
  getAllWorkouts,
} = require("../controllers/workout.controller");

const { protect, isAdmin } = require("../middleware/auth.middleware");

// Member
router.post("/", protect, createWorkout);
router.get("/my", protect, getMyWorkouts);

// Admin
router.get("/", protect, isAdmin, getAllWorkouts);

module.exports = router;
