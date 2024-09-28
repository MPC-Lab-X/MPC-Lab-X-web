/**
 * @file src/routes/auth.js
 * @description Authentication routes.
 */

const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("pages/auth/register");
});

router.get("/register/complete", (req, res) => {
  res.render("pages/auth/complete-registration");
});

router.get("/login", (req, res) => {
  res.render("pages/auth/login");
});

router.get("/password-reset", (req, res) => {
  res.render("pages/auth/password-reset");
});

module.exports = router;
