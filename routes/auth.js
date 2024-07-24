const express = require("express");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const { addUser } = require("../models/users");

const validateCredentials = [
  body("firstName")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("First name is required"),
  body("lastName")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Last name is required"),
  body("username").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post(
  "/signup",
  validateCredentials,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        errors: errors.array(),
      });
    }
    const { firstName, lastName, username, password } = req.body;
    try {
      await addUser({ firstName, lastName, username, password });
      res.redirect("/auth/login");
    } catch (error) {
      res.render("signup", { error: "Error creating user" });
    }
  })
);
module.exports = router;
