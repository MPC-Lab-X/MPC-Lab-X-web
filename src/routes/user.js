/**
 * @file src/routes/user.js
 * @description User routes.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/user/profile");
});

module.exports = router;
