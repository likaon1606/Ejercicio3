const jwt = require("jsonwebtoken");

//Models
const { User } = require("../models/userModel");

//catch errors
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const protectToken = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("session invalid", 403));
  }
  // // Verify token firm
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // Search user == id
  const user = await User.findOne({
    where: { id: decoded.id, status: "available" },
  });

  if (!user) {
    return next(
      new AppError("The owner of this token is no longer available", 403)
    );
  }
  req.sessionUser = user;
  next();
});

const protectAdmin = catchAsync(async (req, res, next) => {
  if (req.sessionUser.role !== "employee") {
    return next(new AppError("Only admin has access", 403));
  }

  next();
});

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // search one element, recovery id  = ?, all value
  const user = await User.findOne({
    where: { id, status: "available" },
    attributes: { exclude: ["password"] },
  }); // search id with id params id:id

  if (!user) {
    return next(new AppError("User does not exist with given Id", 404));
  }

  //Add property user
  req.user = user;
  next();
});

// const protectAccountOwner = catchAsync (async (req, res, next) => {
//   // GET CURRENT SESSION USER
//   const { sessionUser } = req
// });

module.exports = { userExists, protectToken, protectAdmin };
