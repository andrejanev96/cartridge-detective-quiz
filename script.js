// Quiz Data with Multiple Question Types
const quizData = [
  {
    type: "multiple-choice",
    question: "What does the '.223' in .223 Remington refer to?",
    answers: [
      "The bullet diameter in inches",
      "The case length in millimeters",
      "The grain weight of the bullet",
      "The year it was developed",
    ],
    correct: 0,
  },
  {
    type: "image-multiple-choice",
    question: "Identify this cartridge based on the image:",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/56/.308_Winchester_FMJSP.jpg",
    answers: [
      ".308 Winchester",
      ".30-06 Springfield",
      "7.62x39mm",
      ".300 Winchester Magnum",
    ],
    correct: 0,
  },
  {
    type: "true-false",
    question:
      "The .45 ACP cartridge has more stopping power than the 9mm Parabellum.",
    correct: true,
  },
  {
    type: "text-input",
    question:
      "What caliber is commonly used in the AR-15 platform? (Enter the decimal caliber, e.g., .223)",
    correct: ".223",
    acceptableAnswers: [".223", "223", ".223 Remington", "5.56"],
  },
  {
    type: "slider",
    question:
      "What is the approximate muzzle velocity of a .308 Winchester round?",
    min: 1500,
    max: 3500,
    unit: "fps",
    correct: 2700,
    tolerance: 200,
  },
  {
    type: "drag-drop",
    question: "Match each cartridge to its typical use:",
    items: [
      { id: "9mm", text: "9mm Parabellum" },
      { id: "308", text: ".308 Winchester" },
      { id: "22lr", text: ".22 Long Rifle" },
    ],
    targets: [
      { id: "handgun", text: "Handgun Defense" },
      { id: "hunting", text: "Big Game Hunting" },
      { id: "plinking", text: "Target Practice/Plinking" },
    ],
    correctMatches: {
      "9mm": "handgun",
      308: "hunting",
      "22lr": "plinking",
    },
  },
  {
    type: "multiple-choice",
    question: "Which of these is considered a 'magnum' cartridge?",
    answers: ["9mm Parabellum", ".45 ACP", ".357 Magnum", ".38 Special"],
    correct: 2,
  },
  {
    type: "multiple-choice",
    question: "What does 'FMJ' stand for in ammunition terminology?",
    answers: [
      "Full Metal Jacket",
      "Fast Moving Jet",
      "Final Mass Junction",
      "Flat Metal Joint",
    ],
    correct: 0,
  },
  {
    type: "text-input",
    question: "What does 'MOA' stand for? (Enter the full phrase)",
    correct: "Minute of Angle",
    acceptableAnswers: [
      "Minute of Angle",
      "minute of angle",
      "Minutes of Angle",
      "minutes of angle",
    ],
  },
  {
    type: "slider",
    question: "What is the typical bullet weight for .45 ACP ammunition?",
    min: 180,
    max: 260,
    unit: "grains",
    correct: 230,
    tolerance: 15,
  },
  {
    type: "true-false",
    question: "The .30-06 cartridge was adopted by the U.S. military in 1906.",
    correct: true,
  },
  {
    type: "multiple-choice",
    question: "The .50 BMG cartridge was originally designed for use in what?",
    answers: [
      "Sniper rifles",
      "Machine guns",
      "Artillery pieces",
      "Tank cannons",
    ],
    correct: 1,
  },
];

// Tier definitions
const tiers = [
  {
    name: "Recruit",
    range: [0, 3],
    icon: "🎯",
    description:
      "You're new to ammunition knowledge. Every expert started here - keep learning and you'll advance quickly!",
  },
  {
    name: "Marksman",
    range: [4, 6],
    icon: "🏅",
    description:
      "You're building solid ammunition expertise. You understand the basics and are ready for more advanced concepts.",
  },
  {
    name: "Expert",
    range: [7, 9],
    icon: "⭐",
    description:
      "You have strong ammunition knowledge! You understand most concepts and could confidently discuss ballistics.",
  },
  {
    name: "Master Gunsmith",
    range: [10, 11],
    icon: "🎖️",
    description:
      "Exceptional expertise! You have deep ammunition knowledge that rivals many professionals in the field.",
  },
  {
    name: "Arsenal Commander",
    range: [12, 12],
    icon: "👑",
    description:
      "Elite ammunition authority! Your knowledge is comprehensive and you're among the top tier of enthusiasts.",
  },
];

// Quiz State
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let userEmail = "";
let dragDropAnswers = {};
let userTextAnswer = "";
let sliderValue = null;

// DOM Elements
const sections = {
  landing: document.getElementById("landing"),
  quiz: document.getElementById("quiz"),
  emailCapture: document.getElementById("emailCapture"),
  results: document.getElementById("results"),
};

// Initialize Quiz
function startQuiz() {
  showSection("quiz");
  loadQuestion();
}

// Section Management
function showSection(sectionName) {
  Object.values(sections).forEach((section) => {
    section.classList.remove("active");
  });
  sections[sectionName].classList.add("active");
}

// Load Current Question
function loadQuestion() {
  const question = quizData[currentQuestion];

  // Update progress
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  document
    .getElementById("progressBar")
    .style.setProperty("--progress", `${progress}%`);
  document.getElementById("progressText").textContent = `Question ${
    currentQuestion + 1
  } of ${quizData.length}`;

  // Load question
  document.getElementById("questionTitle").textContent = question.question;

  // Handle question image
  const questionImageDiv = document.getElementById("questionImage");
  const questionImg = document.getElementById("questionImg");
  if (question.image) {
    questionImg.src = question.image;
    questionImageDiv.style.display = "block";
  } else {
    questionImageDiv.style.display = "none";
  }

  // Load answers based on question type
  const answersContainer = document.getElementById("answersContainer");
  answersContainer.innerHTML = "";

  switch (question.type) {
    case "multiple-choice":
    case "image-multiple-choice":
      loadMultipleChoice(question, answersContainer);
      break;
    case "true-false":
      loadTrueFalse(question, answersContainer);
      break;
    case "text-input":
      loadTextInput(question, answersContainer);
      break;
    case "slider":
      loadSlider(question, answersContainer);
      break;
    case "drag-drop":
      loadDragDrop(question, answersContainer);
      break;
  }

  // Reset state
  selectedAnswer = null;
  userTextAnswer = "";
  sliderValue = null;
  dragDropAnswers = {};
  document.getElementById("nextBtn").disabled = true;
}

function loadMultipleChoice(question, container) {
  question.answers.forEach((answer, index) => {
    const answerElement = document.createElement("div");
    answerElement.className = "answer-option";
    answerElement.textContent = answer;
    answerElement.onclick = () => selectAnswer(index);
    container.appendChild(answerElement);
  });
}

function loadTrueFalse(question, container) {
  const trueOption = document.createElement("div");
  trueOption.className = "answer-option";
  trueOption.textContent = "True";
  trueOption.onclick = () => selectAnswer(true);

  const falseOption = document.createElement("div");
  falseOption.className = "answer-option";
  falseOption.textContent = "False";
  falseOption.onclick = () => selectAnswer(false);

  container.appendChild(trueOption);
  container.appendChild(falseOption);
}

function loadTextInput(question, container) {
  const inputContainer = document.createElement("div");
  inputContainer.className = "text-input-container";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "text-input";
  input.placeholder = "Enter your answer...";
  input.oninput = (e) => handleTextInput(e.target.value);

  inputContainer.appendChild(input);
  container.appendChild(inputContainer);

  setTimeout(() => input.focus(), 100);
}

function loadSlider(question, container) {
  const sliderContainer = document.createElement("div");
  sliderContainer.className = "slider-container";

  const sliderLabel = document.createElement("div");
  sliderLabel.className = "slider-label";
  sliderLabel.textContent = `Range: ${question.min} - ${question.max} ${question.unit}`;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.className = "slider";
  slider.min = question.min;
  slider.max = question.max;
  slider.value = Math.round((question.min + question.max) / 2);

  const valueDisplay = document.createElement("div");
  valueDisplay.className = "slider-value";
  valueDisplay.textContent = `${slider.value} ${question.unit}`;

  slider.oninput = (e) => {
    const value = parseInt(e.target.value);
    valueDisplay.textContent = `${value} ${question.unit}`;
    handleSliderInput(value);
  };

  sliderContainer.appendChild(sliderLabel);
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(valueDisplay);
  container.appendChild(sliderContainer);

  // Set initial value
  handleSliderInput(parseInt(slider.value));
}

function loadDragDrop(question, container) {
  const dragDropContainer = document.createElement("div");
  dragDropContainer.className = "drag-drop-container";

  const itemsContainer = document.createElement("div");
  itemsContainer.className = "drag-items-container";
  itemsContainer.innerHTML = "<h4>Drag these items:</h4>";

  const targetsContainer = document.createElement("div");
  targetsContainer.className = "drag-targets-container";
  targetsContainer.innerHTML = "<h4>To these categories:</h4>";

  // Create draggable items
  question.items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "drag-item";
    itemElement.textContent = item.text;
    itemElement.draggable = true;
    itemElement.dataset.id = item.id;

    itemElement.ondragstart = (e) => {
      e.dataTransfer.setData("text/plain", item.id);
    };

    itemsContainer.appendChild(itemElement);
  });

  // Create drop targets
  question.targets.forEach((target) => {
    const targetElement = document.createElement("div");
    targetElement.className = "drop-target";
    targetElement.textContent = target.text;
    targetElement.dataset.id = target.id;

    targetElement.ondragover = (e) => e.preventDefault();
    targetElement.ondrop = (e) => {
      e.preventDefault();
      const itemId = e.dataTransfer.getData("text/plain");
      const targetId = target.id;

      // Check if this target already has an item
      const existingItem = targetElement.querySelector(".dropped-item");
      if (existingItem) {
        // Return the existing item to available state
        const existingItemId = existingItem.dataset.id;
        const originalItem = document.querySelector(
          `.drag-item[data-id="${existingItemId}"]`
        );
        if (originalItem) {
          originalItem.style.display = "block";
          originalItem.style.opacity = "1";
        }
        existingItem.remove();
        delete dragDropAnswers[existingItemId];
      }

      // Remove item from previous target if exists
      document.querySelectorAll(".drop-target").forEach((t) => {
        const existing = t.querySelector(`[data-id="${itemId}"]`);
        if (existing) {
          existing.remove();
          // Restore the original item
          const originalItem = document.querySelector(
            `.drag-item[data-id="${itemId}"]`
          );
          if (originalItem) {
            originalItem.style.display = "block";
            originalItem.style.opacity = "1";
          }
        }
      });

      // Add item to new target
      const draggedItem = document.querySelector(
        `.drag-item[data-id="${itemId}"]`
      );
      if (draggedItem) {
        const clonedItem = draggedItem.cloneNode(true);
        clonedItem.className = "dropped-item";
        clonedItem.draggable = false;
        targetElement.appendChild(clonedItem);

        // Hide the original item to show it's been used
        draggedItem.style.display = "none";

        dragDropAnswers[itemId] = targetId;
        checkDragDropComplete(question);
      }
    };

    targetsContainer.appendChild(targetElement);
  });

  dragDropContainer.appendChild(itemsContainer);
  dragDropContainer.appendChild(targetsContainer);
  container.appendChild(dragDropContainer);
}

function handleTextInput(value) {
  userTextAnswer = value.trim();
  document.getElementById("nextBtn").disabled = userTextAnswer === "";
}

function handleSliderInput(value) {
  sliderValue = value;
  document.getElementById("nextBtn").disabled = false;
}

function checkDragDropComplete(question) {
  const isComplete =
    question.items.length === Object.keys(dragDropAnswers).length;
  document.getElementById("nextBtn").disabled = !isComplete;
}

// Handle Answer Selection
function selectAnswer(index) {
  selectedAnswer = index;

  // Update UI
  const answerOptions = document.querySelectorAll(".answer-option");
  answerOptions.forEach((option, i) => {
    option.classList.remove("selected");
    if (i === index) {
      option.classList.add("selected");
    }
  });

  // Enable next button
  document.getElementById("nextBtn").disabled = false;
}

// Move to Next Question
function nextQuestion() {
  const question = quizData[currentQuestion];
  let isCorrect = false;

  // Check answer based on question type
  switch (question.type) {
    case "multiple-choice":
    case "image-multiple-choice":
      isCorrect = selectedAnswer === question.correct;
      break;
    case "true-false":
      isCorrect = selectedAnswer === question.correct;
      break;
    case "text-input":
      isCorrect = question.acceptableAnswers.some(
        (acceptable) =>
          acceptable.toLowerCase() === userTextAnswer.toLowerCase()
      );
      break;
    case "slider":
      isCorrect =
        Math.abs(sliderValue - question.correct) <= question.tolerance;
      break;
    case "drag-drop":
      isCorrect = Object.keys(question.correctMatches).every(
        (itemId) => dragDropAnswers[itemId] === question.correctMatches[itemId]
      );
      break;
  }

  if (isCorrect) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    // Quiz complete
    showSection("emailCapture");
  }
}

// Handle Email Submission
function submitEmail() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput.value.trim();

  if (!email || !isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  userEmail = email;

  // In a real implementation, you would send this data to your server
  console.log("Email submitted:", email);
  console.log("Score:", score);

  showResults();
}

// Email Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show Results
function showResults() {
  showSection("results");

  // Display score
  document.getElementById("finalScore").textContent = score;
  document.getElementById("correctCount").textContent = score;

  // Calculate accuracy
  const accuracy = Math.round((score / quizData.length) * 100);
  document.getElementById("accuracyRate").textContent = `${accuracy}%`;

  // Determine tier
  const tier = getTier(score);
  document.getElementById("tierIcon").textContent = tier.icon;
  document.getElementById("tierTitle").textContent = tier.name;
  document.getElementById("tierDescription").textContent = tier.description;

  // Update tier badge color based on performance
  const tierBadge = document.getElementById("tierBadge");
  if (score >= 10) {
    tierBadge.style.borderColor = "#bf9400"; // Gold for top performers
  } else if (score >= 7) {
    tierBadge.style.borderColor = "#99161d"; // Red for good performance
  } else {
    tierBadge.style.borderColor = "#464648"; // Gray for beginners
  }
}

// Get Tier Based on Score
function getTier(score) {
  for (const tier of tiers) {
    if (score >= tier.range[0] && score <= tier.range[1]) {
      return tier;
    }
  }
  return tiers[0]; // Default to first tier
}

// Social Sharing Functions
function shareTwitter() {
  const tier = getTier(score);
  const text = `I just scored ${score}/12 on the Ultimate Ammunition Knowledge Quiz and earned the rank of ${tier.name}! Test your expertise:`;
  const url = encodeURIComponent(window.location.href);
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${url}`,
    "_blank"
  );
}

function shareFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
}

// Navigation Functions
function visitStore() {
  // In a real implementation, this would redirect to your store
  window.open("https://example.com", "_blank");
}

function retakeQuiz() {
  // Reset quiz state
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;

  // Reset email input
  document.getElementById("emailInput").value = "";

  // Go back to landing
  showSection("landing");
}

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  if (sections.quiz.classList.contains("active")) {
    // Number keys for answer selection
    if (e.key >= "1" && e.key <= "4") {
      const answerIndex = parseInt(e.key) - 1;
      const answerOptions = document.querySelectorAll(".answer-option");
      if (answerOptions[answerIndex]) {
        selectAnswer(answerIndex);
      }
    }

    // Enter key for next question
    if (e.key === "Enter" && !document.getElementById("nextBtn").disabled) {
      nextQuestion();
    }
  }

  // Enter key on email capture
  if (sections.emailCapture.classList.contains("active") && e.key === "Enter") {
    submitEmail();
  }
});

// Auto-focus email input when section becomes active
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (
      mutation.target.classList.contains("active") &&
      mutation.target.id === "emailCapture"
    ) {
      setTimeout(() => {
        document.getElementById("emailInput").focus();
      }, 100);
    }
  });
});

// Observe all sections for class changes
Object.values(sections).forEach((section) => {
  observer.observe(section, { attributes: true, attributeFilter: ["class"] });
});

// Simulate email delivery (for demo purposes)
function simulateEmailDelivery() {
  if (!userEmail) return;

  const tier = getTier(score);
  const emailContent = {
    to: userEmail,
    subject: `Your Ammunition Knowledge Quiz Results - ${tier.name} Level!`,
    score: score,
    totalQuestions: quizData.length,
    tier: tier,
    accuracy: Math.round((score / quizData.length) * 100),
  };

  // In a real implementation, send this to your email service
  console.log("Email content to be sent:", emailContent);
}

// Call email simulation after showing results
function showResultsWithEmail() {
  showResults();
  simulateEmailDelivery();
}

// Update the submitEmail function to use the new function
function submitEmail() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput.value.trim();

  if (!email || !isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  userEmail = email;

  // In a real implementation, you would send this data to your server
  console.log("Email submitted:", email);
  console.log("Score:", score);

  showResultsWithEmail();
}

// Analytics tracking (placeholder for real implementation)
function trackQuizEvent(eventName, data = {}) {
  // In a real implementation, integrate with Google Analytics, Mixpanel, etc.
  console.log("Analytics Event:", eventName, data);
}

// Track quiz start
function startQuiz() {
  trackQuizEvent("quiz_started");
  showSection("quiz");
  loadQuestion();
}

// Track quiz completion
function submitEmail() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput.value.trim();

  if (!email || !isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  userEmail = email;

  // Track completion
  trackQuizEvent("quiz_completed", {
    score: score,
    totalQuestions: quizData.length,
    accuracy: Math.round((score / quizData.length) * 100),
    tier: getTier(score).name,
  });

  console.log("Email submitted:", email);
  console.log("Score:", score);

  showResultsWithEmail();
}

// Reset state for new questions
function resetQuestionState() {
  selectedAnswer = null;
  userTextAnswer = "";
  sliderValue = null;
  dragDropAnswers = {};
  document.getElementById("nextBtn").disabled = true;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Ensure landing section is shown by default
  showSection("landing");

  // Track page load
  trackQuizEvent("quiz_page_loaded");

  // Reset state
  resetQuestionState();
});
