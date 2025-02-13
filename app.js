const express = require("express");
const app = express();
const taskRouter = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config();

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// Middleware
app.use(express.static('./public'));
app.use(express.json());

// Routes
app.use('/api/v1/tasks', taskRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening to port ${process.env.PORT}`)
    })
  } catch (error) {
    console.log(error);
  }
}

start();