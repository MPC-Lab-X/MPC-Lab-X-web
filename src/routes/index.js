/**
 * @file src/routes/index.js
 * @description Routes configuration.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/home");
});

module.exports = router;
