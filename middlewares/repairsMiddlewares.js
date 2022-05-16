const { Repair } = require("../models/repairsModel");

//catch errors
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const repairExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await Repair.findOne({
    where: { id },
  });

  if (!repair) {
    return next(new AppError("User does not exist with given Id", 404));
  } else if (repair.status !== "pending") {
    return res.status(404).json({
      status: "error",
      message: "pending not found",
    });
  }

  req.repair = repair;
  next();
});

module.exports = { repairExists };
