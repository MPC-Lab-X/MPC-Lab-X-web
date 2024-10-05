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
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(`/classrooms/${req.params.id.toLocaleUpperCase()}`);
  }
  res.render("pages/class/classroom", { classId: req.params.id });
});

router.get("/:id/tasks", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/tasks`
    );
  }
  res.render("pages/class/tasks", { classId: req.params.id });
});

router.get("/:id/tasks/new", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/tasks/new`
    );
  }
  res.render("pages/class/new-task", { classId: req.params.id });
});

router.get("/:id/tasks/:taskId", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (!req.params.taskId) {
    return res.redirect(`/classrooms/${req.params.id}/tasks`);
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/tasks/${
        req.params.taskId
      }`
    );
  }
  res.render("pages/class/task", {
    classId: req.params.id,
    taskId: req.params.taskId,
  });
});

router.get("/:id/tasks/:taskId/print", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (!req.params.taskId) {
    return res.redirect(`/classrooms/${req.params.id}/tasks`);
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/tasks/${
        req.params.taskId
      }/print`
    );
  }
  res.render("pages/class/task-print", {
    classId: req.params.id,
    taskId: req.params.taskId,
    desmosApiKey: process.env.DESMOS_API_KEY,
  });
});

router.get("/:id/tasks/:taskId/grade", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (!req.params.taskId) {
    return res.redirect(`/classrooms/${req.params.id}/tasks`);
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/tasks/${
        req.params.taskId
      }/grade`
    );
  }
  res.render("pages/class/task-grade", {
    classId: req.params.id,
    taskId: req.params.taskId,
    desmosApiKey: process.env.DESMOS_API_KEY,
  });
});

router.get("/:id/tasks/:taskId/grade/flow", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (!req.params.taskId) {
    return res.redirect(`/classrooms/${req.params.id}/tasks`);
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/tasks/${
        req.params.taskId
      }/grade/flow`
    );
  }
  res.render("pages/class/task-grade-flow", {
    classId: req.params.id,
    taskId: req.params.taskId,
    desmosApiKey: process.env.DESMOS_API_KEY,
  });
});

router.get("/:id/tasks/:taskId/edit", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (!req.params.taskId) {
    return res.redirect(`/classrooms/${req.params.id}/tasks`);
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/tasks/${
        req.params.taskId
      }/edit`
    );
  }
  res.render("pages/class/edit-task", {
    classId: req.params.id,
    taskId: req.params.taskId,
  });
});

router.get("/:id/students", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/students`
    );
  }
  res.render("pages/class/students", { classId: req.params.id });
});

router.get("/:id/students/new", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/students/new`
    );
  }
  res.render("pages/class/add-student", { classId: req.params.id });
});

router.get("/:id/students/:studentId/edit", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (!req.params.studentId) {
    return res.redirect(`/classrooms/${req.params.id}/students`);
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/students/${
        req.params.studentId
      }/edit`
    );
  }
  res.render("pages/class/edit-student", {
    classId: req.params.id,
    studentId: req.params.studentId,
  });
});

router.get("/:id/admins", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/admins`
    );
  }
  res.render("pages/class/admins", { classId: req.params.id });
});

router.get("/:id/admins/add", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/admins/add`
    );
  }
  res.render("pages/class/add-admin", { classId: req.params.id });
});

router.get("/:id/settings", (req, res) => {
  if (!req.params.id) {
    return res.redirect("/classrooms");
  } else if (req.params.id.toLocaleUpperCase() !== req.params.id) {
    return res.redirect(
      `/classrooms/${req.params.id.toLocaleUpperCase()}/settings`
    );
  }
  res.render("pages/class/settings", { classId: req.params.id });
});

module.exports = router;
