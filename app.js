const express = require("express");
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Controllers
const { globalErrorHandler } = require("./controllers/errorsController");

const { usersRouter } = require("./routes/usersRoutes");
const { repairsRouter } = require("./routes/repairsRoutes");

//Models
const { Repair } = require("./models/repairsModel");
const { User } = require("./models/userModel");

//Utils data base { db }
const { db } = require("./utils/database");

//Init express app
const app = express();

//Enable incoming JSON DATA
app.use(express.json());

// ADD SECURITY HELMET
app.use(helmet());
//Compress responses
app.use(compression());
//Log incoming requests
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

//Enpoints
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/repairs", repairsRouter);

// Global error handler
app.use("*", globalErrorHandler);

//Authenticate db
db.authenticate()
  .then(() => console.log("Database authenticate"))
  .catch((err) => console.log(err));

// Establish relations
User.hasMany(Repair, { foreignKey: "userId" });
Repair.belongsTo(User);

db.sync()
  .then(() => console.log("Database Synced"))
  .catch((err) => console.log(err));

//Up server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express app sunning on port: ${PORT}`);
});

module.exports = { app };
