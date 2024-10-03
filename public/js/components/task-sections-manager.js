/**
 * @file public/js/components/task-sections-manager.js
 * @description Task sections manager component.
 */

class TaskSectionsManager {
  /**
   * @constructor - Initializes the TaskSectionsManager class.
   * @param {HTMLElement} element - The element to bind the component to.
   * @param {Object} problemIndex - The problem index.
   */
  constructor(element, problemIndex) {
    this.element = element;

    this.problemIndex = problemIndex;

    this.topicId = 0;
    this.topics = new Map();
  }

  /**
   * @function getTopic - Gets a topic by path.
   * @param {Array} path - The path to the topic.
   * @returns {Object} - The topic.
   */
  getTopic(path) {
    let topic = this.problemIndex;
    for (let i = 0; i < path.length; i++) {
      for (const key in topic) {
        if (key === path[i]) {
          if (topic[key].topics) {
            topic = topic[key].topics;
          } else {
            topic = topic[key];
          }
          break;
        }
      }
    }

    return topic;
  }

  /**
   * @function getDefaults - Returns the default options for a topic.
   * @param {Object} parameters - The parameters to set.
   * @returns {Object} - The default options.
   */
  getDefaults(parameters) {
    let defaults = {
      count: 1,
    };

    for (const key in parameters) {
      defaults[key] = parameters[key].default;
    }

    return defaults;
  }

  /**
   * @function newTopic - Adds a new topic (section) to the topics map.
   * @param {Array} path - The path to the section.
   * @param {Object} topic - The topic to add.
   */
  newTopic(path, topic) {
    this.topics.set(this.topicId, {
      path,
      options: this.getDefaults(topic.parameters),
    });

    this.topicId++;
  }

  /**
   * @function editTopic - Edits a topic (section) in the topics map.
   * @param {number} topicId - The ID of the topic.
   * @param {Array} path - The path to the section.
   * @param {Object} topic - The topic to add.
   */
  editTopic(topicId, path, topic) {
    this.topics.set(topicId, {
      path,
      options: this.getDefaults(topic.parameters),
    });
  }

  /**
   * @function deleteTopic - Deletes a topic (section) from the topics map.
   * @param {number} topicId - The ID of the topic.
   */
  deleteTopic(topicId) {
    this.topics.delete(topicId);
  }

  /**
   * @function renderSection - Renders a section (topic) to the element.
   * @param {number} topicId - The ID of the topic.
   */
  renderSection(topicId) {
    const topic = this.topics.get(topicId);
    const topicData = this.getTopic(topic.path);
    const path = topic.path;
    const options = topic.options;

    const topicElement = document.createElement("div");
    topicElement.className = "bg-background-50 shadow-md rounded-lg p-6";

    const headerElement = document.createElement("div");
    headerElement.className = "flex justify-between items-center mb-4";
    headerElement.innerHTML = `
        <div>
          <h3 class="text-lg font-semibold">${topicData.name}</h3>
          <p class="text-gray-600">${path.join(" > ")}</p>
          <p class="text-sm text-gray-600">${topicData.description}</p>
        </div>
    `;

    const actionsElement = document.createElement("div");
    actionsElement.className = "flex space-x-4";

    const editButton = document.createElement("button");
    editButton.className =
      "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition duration-200";
    editButton.innerHTML = "Edit";
    editButton.addEventListener("click", () => {
      this.editSection(topicId);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className =
      "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition duration-200";
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", () => {
      this.deleteSection(topicId);
    });

    actionsElement.appendChild(editButton);
    actionsElement.appendChild(deleteButton);

    headerElement.appendChild(actionsElement);

    const questionsCount = document.createElement("div");
    questionsCount.className = "mb-4";
    questionsCount.innerHTML = `
        <label class="block text-sm font-medium text-gray-700">Number of questions</label>
    `;

    const questionsCountInput = document.createElement("input");
    questionsCountInput.type = "number";
    questionsCountInput.min = 1;
    questionsCountInput.max = 1000;
    questionsCountInput.className =
      "p-3 border border-gray-300 rounded-md w-full mt-1";
    questionsCountInput.value = options.count;

    questionsCountInput.addEventListener("change", (event) => {
      this.topics.get(topicId).options.count = Number(event.target.value);
    });

    const questionsCountDescription = document.createElement("p");
    questionsCountDescription.className = "text-gray-500 text-sm";
    questionsCountDescription.innerHTML =
      "The number of questions to generate.";

    questionsCount.appendChild(questionsCountInput);
    questionsCount.appendChild(questionsCountDescription);

    const parametersElement = document.createElement("div");
    parametersElement.className = "mb-4";
    for (const key in topicData.parameters) {
      const parameter = topicData.parameters[key];

      const parameterElement = document.createElement("div");
      parameterElement.className = "mb-4";
      parameterElement.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">${parameter.name}</label>
        `;

      switch (parameter.type) {
        case "text": {
          const textInput = document.createElement("input");
          textInput.type = "text";
          textInput.className =
            "p-3 border border-gray-300 rounded-md w-full mt-1";
          textInput.value = options[key];
          textInput.addEventListener("change", (event) => {
            this.topics.get(topicId).options[key] = event.target.value;
          });

          parameterElement.appendChild(textInput);
          break;
        }
        case "number": {
          const numberInput = document.createElement("input");
          const numberInputNumber = document.createElement("input");

          numberInput.type = "range";
          numberInput.min = parameter.min;
          numberInput.max = parameter.max;
          numberInput.className = "w-full mt-1";
          numberInput.value = options[key];
          numberInput.addEventListener("change", (event) => {
            numberInputNumber.value = event.target.value;
            this.topics.get(topicId).options[key] = Number(event.target.value);
          });

          numberInputNumber.type = "number";
          numberInputNumber.min = parameter.min;
          numberInputNumber.max = parameter.max;
          numberInputNumber.className =
            "p-3 border border-gray-300 rounded-md mt-1 w-full";
          numberInputNumber.value = options[key];
          numberInputNumber.addEventListener("change", (event) => {
            numberInput.value = event.target.value;
            this.topics.get(topicId).options[key] = Number(event.target.value);
          });

          parameterElement.appendChild(numberInput);
          parameterElement.appendChild(numberInputNumber);
          break;
        }
        case "boolean": {
          const booleanInputLabel = document.createElement("label");
          booleanInputLabel.className = "inline-flex items-center mt-1";

          const booleanInput = document.createElement("input");
          booleanInput.type = "checkbox";
          booleanInput.className =
            "toggle-checkbox appearance-none w-10 h-5 bg-gray-300 rounded-full checked:bg-green-500 transition-all duration-200 relative";
          booleanInput.checked = options[key];
          booleanInput.addEventListener("change", (event) => {
            this.topics.get(topicId).options[key] = event.target.checked;
          });

          const booleanInputText = document.createElement("span");
          booleanInputText.className = "ml-3";
          booleanInputText.innerHTML = "Enable";

          booleanInputLabel.appendChild(booleanInput);
          booleanInputLabel.appendChild(booleanInputText);

          parameterElement.appendChild(booleanInputLabel);
        }
      }

      const parameterDescription = document.createElement("p");
      parameterDescription.className = "text-gray-500 text-sm";
      parameterDescription.innerHTML = parameter.description;

      parameterElement.appendChild(parameterDescription);
      parametersElement.appendChild(parameterElement);
    }

    topicElement.appendChild(headerElement);
    topicElement.appendChild(questionsCount);
    topicElement.appendChild(parametersElement);

    if (this.topics.get(topicId)._element) {
      this.topics.get(topicId)._element.replaceWith(topicElement);
    } else {
      this.topics.get(topicId)._element = topicElement;
      this.element.appendChild(topicElement);
    }
  }

  /**
   * @function newSection - Adds a new section (topic) to the task.
   * @param {Array} path - The path to the section.
   */
  newSection(path) {
    const topic = this.getTopic(path);
    const topicId = this.topicId;

    this.newTopic(path, topic);
    this.renderSection(topicId);

    this.topicId++;
  }

  /**
   * @function editSection - Edits a section (topic) in the task.
   * @param {number} topicId - The ID of the topic.
   */
  editSection(topicId) {
    const topic = this.topics.get(topicId);
    const path = topic.path;

    this.editTopic(topicId, path, this.getTopic(path));
    this.renderSection(topicId);
  }

  /**
   * @function deleteSection - Deletes a section (topic) from the task.
   * @param {number} topicId - The ID of the topic.
   */
  deleteSection(topicId) {
    this.topics.get(topicId)._element.remove();
    this.deleteTopic(topicId);
  }

  /**
   * @function getTopics - Gets the topics of the task. (converts the map to an array, removing the _element property, and the keys)
   * @returns {Array} - The topics.
   */
  getTopics() {
    return Array.from(this.topics.values()).map((topic) => {
      const { _element, ...rest } = topic;
      return rest;
    });
  }
}
