/**
 * @file src/routes/user.js
 * @description User routes.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/user/profile");
});

router.get("/settings", (req, res) => {
  res.render("pages/user/settings");
});

router.get("/security", (req, res) => {
  res.render("pages/user/security");
});

module.exports = router;
