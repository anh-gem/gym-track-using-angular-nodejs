const Workout = require("../models/Workout");

// Create workout for logged-in member
exports.createWorkout = async (req, res) => {
  try {
    const { exercise, category, sets, reps, weight, notes } = req.body;

    const workout = await Workout.create({
      memberId: req.user.id, // from JWT
      exercise,
      category,
      sets,
      reps,
      weight,
      notes,
    });

    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get workouts of logged-in member
exports.getMyWorkouts = async (req, res) => {
  const workouts = await Workout.find({
    memberId: req.user.id,
  });

  res.json(workouts);
};

// Admin: get all workouts
exports.getAllWorkouts = async (req, res) => {
  const workouts = await Workout.find().populate("memberId", "name email");

  res.json(workouts);
};
