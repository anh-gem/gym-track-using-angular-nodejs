const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // links to Member model
      required: true,
    },
    exercise: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const workoutModel = mongoose.model("Workout", workoutSchema);

module.exports = workoutModel;
