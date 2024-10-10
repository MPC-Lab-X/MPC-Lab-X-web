/**
 * @file public/js/components/loading-bar.js
 * @description Loading bar component.
 */

(function () {
  const loadingBarContainer = document.createElement("div");
  loadingBarContainer.className = "fixed top-0 left-0 w-full z-50 hidden";
  loadingBarContainer.innerHTML = `<div class="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-300 to-primary-200 transition-all duration-300 ease-linear"></div>`;
  document.body.appendChild(loadingBarContainer);

  const loadingBar = loadingBarContainer.querySelector("div");

  function startLoading() {
    loadingBarContainer.style.display = "block";
    loadingBar.style.width = "0%";
  }

  function updateLoading(value) {
    loadingBar.style.width = value + "%";
  }

  function endLoading() {
    loadingBar.style.width = "100%";
    setTimeout(() => {
      loadingBarContainer.style.display = "none";
      loadingBar.style.width = "0%";
    }, 400);
  }

  window.addEventListener("load", () => {
    endLoading();
  });

  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    startLoading();
    updateLoading(10);
    try {
      const response = await originalFetch(...args);
      updateLoading(50);
      return response;
    } finally {
      endLoading();
    }
  };

  startLoading();
})();
