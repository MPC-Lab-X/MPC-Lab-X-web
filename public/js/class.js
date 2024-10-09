/**
 * @file public/js/class.js
 * @description Classroom class.
 */

class Classroom {
  /**
   * @constructor - Initializes the Classroom class.
   * @param {Object} app - The App class.
   */
  constructor(app) {
    this.app = app;
    this.baseURL = app.baseURL;
    this.apiURL = app.apiURL;
  }

  /**
   * @function createClass - Creates a new classroom.
   * @param {string} name - The name of the classroom.
   * @returns {Promise<Object>} - The response object.
   */
  async createClass(name) {
    const response = await fetch(`${this.apiURL}/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ className: name }),
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function renameClass - Renames a classroom.
   * @param {string} id - The ID of the classroom.
   * @param {string} name - The new name of the classroom.
   * @returns {Promise<Object>} - The response object.
   */
  async renameClass(id, name) {
    const response = await fetch(`${this.apiURL}/classes/${id}/name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function getClasses - Gets all the classes.
   * @returns {Promise<Object>} - The response object.
   */
  async getClasses() {
    const response = await fetch(`${this.apiURL}/classes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function getClass - Gets a class.
   * @param {string} id - The ID of the class.
   * @returns {Promise<Object>} - The response object.
   */
  async getClass(id) {
    const response = await fetch(`${this.apiURL}/classes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function addAdmin - Adds an admin to a class.
   * @param {string} id - The ID of the class.
   * @param {string} identifier - The id, email, or username of the user.
   * @returns {Promise<Object>} - The response object.
   */
  async addAdmin(id, identifier) {
    const response = await fetch(`${this.apiURL}/classes/${id}/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier }),
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function removeAdmin - Removes an admin from a class.
   * @param {string} id - The ID of the class.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Object>} - The response object.
   */
  async removeAdmin(id, userId) {
    const response = await fetch(`${this.apiURL}/classes/${id}/admins`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function addStudent - Adds a student to a class.
   * @param {string} id - The ID of the class.
   * @param {string} name - The name of the student.
   * @returns {Promise<Object>} - The response object.
   */
  async addStudent(id, name) {
    const response = await fetch(`${this.apiURL}/classes/${id}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function renameStudent - Renames a student in a class.
   * @param {string} id - The ID of the class.
   * @param {number} studentNumber - The student number of the student.
   * @param {string} name - The new name of the student.
   * @returns {Promise<Object>} - The response object.
   */
  async renameStudent(id, studentNumber, name) {
    const response = await fetch(
      `${this.apiURL}/classes/${id}/students/${studentNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );

    const data = await response.json();

    return data;
  }

  /**
   * @function deleteStudent - Deletes a student from a class.
   * @param {string} id - The ID of the class.
   * @param {number} studentNumber - The student number of the student.
   * @returns {Promise<Object>} - The response object.
   */
  async deleteStudent(id, studentNumber) {
    const response = await fetch(
      `${this.apiURL}/classes/${id}/students/${studentNumber}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  }

  /**
   * @function deleteClass - Deletes a class.
   * @param {string} id - The ID of the class.
   * @returns {Promise<Object>} - The response object.
   */
  async deleteClass(id) {
    const response = await fetch(`${this.apiURL}/classes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function createTask - Creates a task in a class.
   * @param {string} classId - The ID of the class.
   * @param {string} name - The name of the task.
   * @param {string} description - The description of the task.
   * @param {Object} options - The options of the task.
   * @returns {Promise<Object>} - The response object.
   */
  async createTask(classId, name, description, options) {
    const response = await fetch(`${this.apiURL}/classes/${classId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, options }),
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function getTasks - Gets all the tasks in a class.
   * @param {string} classId - The ID of the class.
   * @returns {Promise<Object>} - The response object.
   */
  async getTasks(classId) {
    const response = await fetch(`${this.apiURL}/classes/${classId}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function getTask - Gets a task by ID.
   * @param {string} taskId - The ID of the task.
   * @returns {Promise<Object>} - The response object.
   */
  async getTask(taskId) {
    const response = await fetch(`${this.apiURL}/tasks/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function getTaskProblems - Gets all the problems in a task for a student.
   * @param {string} taskId - The ID of the task.
   * @param {number} studentNumber - The student number of the student.
   * @returns {Promise<Object>} - The response object.
   */
  async getTaskProblems(taskId, studentNumber) {
    const response = await fetch(
      `${this.apiURL}/tasks/${taskId}/problems/${studentNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  }

  /**
   * @function renameTask - Renames a task.
   * @param {string} taskId - The ID of the task.
   * @param {string} name - The new name of the task.
   * @returns {Promise<Object>} - The response object.
   */
  async renameTask(taskId, name) {
    const response = await fetch(`${this.apiURL}/tasks/${taskId}/name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function updateTaskDescription - Updates the description of a task.
   * @param {string} taskId - The ID of the task.
   * @param {string} description - The new description of the task.
   * @returns {Promise<Object>} - The response object.
   */
  async updateTaskDescription(taskId, description) {
    const response = await fetch(`${this.apiURL}/tasks/${taskId}/description`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function updateGradingStatus - Updates the grading status of a task.
   * @param {string} taskId - The ID of the task.
   * @param {number} studentNumber - The student number of the student.
   * @param {boolean} graded - The grading status of the task.
   * @returns {Promise<Object>} - The response object.
   */
  async updateGradingStatus(taskId, studentNumber, graded) {
    const response = await fetch(
      `${this.apiURL}/tasks/${taskId}/grade/${studentNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ graded }),
      }
    );

    const data = await response.json();

    return data;
  }

  /**
   * @function deleteTask - Deletes a task.
   * @param {string} taskId - The ID of the task.
   * @returns {Promise<Object>} - The response object.
   */
  async deleteTask(taskId) {
    const response = await fetch(`${this.apiURL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  }
}
