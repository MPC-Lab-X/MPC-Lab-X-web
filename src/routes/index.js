/**
 * @file src/routes/index.js
 * @description Routes configuration.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/home");
});

router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard");
});

router.use("/", require("./auth"));

router.use("/user", require("./user"));

router.use("/classrooms", require("./class"));

module.exports = router;
