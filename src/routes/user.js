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

router.get("/settings/complete-email-update", (req, res) => {
  if (!req.query.token) {
    return res.redirect("/user/settings");
  }
  res.render("pages/user/complete-email-update", { token: req.query.token });
});

router.get("/security", (req, res) => {
  res.render("pages/user/security");
});

router.get("/logout", (req, res) => {
  res.render("pages/user/logout");
});

module.exports = router;
