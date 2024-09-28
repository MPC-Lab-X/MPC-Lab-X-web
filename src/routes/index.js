/**
 * @file src/routes/index.js
 * @description Routes configuration.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/home");
});

router.get("/register", (req, res) => {
  res.render("pages/auth/register");
});

router.get("/register/complete", (req, res) => {
  res.render("pages/auth/complete-registration");
});

router.get("/login", (req, res) => {
  res.render("pages/auth/login");
});

module.exports = router;
