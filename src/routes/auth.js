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
  if (!req.query.token) {
    return res.redirect("/register");
  }
  res.render("pages/auth/complete-registration", { token: req.query.token });
});

router.get("/login", (req, res) => {
  res.render("pages/auth/login");
});

router.get("/password-reset", (req, res) => {
  res.render("pages/auth/password-reset");
});

router.get("/password-reset/complete", (req, res) => {
  if (!req.query.token) {
    return res.redirect("/password-reset");
  }
  res.render("pages/auth/complete-password-reset", { token: req.query.token });
});

module.exports = router;
