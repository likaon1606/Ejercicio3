const express = require("express");
const { body } = require("express-validator");

//MIDDLEWARES
const {
  userExists,
  protectToken,
  protectAdmin,
} = require("../middlewares/usersMiddlewares");

//Controller
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", login);

router.post(
  "/",
  body("name").notEmpty().withMessage("Name must not be empty"),
  body("email")
    .notEmpty()
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Email invalid, make sure it is an email"),
  body("password")
    .notEmpty()
    .withMessage("Password must not be empty")
    .isLength({ min: 8 })
    .withMessage("must contain at least 8 characters long"),
  createUser
);
// Apply protectToken alls middlewares
router.use(protectToken);

router.get("/", getAllUsers);

router //optimize routes
  .route("/:id")
  .get(userExists, getUserById)
  .patch(protectAdmin, userExists, updateUser)
  .delete(protectAdmin, userExists, deleteUser);

module.exports = { usersRouter: router };
