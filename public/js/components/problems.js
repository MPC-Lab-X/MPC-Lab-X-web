/**
 * @file public/js/components/problems.js
 * @description Problems component.
 */

class Problems {
  /**
   * @constructor - Initializes the Problems class.
   * @param {HTMLElement} element - The element to bind the component to.
   */
  constructor(element) {
    this.element = element;
  }

  /**
   * @method render - Renders the problems.
   * @param {Array<Object>} problems - The problems to render.
   */
  render(problems) {
    this.element.innerHTML = "";
    for (let i = 0; i < problems.length; i++) {
      const problem = this.renderProblem(problems[i], i);
      this.element.appendChild(problem);
    }
  }

  /**
   * @method renderProblem - Renders a problem.
   * @param {Object} problem - The problem to render.
   * @param {number} index - The index of the problem.
   * @returns {HTMLElement} - The rendered problem element.
   */
  renderProblem(problem, index) {
    const element = document.createElement("div");
    element.className = "space-y-6 border-b last:border-0 pb-8 last:pb-0";

    const problemHeader = document.createElement("div");
    problemHeader.className = "text-xl font-semibold mb-6";
    problemHeader.textContent = `Problem ${index + 1}`;
    element.appendChild(problemHeader);

    const problemParts = ["Problem", "Steps", "Solution"];
    for (const key in problem) {
      const problemPartContainer = document.createElement("div");
      problemPartContainer.className = "mb-6";

      const problemPartHeader = document.createElement("h3");
      problemPartHeader.className = "text-lg font-bold mb-4";
      problemPartHeader.textContent = problemParts.find((part) =>
        key.toLowerCase().includes(part.toLowerCase())
      );
      problemPartContainer.appendChild(problemPartHeader);

      if (key === "problem") {
        for (const part of problem[key]) {
          this.renderProblemPart(problemPartContainer, part);
        }
      } else if (key === "steps") {
        const problemPartDetails = document.createElement("details");
        problemPartDetails.className = "bg-gray-100 rounded-lg p-4";

        const problemPartSummary = document.createElement("summary");
        problemPartSummary.className = "cursor-pointer text-primary-600 mb-2";
        problemPartSummary.textContent = "View Steps";
        problemPartDetails.appendChild(problemPartSummary);

        const problemPartSteps = document.createElement("div");
        problemPartSteps.className = "space-y-4 mb-2";
        for (const part of problem[key]) {
          this.renderProblemPart(problemPartSteps, part);
          problemPartDetails.appendChild(problemPartSteps);
        }
        problemPartDetails.appendChild(problemPartSteps);

        problemPartContainer.appendChild(problemPartDetails);
      } else if (key === "solution") {
        const problemPartDetails = document.createElement("details");
        problemPartDetails.className = "bg-gray-100 rounded-lg p-4";

        const problemPartSummary = document.createElement("summary");
        problemPartSummary.className = "cursor-pointer text-primary-600 mb-2";
        problemPartSummary.textContent = "Show Solution";
        problemPartDetails.appendChild(problemPartSummary);

        const problemPartSolution = document.createElement("div");
        problemPartSolution.className = "space-y-4 mb-2";
        for (const part of problem[key]) {
          this.renderProblemSolution(problemPartSolution, part);
          problemPartDetails.appendChild(problemPartSolution);
        }
        problemPartDetails.appendChild(problemPartSolution);

        problemPartContainer.appendChild(problemPartDetails);
      }

      element.appendChild(problemPartContainer);
    }

    return element;
  }

  /**
   * @method renderProblemPart - Renders a problem part.
   * @param {HTMLElement} element - The element to render the problem part to.
   * @param {Object} part - The part to render
   */
  renderProblemPart(element, part) {
    const problemPartElement = document.createElement("div");
    problemPartElement.className = "mb-2";
    switch (part.type) {
      case "header":
        const problemPartHeader = this.renderProblemHeader(part.value);
        problemPartElement.appendChild(problemPartHeader);
        break;
      case "text":
        const problemPartText = this.renderProblemText(part.value);
        problemPartElement.appendChild(problemPartText);
        break;
      case "formula":
        const problemPartFormula = this.renderProblemFormula(part.value);
        problemPartElement.appendChild(problemPartFormula);
        break;
      case "graph":
        const problemPartGraph = this.renderProblemGraph(part.value);
        problemPartElement.appendChild(problemPartGraph);
        break;
      case "chart":
        const problemPartChart = this.renderProblemChart(part.value);
        problemPartElement.appendChild(problemPartChart);
        break;
      case "options":
        const problemPartOptions = this.renderProblemOptions(part.value);
        problemPartElement.appendChild(problemPartOptions);
        break;
      default:
        break;
    }
    element.appendChild(problemPartElement);
  }

  /**
   * @method renderProblemSolution - Renders a problem solution.
   * @param {HTMLElement} element - The element to render the problem solution to.
   * @param {Object} solution - The solution to render.
   */
  renderProblemSolution(element, solution) {
    const problemSolutionLabel = document.createElement("span");
    problemSolutionLabel.className = "text-gray-700";
    problemSolutionLabel.textContent = solution.label
      ? solution.label + ": "
      : "Solution: ";
    element.appendChild(problemSolutionLabel);

    switch (solution.type) {
      case "numeric": {
        if (solution.decimal !== undefined) {
          const problemSolutionElementDecimal = document.createElement("div");
          problemSolutionElementDecimal.className = "mb-2";
          problemSolutionElementDecimal.textContent = solution.decimal;
          const problemSolutionTypeDecimal = document.createElement("span");
          problemSolutionTypeDecimal.className =
            "ml-2 inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-full";
          problemSolutionTypeDecimal.textContent = "Numeric (Decimal)";

          problemSolutionElementDecimal.appendChild(problemSolutionTypeDecimal);
          element.appendChild(problemSolutionElementDecimal);
        }
        if (solution.fraction) {
          const problemSolutionElementFraction = document.createElement("div");
          problemSolutionElementFraction.className = "mb-2";
          katex.render(
            `${solution.fraction.s === 1 ? "-" : ""}\\frac{${
              solution.fraction.n
            }}{${solution.fraction.d}}`,
            problemSolutionElementFraction
          );

          const problemSolutionTypeFraction = document.createElement("span");
          problemSolutionTypeFraction.className =
            "ml-2 inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-full";
          problemSolutionTypeFraction.textContent = "Numeric (Fraction)";

          problemSolutionElementFraction.appendChild(
            problemSolutionTypeFraction
          );
          element.appendChild(problemSolutionElementFraction);
        }
        break;
      }
      case "choice": {
        const problemSolutionElementChoice = document.createElement("div");
        problemSolutionElementChoice.className = "mb-2";
        problemSolutionElementChoice.textContent = [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
        ][solution.choice];

        const problemSolutionTypeChoice = document.createElement("span");
        problemSolutionTypeChoice.className =
          "ml-2 inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-full";
        problemSolutionTypeChoice.textContent = "Choice";

        problemSolutionElementChoice.appendChild(problemSolutionTypeChoice);
        element.appendChild(problemSolutionElementChoice);
        break;
      }
      default: {
        const problemSolutionType = document.createElement("span");
        problemSolutionType.className =
          "ml-2 inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-full";
        switch (solution.type) {
          case "text":
            problemSolutionType.textContent = "Text";
            break;
          case "formula":
            problemSolutionType.textContent = "Formula";
            break;
          case "graph":
            problemSolutionType.textContent = "Graph";
            break;
          case "chart":
            problemSolutionType.textContent = "Chart";
            break;
          default:
            break;
        }
        element.appendChild(problemSolutionType);

        this.renderProblemPart(element, solution);

        break;
      }
    }
  }

  /**
   * @method renderProblemHeader - Renders a problem header.
   * @param {string} title - The title to render.
   * @returns {HTMLElement} - The rendered problem header element.
   */
  renderProblemHeader(title) {
    const element = document.createElement("h4");
    element.className = "text-lg font-semibold text-gray-800";
    element.textContent = title;

    return element;
  }

  /**
   * @method renderProblemText - Renders a problem text.
   * @param {string} text - The text to render.
   * @returns {HTMLElement} - The rendered problem text element.
   */
  renderProblemText(text) {
    const element = document.createElement("p");
    element.className = "text-gray-700";
    element.textContent = text;

    return element;
  }

  /**
   * @method renderProblemFormula - Renders a problem formula. (Katex)
   * @param {string} formula - The formula to render.
   * @returns {HTMLElement} - The rendered problem formula element.
   */
  renderProblemFormula(formula) {
    const element = document.createElement("div");
    element.className = "bg-gray-300 p-2 rounded";

    const formulaElement = document.createElement("span");
    formulaElement.className = "katex";
    katex.render(formula, formulaElement);
    element.appendChild(formulaElement);

    return element;
  }

  /**
   * @method renderProblemGraph - Renders a problem graph. (Desmos, etc.)
   * @param {string} graph - The graph to render.
   * @param {boolean} graph.printMode - Whether to render in print mode or not.
   * @returns {HTMLElement} - The rendered problem graph element.
   */
  renderProblemGraph(graph) {
    const element = document.createElement("div");
    element.className =
      "graph-container bg-gray-300 rounded-lg flex items-center justify-center";
    if (graph.printMode) {
      element.classList.add("h-64", "w-64");
    } else {
      element.classList.add("h-64", "w-full");
    }

    if (graph.renderEngine === "desmos") {
      const defaultOptions = {
        keypad: false,
        expressions: false,
        settingsMenu: false,
        zoomButtons: false,
        expressionsTopbar: false,
        pointsOfInterest: false,
        trace: false,
        border: false,
        lockViewport: true,
      };
      const calculator = Desmos.GraphingCalculator(element, {
        ...defaultOptions,
        ...graph.options,
      });
      calculator.setMathBounds(
        graph.mathBounds || { left: -10, right: 10, bottom: -10, top: 10 }
      );
      for (const expression of graph.expressions || []) {
        calculator.setExpression(expression);
      }
    }

    return element;
  }

  /**
   * @method renderProblemChart - Renders a problem chart. (Chart.js, etc.)
   * @param {string} chart - The chart to render.
   * @returns {HTMLElement} - The rendered problem chart element.
   */
  renderProblemChart(chart) {
    const element = document.createElement("canvas");
    element.className = "bg-gray-300 rounded-lg h-32";

    if (chart.renderEngine === "chartjs") {
      new Chart(element, chart.options);
    }

    return element;
  }

  /**
   * @method renderProblemOptions - Renders a problem options.
   * @param {Array<Object>} options - The options to render
   * @returns {HTMLElement} - The rendered problem options element.
   */
  renderProblemOptions(options) {
    const element = document.createElement("div");
    element.className = "space-y-2";

    const optionsLabel = document.createElement("span");
    optionsLabel.className = "text-gray-700";
    optionsLabel.textContent = "Select one of the following options:";
    element.appendChild(optionsLabel);

    const optionsLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (let i = 0; i < options.length; i++) {
      const option = document.createElement("div");
      option.className = "bg-gray-100 p-2 rounded";
      const optionLetter = document.createElement("span");
      optionLetter.className = "font-semibold";
      optionLetter.textContent = `${optionsLetters[i]}) `;
      option.appendChild(optionLetter);
      switch (options[i].type) {
        case "text":
          const optionText = this.renderProblemText(options[i].value);
          option.appendChild(optionText);
          break;
        case "formula":
          const optionFormula = this.renderProblemFormula(options[i].value);
          option.appendChild(optionFormula);
          break;
        case "graph":
          const optionGraph = this.renderProblemGraph(options[i].value);
          option.appendChild(optionGraph);
          break;
        case "chart":
          const optionChart = this.renderProblemChart(options[i].value);
          option.appendChild(optionChart);
          break;
        default:
          break;
      }
      element.appendChild(option);
    }

    return element;
  }
}
