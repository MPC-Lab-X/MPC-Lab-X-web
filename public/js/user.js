/**
 * @file public/js/user.js
 * @description User class.
 */

class User {
  /**
   * @constructor - Initializes the User class.
   * @param {Object} app - The App class.
   */
  constructor(app) {
    this.app = app;
    this.baseURL = app.baseURL;
    this.apiURL = app.apiURL;
  }

  /**
   * @function getUser - Gets the user data.
   * @param {string} userId - The user ID.
   * @returns {Promise<Object>} - The response object.
   * @throws {Error} - The error object.
   */
  async getUser(userId = this.app.auth.userId) {
    const response = await fetch(`${this.apiURL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  }

  /**
   * @function getSafetyRecords - Gets the safety records of a user.
   * @param {number} limit - The number of records to return.
   * @param {number} offset - The number of records to skip.
   * @returns {Promise<Object>} - The response object.
   * @throws {Error} - The error object.
   */
  async getSafetyRecords(limit = 10, offset = 0) {
    const response = await fetch(
      `${this.apiURL}/users/${this.app.auth.userId}/safety-records?limit=${limit}&offset=${offset}`,
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
   * @function updateUsername - Updates the username of a user.
   * @param {string} username - The new username.
   * @returns {Promise<Object>} - The response object.
   * @throws {Error} - The error object.
   */
  async updateUsername(username) {
    const response = await fetch(
      `${this.apiURL}/users/${this.app.auth.userId}/username`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }
    );

    const data = await response.json();

    return data;
  }

  /**
   * @function updateDisplayName - Updates the display name of a user.
   * @param {string} displayName - The new display name.
   * @returns {Promise<Object>} - The response object.
   * @throws {Error} - The error object.
   */
  async updateDisplayName(displayName) {
    const response = await fetch(
      `${this.apiURL}/users/${this.app.auth.userId}/display-name`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName }),
      }
    );

    const data = await response.json();

    return data;
  }

  /**
   * @function updateEmail - Updates the email of a user.
   * @param {string} email - The new email.
   * @returns {Promise<Object>} - The response object.
   * @throws {Error} - The error object.
   */
  async updateEmail(email) {
    const callbackUrl = `${this.baseURL}/user/settings/complete-email-update`;

    const response = await fetch(
      `${this.apiURL}/users/${this.app.auth.userId}/email`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, callbackUrl }),
      }
    );

    const data = await response.json();

    return data;
  }

  /**
   * @function completeEmailUpdate - Completes the email update of a user.
   * @param {string} token - The email update token.
   * @returns {Promise<Object>} - The response object.
   * @throws {Error} - The error object.
   */
  async completeEmailUpdate(token) {
    const response = await fetch(
      `${this.apiURL}/users/${this.app.auth.userId}/email/complete`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const data = await response.json();

    return data;
  }

  /**
   * @function updatePassword - Updates the password of a user.
   * @param {string} currentPassword - The current password.
   * @param {string} newPassword - The new password.
   * @returns {Promise<Object>} - The response object.
   * @throws {Error} - The error object.
   */
  async updatePassword(currentPassword, newPassword) {
    const response = await fetch(
      `${this.apiURL}/users/${this.app.auth.userId}/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );

    const data = await response.json();

    return data;
  }
}
