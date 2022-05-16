const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//models
const { User } = require("../models/userModel");
const { Repair } = require("../models/repairsModel");

//utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

// Call dotenv on error
dotenv.config({ path: "./config.env" });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    include: { model: Repair },
  });

  res.status(200).json({
    //RETURN TO CLIENT
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });
  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { user } = req;
  // const { id } = req.params; // desestructurize id
  const { name, email } = req.body; //change to camps ej: (name, email, etc.)
  // await User.update({ name }, { where: { id } }); ANOTHER METOD TO UPDATE
  // const user = await User.findOne({ where: { id } });
  await user.update({ name, email }); //to update the name or any other
  res.status(200).json({ status: "success" });
});

const deleteUser = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({ status: "deleted" });

  res.status(200).json({
    status: "success",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: "available" },
  });
  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("invalid credentials", 400));
  }
  //Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  checkToken,
};
