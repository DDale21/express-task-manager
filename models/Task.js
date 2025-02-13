const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Task name is required"],
    trim: true,
    minlength: [3, "Task name must be at least 3 characters long"],
    maxlength: [20, "Task name cannot be more than 20 characters"],
  },
  completed:{
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Task', TaskSchema);