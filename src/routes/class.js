/**
 * @file src/routes/class.js
 * @description Classroom routes.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/class/classrooms");
});

router.get("/new", (req, res) => {
  res.render("pages/class/create");
});

router.get("/:id", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/classroom", { classId: req.params.id });
});

router.get("/:id/students", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/students", { classId: req.params.id });
});

module.exports = router;
