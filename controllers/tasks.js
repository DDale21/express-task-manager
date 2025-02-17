const mongoose = require('mongoose');
const Task = require('../models/Task');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');

const getTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  if (!tasks || tasks.length === 0) {
    return next(createCustomError({
      statusCode: 404,
      message: 'No tasks exist',
    }));
  }
  res.status(200).json({
    success: true,
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
    return next(createCustomError({
      statusCode: 400,
      message: 'Invalid ID format',
    }));
  }

  const task = await Task.findById(id);
  if (!task) {
    return next(createCustomError({
      statusCode: 404,
      message: 'Task with specified ID not found',
    }));
  }
  res.status(200).json({
    success: true,
    task,
  }); 
})

// needs to update code to use errorHandlerMiddleware like above

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { newName, completed } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createCustomError({
      statusCode: 400,
      message: 'Invalid ID format'
    }));
  }

  const updatedTask = {};
  if (newName) updatedTask.name = newName;
  if (completed !== undefined) updatedTask.completed = completed;

  const options = {
    new: true,
    runValidators: true,
  }
  console.log(completed);
  const task = await Task.findByIdAndUpdate(id, updatedTask, options);

  if (!task) {
    return next(createCustomError({
      statusCode: 404,
      message: 'Cannot update task, Task with specified ID does not exist',
    }));
  }

  res.status(200).json({
    success: true,
    message: 'Successfully updated task',
    task,
  });
})

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createCustomError({
      statusCode: 400,
      message: 'Invalid ID format',
    }));
  }
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return next(createCustomError({
      statusCode: 404,
      message: 'Cannot delete task, Task with the specified ID not found'
    }));
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