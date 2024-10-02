/**
 * @file public/js/app.js
 * @description Client-side main application.
 */

/**
 * @class Data
 * @description Handles the data of the application.
 */
class Data {
  /**
   * @constructor - Initializes the Data class.
   * @param {Object} app - The App class instance.
   */
  constructor(app) {
    this.app = app;
    this.key = "appData";
    this._data = this.loadData();

    return this.createProxy(this._data);
  }

  /**
   * @function createProxy - Creates a proxy for the data object.
   * @param {Object} data - The data object to proxy.
   * @returns {Object} - The proxied data object.
   */
  createProxy(data) {
    const handler = {
      set: (target, prop, value) => {
        if (typeof value === "object" && value !== null) {
          value = this.createProxy(value);
        }
        target[prop] = value;
        this.saveData(); // Save data when any property is set
        return true;
      },
      get: (target, prop) => {
        if (prop in target) {
          if (typeof target[prop] === "object" && target[prop] !== null) {
            return this.createProxy(target[prop]);
          }
          return target[prop];
        }
        return undefined;
      },
    };

    return new Proxy(data, handler);
  }

  /**
   * @function loadData - Loads data from the local-storage.
   */
  loadData() {
    const storedData = localStorage.getItem(this.key);
    return storedData ? JSON.parse(storedData) : {};
  }

  /**
   * @function saveData - Saves data to the local-storage.
   */
  saveData() {
    localStorage.setItem(this.key, JSON.stringify(this._data));
  }
}

/**
 * @class Auth
 * @description Handles the authentication of the application.
 */
class Auth {
  /**
   * @constructor - Initializes the Auth class.
   * @param {Object} app - The App class instance.
   */
  constructor(app) {
    this.app = app;

    this.authenticated = false;
    this.userId = this.app.data.auth?.userId;
    this.accessToken = this.app.data.auth?.accessToken;
    this.refreshToken = this.app.data.auth?.refreshToken;
  }

  /**
   * @function init - Initializes the Auth class.
   * @returns {boolean} - True if the user is authenticated, false otherwise.
   */
  async init() {
    this.setFetch();
    if (this.accessToken) {
      this.authenticated = true;
    } else if (this.refreshToken) {
      try {
        await this.authenticate();
        this.authenticated = true;
      } catch (error) {
        return false;
      }
    }
    return this.authenticated;
  }

  /**
   * @function setFetch - Replacement for the fetch function with the access token.
   */
  setFetch() {
    if (!this.accessToken) {
      return;
    }

    window.originalFetch = window.originalFetch || window.fetch;

    window.fetch = async function (url, options = {}) {
      if (this.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${this.accessToken}`,
        };
      }

      const refreshToken = async () => {
        try {
          await this.authenticate();

          options.headers.Authorization = `Bearer ${this.accessToken}`;

          let response = await window.originalFetch(url, options);
          return response;
        } catch (error) {
          this.destroy();
          this.app.location.init();
        }
      };

      try {
        let response = await window.originalFetch(url, options);
        if (response.status === 401) {
          return await refreshToken();
        } else {
          return response;
        }
      } catch (error) {
        return await refreshToken();
      }
    }.bind(this);
  }

  /**
   * @function authenticate - Authenticates the user. (refresh JWT token)
   * @throws {Error} - If the token is invalid or expired.
   */
  async authenticate() {
    if (!this.refreshToken) {
      throw new Error("Invalid or expired token.");
    }

    const response = await fetch(`${this.app.apiURL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: this.refreshToken,
      }),
    });

    if (!response.ok) {
      this.authenticated = false;
      this.removeTokens();
      this.app.location.init();
      throw new Error("Invalid or expired token.");
    } else {
      const data = (await response.json()).data;

      this.authenticated = true;

      this.accessToken = data.accessToken;
      this.app.data.auth.accessToken = data.accessToken;

      this.setFetch();
    }
  }

  /**
   * @function set - Sets the user id and tokens.
   * @param {String} userId - The user ID.
   * @param {String} accessToken - The access token.
   * @param {String} refreshToken - The refresh token.
   * @returns {Object} - The data with the tokens set.
   */
  set(userId, accessToken, refreshToken) {
    this.app.data.auth = {
      userId,
      accessToken,
      refreshToken,
    };
    this.setFetch();
  }

  /**
   * @function destroy - Destroys the tokens.
   */
  destroy() {
    this.app.data.auth = {};
    this.setFetch();
  }
}

/**
 * @class Location
 * @description Handles the location of the application.
 */
class Location {
  /**
   * @constructor - Initializes the Location class.
   * @param {Object} app - The App class instance.
   */
  constructor(app) {
    this.app = app;

    this.path = window.location.pathname;
  }

  /**
   * @function init - Initializes the redirect.
   */
  init() {
    if (this.isPublicRoute(this.path)) {
      if (this.isAuthRoute(this.path) && this.app.auth.authenticated) {
        this.redirect(`${this.app.baseURL}/dashboard`);
      }
    } else {
      if (!this.app.auth.authenticated) {
        this.redirect(`${this.app.baseURL}/login`);
      }
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

  /**
   * @function showNotFound - Shows the 404 page.
   */
  showNotFound() {
    this.redirect(`${this.app.baseURL}/404?path=${this.path}`);
  }

  /**
   * @function showForbidden - Shows the 403 page.
   */
  showForbidden() {
    this.redirect(`${this.app.baseURL}/403?page=${this.path}`);
  }
}

/**
 * @class UI
 * @description Handles the user interface of the application.
 */
class UI {
  /**
   * @constructor - Initializes the UI class.
   * @param {Object} app - The App class instance.
   */
  constructor(app) {
    this.app = app;

    this.notifications = new Map();
  }

  /**
   * @function init - Initializes the UI class.
   */
  async init() {
    function init() {
      this.updateHeader(this.app.auth.authenticated);
    }

    document.addEventListener("DOMContentLoaded", init.bind(this));
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      init.bind(this)();
    }
  }

  /**
   * @function updateHeader - Updates the header based on the authentication status.
   * @param {boolean} authenticated - The authentication status.
   */
  updateHeader(authenticated) {
    const header = document.querySelector("header");

    if (header && authenticated) {
      const loginLink = header.querySelector("[href='/login']");
      const registerLink = header.querySelector("[href='/register']");

      if (loginLink) {
        loginLink.textContent = "Dashboard";
        loginLink.href = "/dashboard";
      }

      if (registerLink) {
        registerLink.textContent = "Profile";
        registerLink.href = "/user";
      }
    }
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
 * @description Main application class.
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

    this.data = new Data(this);
    this.auth = new Auth(this);
    this.location = new Location(this);
    this.ui = new UI(this);

    this.init();
  }

  /**
   * @function init - Initializes the App class.
   */
  async init() {
    await this.auth.init();
    this.location.init();
    this.ui.init();
  }
}

// Initialize the App (Client-side)
const app = new App(window.location.origin, "/api");
