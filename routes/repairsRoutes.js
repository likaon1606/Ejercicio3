const express = require("express");
const { body } = require("express-validator");

// MIDDLEWARES
const { repairExists } = require("../middlewares/repairsMiddlewares");
const {
  protectToken,
  protectAdmin,
} = require("../middlewares/usersMiddlewares");

//Controller Repairs
const {
  getAllRepairs,
  createRepair,
  getRepairById,
  updateRepair,
  deleteRepair,
} = require("../controllers/repairController");

const router = express.Router();
router.use(protectToken);

router.get("/", protectAdmin, getAllRepairs);
router.post(
  "/",
  protectAdmin,
  body("date")
    .notEmpty()
    .withMessage('Date must not be empty, width format: "yyyy/mm/dd"'),
  body("computerNumber")
    .notEmpty()
    .withMessage("computerNumber must not be empty"),
  body("comments")
    .notEmpty()
    .withMessage("comments must not be empty")
    .isLength({ min: 10, max: 30 })
    .withMessage("min 10 characters, max 30 characters"),
  createRepair
);

router
  .route("/:id")
  .get(protectAdmin, repairExists, getRepairById)
  .patch(protectAdmin, repairExists, updateRepair)
  .delete(protectAdmin, repairExists, deleteRepair);

module.exports = { repairsRouter: router };
