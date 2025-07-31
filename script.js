// Quiz Data - will be loaded from JSON file
let quizData = [];
let allQuestions = {};
let userAnswers = []; // Store user answers for results page

// Load questions from JSON file
async function loadQuestions() {
  try {
    const response = await fetch("assets/data/questions.json");
    allQuestions = await response.json();

    // Generate randomized quiz from question pool
    generateQuiz();
  } catch (error) {
    console.error("Error loading questions:", error);
    // Fallback to embedded questions if JSON fails
    loadFallbackQuestions();
  }
}

// Generate a randomized quiz based on difficulty progression
function generateQuiz() {
  const settings = allQuestions.settings;
  quizData = [];

  // Add questions from each difficulty level
  ["easy", "medium", "hard"].forEach((difficulty) => {
    const questionsNeeded = settings.questionsPerDifficulty[difficulty];
    const availableQuestions = [...allQuestions[difficulty]]; // Copy array

    // Randomly select questions from this difficulty
    for (let i = 0; i < questionsNeeded && availableQuestions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const selectedQuestion = availableQuestions.splice(randomIndex, 1)[0];
      quizData.push(selectedQuestion);
    }
  });

  // Update question count after quiz is generated
  const questionCountElement = document.getElementById("questionCount");
  if (questionCountElement) {
    questionCountElement.textContent = quizData.length;
  }
}

// Fallback questions if JSON loading fails
function loadFallbackQuestions() {
  quizData = [
    {
      type: "multiple-choice",
      category: "Terminology",
      question: "What does 'FMJ' stand for in ammunition terminology?",
      answers: [
        "Full Metal Jacket",
        "Fast Moving Jet",
        "Final Mass Junction",
        "Flat Metal Joint",
      ],
      correct: 0,
      explanation:
        "Full Metal Jacket (FMJ) refers to a bullet design where the lead core is encased in a harder metal shell, typically copper or brass alloy.",
    },
    {
      type: "true-false",
      category: "Popular Cartridges",
      question:
        "The 9mm Parabellum is one of the most common handgun cartridges in the world.",
      correct: true,
      explanation:
        "Correct! The 9mm Parabellum (also called 9x19mm) is indeed one of the most widely used handgun cartridges globally.",
    },
    {
      type: "multiple-choice",
      category: "Cartridge Specifications",
      question: "What does the '.223' in .223 Remington refer to?",
      answers: [
        "The bullet diameter in inches",
        "The case length in millimeters",
        "The grain weight of the bullet",
        "The year it was developed",
      ],
      correct: 0,
      explanation:
        "The '.223' refers to the approximate bullet diameter in inches (0.223 inches).",
    },
    {
      type: "slider",
      category: "Ballistics",
      question: "What is the typical bullet weight for .45 ACP ammunition?",
      min: 180,
      max: 260,
      unit: "grains",
      correct: 230,
      tolerance: 15,
      step: 5,
      explanation:
        "The standard .45 ACP bullet weight is 230 grains, though lighter bullets are also common.",
    },
    {
      type: "text-input",
      category: "Technical Terms",
      question: "What does 'MOA' stand for? (Enter the full phrase)",
      correct: "Minute of Angle",
      acceptableAnswers: [
        "Minute of Angle",
        "minute of angle",
        "Minutes of Angle",
        "minutes of angle",
      ],
      explanation:
        "MOA (Minute of Angle) is a unit of angular measurement used to describe accuracy.",
    },
    {
      type: "drag-drop",
      category: "Applications",
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
      explanation:
        "Each cartridge is optimized for different purposes: 9mm for personal defense, .308 for hunting large game, and .22 LR for affordable target practice.",
    },
    {
      type: "multiple-choice",
      category: "Military History",
      question:
        "The .50 BMG cartridge was originally designed for use in what?",
      answers: [
        "Sniper rifles",
        "Machine guns",
        "Artillery pieces",
        "Tank cannons",
      ],
      correct: 1,
      explanation:
        "The .50 BMG was originally designed for the Browning M2 machine gun during World War I.",
    },
    {
      type: "true-false",
      category: "Military History",
      question:
        "The .30-06 cartridge was adopted by the U.S. military in 1906.",
      correct: true,
      explanation:
        "Correct! The '.30-06' designation literally means '.30 caliber, adopted in 1906.'",
    },
  ];

  // Update question count
  const questionCountElement = document.getElementById("questionCount");
  if (questionCountElement) {
    questionCountElement.textContent = quizData.length;
  }
}

// Tier definitions
const tiers = [
  {
    name: "Recruit",
    range: [0, 2],
    icon: "🎯",
    description:
      "You're new to ammunition knowledge. Every expert started here - keep learning and you'll advance quickly!",
  },
  {
    name: "Marksman",
    range: [3, 4],
    icon: "🏅",
    description:
      "You're building solid ammunition expertise. You understand the basics and are ready for more advanced concepts.",
  },
  {
    name: "Expert",
    range: [5, 6],
    icon: "⭐",
    description:
      "You have strong ammunition knowledge! You understand most concepts and could confidently discuss ballistics.",
  },
  {
    name: "Master Gunsmith",
    range: [7, 7],
    icon: "🎖️",
    description:
      "Exceptional expertise! You have deep ammunition knowledge that rivals many professionals in the field.",
  },
  {
    name: "Arsenal Commander",
    range: [8, 8],
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
let streak = 0;
let maxStreak = 0;

// DOM Elements
const sections = {
  landing: document.getElementById("landing"),
  quiz: document.getElementById("quiz"),
  emailCapture: document.getElementById("emailCapture"),
  results: document.getElementById("results"),
};

// Initialize Quiz
async function startQuiz() {
  trackQuizEvent("quiz_started");
  await loadQuestions();
  userAnswers = []; // Reset user answers
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

  // Update progress with category
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  document
    .getElementById("progressBar")
    .style.setProperty("--progress", `${progress}%`);
  document.getElementById("progressText").textContent = `Question ${
    currentQuestion + 1
  } of ${quizData.length} • ${question.category || "General"}`;

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
  resetQuestionState();
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
  slider.step = question.step || 10;
  slider.value = Math.round((question.min + question.max) / 2);

  const valueDisplay = document.createElement("div");
  valueDisplay.className = "slider-value";
  valueDisplay.textContent = `${slider.value} ${question.unit}`;

  slider.oninput = (e) => {
    const value = parseInt(e.target.value);
    valueDisplay.textContent = `${value} ${question.unit}`;
    handleSliderInput(value);
  };

  // Add smart preset buttons
  const presetsContainer = document.createElement("div");
  presetsContainer.className = "slider-presets";

  const presetValues = generateSmartPresets(
    question.min,
    question.max,
    question.unit
  );

  presetValues.forEach((presetValue) => {
    const presetBtn = document.createElement("button");
    presetBtn.type = "button";
    presetBtn.className = "slider-preset-btn";
    presetBtn.textContent = `${presetValue}`;
    presetBtn.onclick = () => {
      slider.value = presetValue;
      valueDisplay.textContent = `${presetValue} ${question.unit}`;
      handleSliderInput(presetValue);
    };
    presetsContainer.appendChild(presetBtn);
  });

  sliderContainer.appendChild(sliderLabel);
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(valueDisplay);
  sliderContainer.appendChild(presetsContainer);
  container.appendChild(sliderContainer);

  handleSliderInput(parseInt(slider.value));
}

function generateSmartPresets(min, max, unit) {
  const range = max - min;
  let interval;

  if (unit === "fps") {
    interval = 200;
  } else if (unit === "grains") {
    interval = 20;
  } else if (range > 1000) {
    interval = 200;
  } else if (range > 100) {
    interval = 25;
  } else {
    interval = 10;
  }

  const presets = [];
  presets.push(min);

  for (let val = min + interval; val < max; val += interval) {
    const roundedVal = Math.round(val / interval) * interval;
    if (roundedVal > min && roundedVal < max && !presets.includes(roundedVal)) {
      presets.push(roundedVal);
    }
  }

  if (!presets.includes(max)) {
    presets.push(max);
  }

  return presets.sort((a, b) => a - b);
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

function selectAnswer(answer) {
  selectedAnswer = answer;

  const answerOptions = document.querySelectorAll(".answer-option");
  answerOptions.forEach((option, i) => {
    option.classList.remove("selected");

    if (typeof answer === "boolean") {
      const optionText = option.textContent.toLowerCase();
      if (
        (answer === true && optionText === "true") ||
        (answer === false && optionText === "false")
      ) {
        option.classList.add("selected");
      }
    } else if (i === answer) {
      option.classList.add("selected");
    }
  });

  document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
  const question = quizData[currentQuestion];
  let isCorrect = false;
  let userAnswer = null;

  // Check answer based on question type and store user's answer
  switch (question.type) {
    case "multiple-choice":
    case "image-multiple-choice":
      isCorrect = selectedAnswer === question.correct;
      userAnswer = question.answers[selectedAnswer];
      break;
    case "true-false":
      isCorrect = selectedAnswer === question.correct;
      userAnswer = selectedAnswer;
      break;
    case "text-input":
      isCorrect = question.acceptableAnswers.some(
        (acceptable) =>
          acceptable.toLowerCase() === userTextAnswer.toLowerCase()
      );
      userAnswer = userTextAnswer;
      break;
    case "slider":
      isCorrect =
        Math.abs(sliderValue - question.correct) <= question.tolerance;
      userAnswer = `${sliderValue} ${question.unit}`;
      break;
    case "drag-drop":
      isCorrect = Object.keys(question.correctMatches).every(
        (itemId) => dragDropAnswers[itemId] === question.correctMatches[itemId]
      );
      userAnswer = dragDropAnswers;
      break;
  }

  // Store the answer for results page
  userAnswers.push({
    question: question,
    userAnswer: userAnswer,
    isCorrect: isCorrect,
    questionIndex: currentQuestion,
  });

  // Update score and streak
  if (isCorrect) {
    score++;
    streak++;
    if (streak > maxStreak) maxStreak = streak;
  } else {
    streak = 0;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showSection("emailCapture");
  }
}

function submitEmail() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput.value.trim();

  if (!email || !isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  userEmail = email;

  trackQuizEvent("quiz_completed", {
    score: score,
    totalQuestions: quizData.length,
    accuracy: Math.round((score / quizData.length) * 100),
    tier: getTier(score).name,
  });

  showResults();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showResults() {
  showSection("results");

  // Display score
  document.getElementById("finalScore").textContent = score;
  document.getElementById("scoreTotal").textContent = quizData.length;
  document.getElementById("correctCount").textContent = score;

  // Calculate accuracy
  const accuracy = Math.round((score / quizData.length) * 100);
  document.getElementById("accuracyRate").textContent = `${accuracy}%`;

  // Show max streak
  document.getElementById("maxStreak").textContent = maxStreak;

  // Determine tier
  const tier = getTier(score);
  document.getElementById("tierIcon").textContent = tier.icon;
  document.getElementById("tierTitle").textContent = tier.name;
  document.getElementById("tierDescription").textContent = tier.description;

  // Add achievement badges
  const achievementsDiv = document.getElementById("achievements");
  achievementsDiv.innerHTML = "";

  const achievements = getAchievements();
  achievements.forEach((achievement) => {
    const badgeDiv = document.createElement("div");
    badgeDiv.className = "achievement-badge";
    badgeDiv.innerHTML = `<span class="achievement-icon">${achievement.icon}</span><span class="achievement-text">${achievement.text}</span>`;
    achievementsDiv.appendChild(badgeDiv);
  });

  // Show detailed explanations for all questions
  showDetailedExplanations();

  // Update tier badge color based on performance
  const tierBadge = document.getElementById("tierBadge");
  if (score >= 7) {
    tierBadge.style.borderColor = "#bf9400";
  } else if (score >= 5) {
    tierBadge.style.borderColor = "#99161d";
  } else {
    tierBadge.style.borderColor = "#464648";
  }

  // Simulate email delivery
  simulateEmailDelivery();
}

function showDetailedExplanations() {
  const explanationsContainer = document.getElementById("detailedExplanations");
  explanationsContainer.innerHTML = "<h4>Question Breakdown</h4>";

  userAnswers.forEach((answer, index) => {
    const explanationDiv = document.createElement("div");
    explanationDiv.className = `question-explanation ${
      answer.isCorrect ? "correct" : "incorrect"
    }`;

    const questionHeader = document.createElement("div");
    questionHeader.className = "explanation-header";
    questionHeader.innerHTML = `
            <span class="question-number">Question ${index + 1}</span>
            <span class="result-icon ${
              answer.isCorrect ? "correct" : "incorrect"
            }">${answer.isCorrect ? "✓" : "✗"}</span>
        `;

    const questionText = document.createElement("div");
    questionText.className = "explanation-question";
    questionText.textContent = answer.question.question;

    const answerInfo = document.createElement("div");
    answerInfo.className = "explanation-answer";

    let userAnswerText = "";
    if (answer.question.type === "drag-drop") {
      userAnswerText =
        "Your matches: " +
        Object.entries(answer.userAnswer)
          .map(([item, target]) => `${item}→${target}`)
          .join(", ");
    } else {
      userAnswerText = `Your answer: ${answer.userAnswer}`;
    }

    answerInfo.innerHTML = `
            <div class="user-answer">${userAnswerText}</div>
            <div class="correct-indicator">${
              answer.isCorrect ? "Correct!" : "Incorrect"
            }</div>
        `;

    const explanationText = document.createElement("div");
    explanationText.className = "explanation-detail";
    explanationText.textContent =
      answer.question.explanation || "No explanation available.";

    explanationDiv.appendChild(questionHeader);
    explanationDiv.appendChild(questionText);
    explanationDiv.appendChild(answerInfo);
    explanationDiv.appendChild(explanationText);

    explanationsContainer.appendChild(explanationDiv);
  });
}

function getTier(score) {
  for (const tier of tiers) {
    if (score >= tier.range[0] && score <= tier.range[1]) {
      return tier;
    }
  }
  return tiers[0];
}

function getAchievements() {
  const achievements = [];

  if (score === quizData.length) {
    achievements.push({ icon: "🎯", text: "Perfect Score!" });
  }
  if (maxStreak >= 5) {
    achievements.push({ icon: "🔥", text: "Hot Streak!" });
  }
  if (score >= 7) {
    achievements.push({ icon: "🏆", text: "Expert Level" });
  }
  if (score >= 6) {
    achievements.push({ icon: "⭐", text: "Above Average" });
  }
  if (maxStreak >= 3) {
    achievements.push({ icon: "💪", text: "Consistent" });
  }

  return achievements;
}

function shareTwitter() {
  const tier = getTier(score);
  const text = `I just scored ${score}/${quizData.length} on the Ultimate Ammunition Knowledge Quiz and earned the rank of ${tier.name}! Test your expertise:`;
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

function visitStore() {
  window.open("https://example.com", "_blank");
}

function retakeQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  streak = 0;
  maxStreak = 0;
  userAnswers = [];

  document.getElementById("emailInput").value = "";
  generateQuiz();
  showSection("landing");
}

function resetQuestionState() {
  selectedAnswer = null;
  userTextAnswer = "";
  sliderValue = null;
  dragDropAnswers = {};
  document.getElementById("nextBtn").disabled = true;
}

function simulateEmailDelivery() {
  if (!userEmail) return;

  const tier = getTier(score);
  const emailOptIn = document.getElementById("emailOptIn")
    ? document.getElementById("emailOptIn").checked
    : true;
  const emailContent = {
    to: userEmail,
    subject: `Your Ammunition Knowledge Quiz Results - ${tier.name} Level!`,
    score: score,
    totalQuestions: quizData.length,
    tier: tier,
    accuracy: Math.round((score / quizData.length) * 100),
    optIn: emailOptIn,
  };

  console.log("Email content to be sent:", emailContent);
}

function trackQuizEvent(eventName, data = {}) {
  console.log("Analytics Event:", eventName, data);
}

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  if (sections.quiz && sections.quiz.classList.contains("active")) {
    if (e.key >= "1" && e.key <= "4") {
      const answerIndex = parseInt(e.key) - 1;
      const answerOptions = document.querySelectorAll(".answer-option");
      if (answerOptions[answerIndex]) {
        selectAnswer(answerIndex);
      }
    }

    if (e.key === "Enter" && !document.getElementById("nextBtn").disabled) {
      nextQuestion();
    }
  }

  if (
    sections.emailCapture &&
    sections.emailCapture.classList.contains("active") &&
    e.key === "Enter"
  ) {
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
        const emailInput = document.getElementById("emailInput");
        if (emailInput) emailInput.focus();
      }, 100);
    }
  });
});

// Observe sections for class changes
document.addEventListener("DOMContentLoaded", () => {
  Object.values(sections).forEach((section) => {
    if (section) {
      observer.observe(section, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
  });
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  showSection("landing");
  await loadQuestions();
  trackQuizEvent("quiz_page_loaded");
  resetQuestionState();
});
