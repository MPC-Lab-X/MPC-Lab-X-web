/**
 * @file public/js/app.js
 * @description Client-side main application.
 */

/**
 * @class UI
 */
class UI {
  /**
   * @constructor - Initializes the UI class.
   */
  constructor() {
    this.notifications = new Map();
  }

  /**
   * @function notify - Displays a notification message in an element.
   * @param {string} type - The type of notification.
   * @param {string | string[]} message - The message to display.
   * @param {string} status - The status of the notification.
   * @param {HTMLElement} parentElement - The parent element to append the notification to.
   * @param {string} messageGroup - The message group, auto-removes when a new message is added to the group.
   * @returns {HTMLElement} The notification element.
   */
  notification(type, message, status, parentElement, messageGroup) {
    let alert = document.createElement("div");

    let colorClasses = "";
    switch (status) {
      case "success":
        colorClasses = "text-green-800 border-green-300 bg-green-50";
        break;
      case "info":
        colorClasses = "text-gray-800 border-gray-300 bg-gray-50";
        break;
      case "warning":
        colorClasses = "text-yellow-800 border-yellow-300 bg-yellow-50";
        break;
      case "error":
        colorClasses = "text-red-800 border-red-300 bg-red-50";
        break;
      default:
        colorClasses = "text-gray-800 border-gray-300 bg-gray-50";
        break;
    }

    if (type === "alert") {
      alert.className = `flex items-center p-4 mt-2 mb-4 text-sm ${colorClasses} border rounded-lg`;
      alert.role = "alert";
      alert.innerHTML = `
          <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span class="sr-only">Info</span>
          <div>
            <span class="font-medium">${message}</span>
          </div>`;
    } else if (type === "list") {
      const messageAfterOne = message.slice(1);
      const list = messageAfterOne.map((item) => `<li>${item}</li>`).join("");

      alert.className = `flex p-4 mt-2 mb-4 text-sm ${colorClasses} rounded-lg`;
      alert.role = "alert";
      alert.innerHTML = `
          <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span class="sr-only">${message[0]}</span>
          <div>
            <span class="font-medium">Ensure that these requirements are met:</span>
            <ul class="mt-1.5 list-disc list-inside">
              ${list}
            </ul>
          </div>`;
    }

    parentElement.appendChild(alert);

    if (messageGroup) {
      if (this.notifications.has(messageGroup)) {
        this.notifications.get(messageGroup).remove();
      }

      this.notifications.set(messageGroup, alert);
    }

    return alert;
  }
}

/**
 * @class App
 */
class App {
  /**
   * @constructor - Initializes the App class.
   * @param {string} baseURL - The base URL of the application.
   * @param {string} apiURL - The API URL of the application.
   */
  constructor(baseURL, apiURL) {
    this.baseURL = baseURL;
    this.apiURL = apiURL;

    this.ui = new UI();

    this.data = {};
    this.path = "";
    this.auth = {
      authenticated: false,
      accessToken: "",
    };

    this.init();
  }

  /**
   * @function init - Initializes the App class.
   */
  async init() {
    this.initData();
    this.initUrl();
    await this.initAuth();
    this.initRedirect();
  }

  /**
   * @function initData - Initializes the data.
   */
  initData() {
    this.data = this.getData();
  }

  /**
   * @function initUrl - Initializes the URL.
   */
  initUrl() {
    this.path = window.location.pathname;
  }

  /**
   * @function initAuth - Initializes the authentication.
   */
  async initAuth() {
    if (this.data.auth?.accessToken) {
      this.auth.accessToken = this.data.auth.accessToken;
      this.auth.authenticated = true;
    } else {
      try {
        await this.authenticate();
        this.auth.authenticated = true;
      } catch (error) {
        if (!this.isPublicRoute(this.path)) {
          this.redirect(`${this.baseURL}/login`);
        }
      }
    }
  }

  /**
   * @function initRedirect - Initializes the redirect.
   */
  initRedirect() {
    if (this.isPublicRoute(this.path)) {
      if (this.isAuthRoute(this.path) && this.auth.authenticated) {
        this.redirect(`${this.baseURL}/dashboard`);
      }
    } else {
      if (!this.auth.authenticated) {
        this.redirect(`${this.baseURL}/login`);
      }
    }
  }

  /**
   * @function getData - Gets data from the local-storage.
   * @returns {Object} - The data from the local-storage.
   */
  getData() {
    return JSON.parse(localStorage.getItem("appData")) || {};
  }

  /**
   * @function setData - Sets data to the local-storage.
   * @param {Object} data - The data to be set in the local-storage.
   * @returns {Object} - The data set in the local-storage.
   * @throws {Error} - If the data is not an object.
   */
  setData(data) {
    if (typeof data !== "object") {
      throw new Error("Data must be an object.");
    }

    localStorage.setItem("appData", JSON.stringify(data));

    return data;
  }

  /**
   * @function saveData - Saves data to the local-storage.
   */
  saveData() {
    this.setData(this.data);
  }

  /**
   * @function setTokens - Sets the tokens in the data.
   * @param {String} accessToken - The access token.
   * @param {String} refreshToken - The refresh token.
   * @returns {Object} - The data with the tokens set.
   */
  setTokens(accessToken, refreshToken) {
    this.data.auth = {
      accessToken,
      refreshToken,
    };

    this.saveData();

    return this.data;
  }

  /**
   * @function authenticate - Authenticates the user. (refresh JWT token)
   * @throws {Error} - If the token is invalid or expired.
   */
  async authenticate() {
    const token = this.data.auth?.refreshToken;

    if (!token) {
      throw new Error("Invalid token.");
    }

    const response = await fetch(`${this.apiURL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid or expired token.");
    } else {
      const data = (await response.json()).data;

      this.data.auth.accessToken = data.accessToken;
      this.saveData();
    }
  }

  /**
   * @function isPublicRoute - Checks if the route is public.
   * @param {string} route - The route to check.
   * @returns {boolean} - True if the route is public, false otherwise.
   */
  isPublicRoute(route) {
    return [
      "/",
      "/about",
      "/features",
      "/api-docs",
      "/team",
      "/contact",
      "/login",
      "/register",
      "/register/complete",
      "/login",
      "/password-reset",
      "/password-reset/complete",
    ].includes(route);
  }

  /**
   * @function isAuthRoute - Checks if the route is for authentication purposes.
   * @param {string} route - The route to check.
   * @returns {boolean} - True if the route is authentication required, false otherwise.
   */
  isAuthRoute(route) {
    return [
      "/login",
      "/register",
      "/register/complete",
      "/password-reset",
      "/password-reset/complete",
    ].includes(route);
  }

  /**
   * @function redirect - Redirects the user to the specified URL.
   * @param {string} url - The URL to redirect to.
   */
  redirect(url) {
    if (window.location.href !== url) {
      window.location.href = url;
    }
  }

  /**
   * @function refresh - Refreshes the page.
   */
  refresh() {
    window.location.reload();
  }
}

// Initialize the App (Client-side)
const app = new App(window.location.origin, "/api");
