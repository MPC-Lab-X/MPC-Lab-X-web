/**
 * @file public/js/components/task-sections-manager.js
 * @description Task sections manager component.
 */

class TaskSectionsManager {
  /**
   * @constructor - Initializes the TaskSectionsManager class.
   * @param {HTMLElement} element - The element to bind the component to.
   * @param {Object} problemIndex - The problem index.
   * @param {boolean} demoMode - Whether the task is in demo mode.
   */
  constructor(element, problemIndex, demoMode) {
    this.element = element;
    this.problemIndex = problemIndex;
    this.demoMode = demoMode;

    this.topicId = 0;
    this.topics = new Map();
  }

  /**
   * @method getTopic - Gets a topic by path.
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
   * @method getDefaults - Returns the default options for a topic.
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
   * @method newTopic - Adds a new topic (section) to the topics map.
   * @param {Array} path - The path to the section.
   * @param {Object} topic - The topic to add.
   * @param {Function} onEdit - The function to call when editing the section.
   */
  newTopic(path, topic, onEdit) {
    this.topics.set(this.topicId, {
      path,
      options: this.getDefaults(topic.parameters),
      _onEdit: onEdit,
    });

    this.topicId++;
  }

  /**
   * @method editTopic - Edits a topic (section) in the topics map.
   * @param {number} topicId - The ID of the topic.
   * @param {Array} path - The path to the section.
   * @param {Object} topic - The topic to add.
   */
  editTopic(topicId, path, topic) {
    const previousTopic = this.topics.get(topicId);
    this.topics.set(topicId, {
      path,
      options: this.getDefaults(topic.parameters),
      _element: previousTopic._element,
      _onEdit: previousTopic._onEdit,
    });
  }

  /**
   * @method deleteTopic - Deletes a topic (section) from the topics map.
   * @param {number} topicId - The ID of the topic.
   */
  deleteTopic(topicId) {
    this.topics.delete(topicId);
  }

  /**
   * @method renderSection - Renders a section (topic) to the element.
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
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      topic._onEdit(topicId);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className =
      "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition duration-200";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      this.deleteSection(topicId);
    });

    actionsElement.appendChild(editButton);
    if (!this.demoMode) actionsElement.appendChild(deleteButton);

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

    questionsCountInput.addEventListener("input", (event) => {
      const value = Number(event.target.value);
      if (value < event.target.min) {
        event.target.value = event.target.min;
      } else if (value > event.target.max) {
        event.target.value = event.target.max;
      }
      this.topics.get(topicId).options.count = value;
    });

    const questionsCountDescription = document.createElement("p");
    questionsCountDescription.className = "text-gray-500 text-sm";
    questionsCountDescription.innerHTML =
      "The number of questions to generate.";

    if (!this.demoMode) {
      questionsCount.appendChild(questionsCountInput);
      questionsCount.appendChild(questionsCountDescription);
    } else {
      questionsCount.appendChild(questionsCountDescription);

      const notAvailable = document.createElement("p");
      notAvailable.className = "text-red-500 text-sm mt-1";
      notAvailable.innerHTML = "Not available in demo mode.";
      questionsCount.appendChild(notAvailable);
    }

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
          textInput.addEventListener("input", (event) => {
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
          numberInput.addEventListener("input", (event) => {
            const value = Number(event.target.value);
            if (value < event.target.min) {
              event.target.value = event.target.min;
            } else if (value > event.target.max) {
              event.target.value = event.target.max;
            }
            numberInputNumber.value = event.target.value;
            this.topics.get(topicId).options[key] = value;
          });

          numberInputNumber.type = "number";
          numberInputNumber.min = parameter.min;
          numberInputNumber.max = parameter.max;
          numberInputNumber.className =
            "p-3 border border-gray-300 rounded-md mt-1 w-full";
          numberInputNumber.value = options[key];
          numberInputNumber.addEventListener("input", (event) => {
            const value = Number(event.target.value);
            if (value < event.target.min) {
              event.target.value = event.target.min;
            } else if (value > event.target.max) {
              event.target.value = event.target.max;
            }
            numberInput.value = event.target.value;
            this.topics.get(topicId).options[key] = value;
          });

          parameterElement.appendChild(numberInput);
          parameterElement.appendChild(numberInputNumber);
          break;
        }
        case "range": {
          const rangeContainer = document.createElement("div");
          rangeContainer.className = "relative w-full mt-4 h-8";

          const rangeFill = document.createElement("div");
          rangeFill.className =
            "absolute h-1 bg-blue-500 top-1/2 transform -translate-y-1/2 rounded";

          const rangeMinInput = document.createElement("input");
          rangeMinInput.type = "range";
          rangeMinInput.min = parameter.min;
          rangeMinInput.max = parameter.max;
          rangeMinInput.value = options[key]?.min ?? parameter.min;
          rangeMinInput.className =
            "absolute w-full appearance-none bg-transparent pointer-events-auto z-10";

          const rangeMaxInput = document.createElement("input");
          rangeMaxInput.type = "range";
          rangeMaxInput.min = parameter.min;
          rangeMaxInput.max = parameter.max;
          rangeMaxInput.value = options[key]?.max ?? parameter.max;
          rangeMaxInput.className =
            "absolute w-full appearance-none bg-transparent pointer-events-auto z-10";
          rangeMaxInput.style.top = "14px";

          const rangeMinValueInput = document.createElement("input");
          rangeMinValueInput.type = "number";
          rangeMinValueInput.min = parameter.min;
          rangeMinValueInput.max = parameter.max;
          rangeMinValueInput.value = options[key]?.min ?? parameter.min;
          rangeMinValueInput.className =
            "p-2 border border-gray-300 rounded mt-2 w-1/2";

          const rangeMaxValueInput = document.createElement("input");
          rangeMaxValueInput.type = "number";
          rangeMaxValueInput.min = parameter.min;
          rangeMaxValueInput.max = parameter.max;
          rangeMaxValueInput.value = options[key]?.max ?? parameter.max;
          rangeMaxValueInput.className =
            "p-2 border border-gray-300 rounded mt-2 w-1/2";

          const updateValues = (event) => {
            let minValue = Number(rangeMinInput.value);
            let maxValue = Number(rangeMaxInput.value);

            if (minValue > maxValue) {
              if (event.target === rangeMinInput) {
                minValue = maxValue - 1;
              } else {
                maxValue = minValue + 1;
              }
            }

            rangeMinInput.value = minValue;
            rangeMaxInput.value = maxValue;

            rangeMinValueInput.value = minValue;
            rangeMaxValueInput.value = maxValue;

            const minPercent =
              ((minValue - parameter.min) / (parameter.max - parameter.min)) *
              100;
            const maxPercent =
              ((maxValue - parameter.min) / (parameter.max - parameter.min)) *
              100;

            rangeFill.style.left = `${minPercent}%`;
            rangeFill.style.width = `${maxPercent - minPercent}%`;

            this.topics.get(topicId).options[key] = {
              min: minValue,
              max: maxValue,
            };
          };

          const onRangeClick = (event) => {
            const rect = rangeContainer.getBoundingClientRect();
            const clickPosition =
              ((event.clientX - rect.left) / rect.width) *
                (parameter.max - parameter.min) +
              parameter.min;

            const minDistance = Math.abs(
              clickPosition - Number(rangeMinInput.value)
            );
            const maxDistance = Math.abs(
              clickPosition - Number(rangeMaxInput.value)
            );

            if (minDistance < maxDistance) {
              rangeMinInput.value = Math.min(
                clickPosition,
                Number(rangeMaxInput.value) - 1
              );
            } else {
              rangeMaxInput.value = Math.max(
                clickPosition,
                Number(rangeMinInput.value) + 1
              );
            }
            updateValues();
          };

          rangeContainer.addEventListener("click", onRangeClick);

          rangeMinInput.addEventListener("input", updateValues);
          rangeMaxInput.addEventListener("input", updateValues);

          rangeMinValueInput.addEventListener("input", (event) => {
            let value = Math.max(Number(event.target.value), parameter.min);
            value = Math.min(value, Number(rangeMaxInput.value) - 1);
            rangeMinInput.value = value;
            updateValues();
          });

          rangeMaxValueInput.addEventListener("input", (event) => {
            let value = Math.min(Number(event.target.value), parameter.max);
            value = Math.max(value, Number(rangeMinInput.value) + 1);
            rangeMaxInput.value = value;
            updateValues();
          });

          updateValues();

          rangeContainer.appendChild(rangeFill);
          rangeContainer.appendChild(rangeMinInput);
          rangeContainer.appendChild(rangeMaxInput);

          parameterElement.appendChild(rangeContainer);
          parameterElement.appendChild(rangeMinValueInput);
          parameterElement.appendChild(rangeMaxValueInput);
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
          booleanInputText.textContent = "Enable";

          booleanInputLabel.appendChild(booleanInput);
          booleanInputLabel.appendChild(booleanInputText);

          parameterElement.appendChild(booleanInputLabel);
          break;
        }
      }

      const parameterDescription = document.createElement("p");
      parameterDescription.className = "text-gray-500 text-sm";
      parameterDescription.textContent = parameter.description;

      parameterElement.appendChild(parameterDescription);
      parametersElement.appendChild(parameterElement);
    }

    topicElement.appendChild(headerElement);
    topicElement.appendChild(questionsCount);
    topicElement.appendChild(parametersElement);

    if (this.topics.get(topicId)._element) {
      this.topics
        .get(topicId)
        ._element.parentElement.replaceChild(
          topicElement,
          this.topics.get(topicId)._element
        );
      this.topics.get(topicId)._element = topicElement;
    } else {
      this.topics.get(topicId)._element = topicElement;
      this.element.appendChild(topicElement);
    }
  }

  /**
   * @method newSection - Adds a new section (topic) to the task.
   * @param {Array} path - The path to the section.
   * @param {Function} onEdit - The function to call when editing the section.
   */
  newSection(path, onEdit) {
    const topic = this.getTopic(path);
    const topicId = this.topicId;

    this.newTopic(path, topic, onEdit);
    this.renderSection(topicId);

    this.topicId++;
  }

  /**
   * @method editSection - Edits a section (topic) in the task.
   * @param {number} topicId - The ID of the topic.
   * @param {Array} path - The path to the section.
   */
  editSection(topicId, path) {
    const topic = this.getTopic(path);

    this.editTopic(topicId, path, topic);
    this.renderSection(topicId);
  }

  /**
   * @method deleteSection - Deletes a section (topic) from the task.
   * @param {number} topicId - The ID of the topic.
   */
  deleteSection(topicId) {
    this.topics.get(topicId)._element.remove();
    this.deleteTopic(topicId);
  }

  /**
   * @method deleteAllSections - Deletes all sections (topics) from the task.
   */
  deleteAllSections() {
    this.topics.forEach((topic, topicId) => {
      this.deleteSection(topicId);
    });
  }

  /**
   * @method getTopics - Gets the topics of the task. (converts the map to an array, removing the _element property, and the keys)
   * @returns {Array} - The topics.
   */
  getTopics() {
    return Array.from(this.topics.values()).map((topic) => {
      const { _element, ...rest } = topic;
      return rest;
    });
  }
}
