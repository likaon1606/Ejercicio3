//UTILS
const { catchAsync } = require("../utils/catchAsync");

//MODELS
const { Repair } = require("../models/repairsModel");
const { User } = require("../models/userModel");
const { validationResult } = require("express-validator");

const getAllRepairs = catchAsync(async (req, res) => {
  const repairs = await Repair.findAll({
    where: { status: "pending" },
    include: [{ model: User, attributes: { exclude: ["password"] } }],
  });
  res.status(200).json({
    repairs,
  });
});

const getRepairById = catchAsync(async (req, res) => {
  const { repair } = req;

  res.status(200).json({
    repair,
  });
});

const createRepair = catchAsync(async (req, res) => {
  const { date, computerNumber, comments, userId } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);
    const errorMsg = messages.join(". ");

    return res.status(400).json({
      status: "error",
      message: errorMsg,
    });
  }

  const newRepair = await Repair.create({
    date,
    computerNumber,
    comments,
    userId,
  });

  res.status(201).json({ newRepair });
});

const updateRepair = catchAsync(async (req, res) => {
  const { repair } = req;
  const { computerNumber, comments } = req.body;

  await repair.update({ computerNumber, comments });

  res.status(200).json({ status: "success" });
});

const deleteRepair = catchAsync(async (req, res) => {
  const { repair } = req;

  await repair.update({ status: "cancelled" });

  res.status(200).json({
    status: "success",
  });
});

module.exports = {
  getAllRepairs,
  createRepair,
  getRepairById,
  updateRepair,
  deleteRepair,
};
