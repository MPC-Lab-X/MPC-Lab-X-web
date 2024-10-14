/**
 * @file public/js/components/problem-type-selector.js
 * @description Problem type selector component.
 */

class ProblemTypeSelector {
  /**
   * @constructor - Initializes the ProblemTypeSelector class.
   * @param {HTMLElement} element - The element to bind the component to.
   * @param {Object} problemIndex - The problem index.
   */
  constructor(element, problemIndex) {
    this.element = element;
    this.renderElement = element.querySelector("#problem-type-selector-list");
    this.searchInput = element.querySelector("#problem-type-search");
    this.headerElement = element.querySelector("#problem-type-selector-title");
    this.descriptionElement = element.querySelector(
      "#problem-type-selector-description"
    );
    this.closeButton = element.querySelector("#problem-type-selector-close");
    this.cancelButton = element.querySelector("#problem-type-selector-cancel");
    this.selectButton = element.querySelector("#problem-type-selector-select");
    this.problemIndex = problemIndex;

    this.toggledTopics = new Set();
    this.selectedProblemPath = null;
    this.selectedElement = null;
    this.selectPromises = [];

    this.render();
    this.addListeners();
  }

  /**
   * @method searchTree - Searches the tree for a query.
   * @param {string} query - The query to search for.
   * @param {Object} node - The node to search.
   * @param {Array} currentPath - The current path.
   * @returns {Object} The matched tree.
   */
  searchTree(query, node, currentPath = []) {
    if (!query) return node;

    let matchedTree = {};

    // Recursively search for matching topics or problem types
    for (const key in node) {
      const item = node[key];

      const match =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        currentPath.some((p) => p.toLowerCase().includes(query.toLowerCase()));

      if (item.topics) {
        const matchedSubtree = this.searchTree(query, item.topics, [
          ...currentPath,
          item.name,
        ]);

        if (Object.keys(matchedSubtree).length > 0 || match) {
          matchedTree[key] = {
            ...item,
            topics: matchedSubtree,
            isMatched: match || Object.keys(matchedSubtree).length > 0, // Mark as matched if it or its subtree matches
          };
        }
      } else if (match) {
        matchedTree[key] = { ...item, isMatched: true }; // Direct match
      }
    }

    return matchedTree;
  }

  /**
   * @method renderFilteredTopics - Renders the filtered topics.
   * @param {string} query - The query to filter by.
   */
  renderFilteredTopics(query) {
    const filteredTopics = this.searchTree(query, this.problemIndex);
    this.renderTopics(filteredTopics);
  }

  /**
   * @method render - Renders the component.
   */
  render() {
    this.renderTopics(this.problemIndex);
  }

  /**
   * @method renderTopics - Renders the topics.
   * @param {Object} problemTree - The problem tree to render.
   * @returns {HTMLElement} The rendered topics.
   */
  renderTopics(problemTree) {
    const renderTopicsRecursive = (topic, parentElement, currentPath) => {
      const topicElement = document.createElement("button");
      const subTopicsElement = document.createElement("ul");

      subTopicsElement.className = `ml-4 ${topic.isMatched ? "" : "hidden"}`;

      const highlightedName = this.highlightMatch(
        topic.name,
        this.searchInput.value
      );
      const highlightedDescription = this.highlightMatch(
        topic.description || "",
        this.searchInput.value
      );

      if (topic.topics) {
        topicElement.innerHTML = `
          <div>${highlightedName}</div>
          <small class="text-gray-500">${highlightedDescription}</small>
        `;
        topicElement.className = `w-full text-left mt-2 py-2 px-4 rounded hover:bg-primary-100 transition duration-300 ${
          topic.isMatched ? "bg-yellow-300" : ""
        }`;

        topicElement.addEventListener("click", () => {
          this.toggleTopic(subTopicsElement);
        });

        for (const subTopic in topic.topics) {
          const subTopicElement = document.createElement("li");
          subTopicElement.className = "relative";
          renderTopicsRecursive(topic.topics[subTopic], subTopicElement, [
            ...currentPath,
            subTopic,
          ]);
          subTopicsElement.appendChild(subTopicElement);
        }
      } else {
        topicElement.innerHTML = `
          <div>${highlightedName}</div>
          <small class="text-gray-500">${highlightedDescription}</small>
        `;
        topicElement.className = `w-full text-left mt-2 py-2 px-4 rounded hover:bg-primary-300 transition duration-300 ${
          topic.isMatched ? "bg-yellow-300" : ""
        }`;

        topicElement.addEventListener("click", () => {
          this.toggleProblemType(topic, currentPath, topicElement);
        });
      }

      parentElement.appendChild(topicElement);
      parentElement.appendChild(subTopicsElement);
    };

    this.renderElement.innerHTML = "";

    for (const topicKey in problemTree) {
      const topicElement = document.createElement("li");
      renderTopicsRecursive(problemTree[topicKey], topicElement, [topicKey]);
      this.renderElement.appendChild(topicElement);
    }
  }

  /**
   * @method highlightMatch - Highlights the matched text.
   * @param {string} text - The text to highlight.
   * @param {string} query - The query to highlight.
   * @returns {string} The highlighted text.
   */
  highlightMatch(text, query) {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      (match) => `<span class="font-bold text-accent-200">${match}</span>`
    );
  }

  /**
   * @method addListeners - Adds event listeners to the component.
   */
  addListeners() {
    this.closeButton.addEventListener("click", () => this.hide());
    this.cancelButton.addEventListener("click", () => this.hide());
    this.selectButton.addEventListener("click", () => this.select());

    this.searchInput.addEventListener("input", (event) => {
      this.renderFilteredTopics(event.target.value);
    });
  }

  /**
   * @method toggleTopic - Toggles the topic.
   * @param {HTMLElement} subTopicsElement - The sub topics element.
   */
  toggleTopic(subTopicsElement) {
    subTopicsElement.classList.toggle("hidden");
    subTopicsElement.scrollIntoView({ behavior: "smooth" });
    this.toggledTopics.add(subTopicsElement);
  }

  /**
   * @method toggleProblemType - Toggles the problem type.
   * @param {Object} problemType - The problem type to toggle.
   * @param {Array} problemPath - The problem path.
   * @param {HTMLElement} element - The element to toggle.
   */
  toggleProblemType(problemType, problemPath, element) {
    if (this.selectedElement) {
      this.selectedElement.classList.remove("bg-blue-300");
    }

    element.classList.add("bg-blue-300");
    this.selectedElement = element;

    this.headerElement.textContent = problemType.name;
    this.descriptionElement.textContent = problemType.description;
    const descriptionContainer = this.element.querySelector(
      "#problem-type-selector-description-container"
    );
    descriptionContainer.classList.remove("hidden");
    descriptionContainer.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    this.selectButton.classList.remove("hidden");

    this.selectedProblemPath = problemPath;
  }

  /**
   * @method show - Shows the component.
   * @returns {Promise<Array>} The problem path.
   */
  async show() {
    this.element.classList.remove("hidden");

    return new Promise((resolve, reject) => {
      this.selectPromises.push({ resolve, reject });
    });
  }

  /**
   * @method hide - Hides the component.
   */
  hide() {
    for (const selectPromise of this.selectPromises) {
      selectPromise.reject();
    }

    for (const toggledTopic of this.toggledTopics) {
      toggledTopic.classList.add("hidden");
    }
    this.element.classList.add("hidden");
    this.renderFilteredTopics(""); // Clear search results
    this.toggledTopics.clear();
    this.headerElement.textContent = "";
    this.descriptionElement.textContent = "";
    this.selectButton.classList.add("hidden");
    this.selectedProblemPath = null;
    this.selectPromises = [];
  }

  /**
   * @method select - Problem type selected.
   */
  select() {
    for (const selectPromise of this.selectPromises) {
      selectPromise.resolve(this.selectedProblemPath);
    }

    this.selectPromises = [];

    this.hide();
  }
}
