const mongoose = require("mongoose");

const classroomsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },

  capacity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },

  school: { type: mongoose.Types.ObjectId, ref: "schools" },

  students: [{ type: mongoose.Types.ObjectId, ref: "students" }],
});

// Export the model
module.exports = mongoose.model("classrooms", classroomsSchema);
