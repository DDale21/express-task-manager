const mongoose = require('mongoose');
const Task = require('../models/Task');
const asyncWrapper = require('../middleware/async');

const getTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  if (!tasks) {
    return res.status(404).json({
      success: false,
      message: 'No tasks exist'
    });
  }
  res.status(200).json({
    success: true,
    message: 'Success',
    tasks
  });
})

const createTask = asyncWrapper(async (req, res) => {
  const { name, completed } = req.body;
  const newTask = await Task.create({
    name: name,
    completed: completed
  });
  res.status(201).json({
    success: true,
    message: 'Successfully created a task',
    data: newTask,
  });
})

const getTaskById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid ID format');
    error.status = 400;
    return next(error);
  }

  const task = await Task.findById(id);
  if (!task) {
    const error = new Error('Task with specified ID not found');
    error.status = 404;
    return next(error);
  }
  res.status(200).json({
    success: true,
    task,
  }); 
})

// needs to update code to use errorHandlerMiddleware like above

const updateTask = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { newName, completed } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  const updatedTask = {};
  if (newName) updatedTask.name = newName;
  if (completed !== 'undefined') updatedTask.completed = completed;

  const options = {
    new: true,
    runValidators: true,
  }
  console.log(completed);
  const task = await Task.findByIdAndUpdate(id, updatedTask, options);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Cannot update task, task with specified ID does not exist',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Successfully updated task',
    task,
  });
})

const deleteTask = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    })
  }
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task with the specified ID not found',
    });
  }
  res.status(200).json({
    success: true,
    message: `Task '${task.name}' has been successfully deleted`
  });
})

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
}