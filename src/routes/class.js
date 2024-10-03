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

router.get("/:id/tasks", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/tasks", { classId: req.params.id });
});

router.get("/:id/tasks/new", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/new-task", { classId: req.params.id });
});

router.get("/:id/students", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/students", { classId: req.params.id });
});

router.get("/:id/students/new", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/add-student", { classId: req.params.id });
});

router.get("/:id/students/:studentId/edit", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  if (!req.params.studentId) {
    return res.redirect(`/classrooms/${req.params.id}/students`);
  }
  res.render("pages/class/edit-student", {
    classId: req.params.id,
    studentId: req.params.studentId,
  });
});

router.get("/:id/admins", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/admins", { classId: req.params.id });
});

router.get("/:id/admins/add", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/add-admin", { classId: req.params.id });
});

router.get("/:id/settings", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  }
  res.render("pages/class/settings", { classId: req.params.id });
});

module.exports = router;
