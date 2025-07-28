// Quiz Data
const quizData = [
  {
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
    question: "Which of these is considered a 'magnum' cartridge?",
    answers: ["9mm Parabellum", ".45 ACP", ".357 Magnum", ".38 Special"],
    correct: 2,
  },
  {
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
    question:
      "The '.30-06' cartridge was adopted by the U.S. military in what year?",
    answers: ["1903", "1906", "1911", "1918"],
    correct: 1,
  },
  {
    question:
      "What is the primary difference between .308 Winchester and 7.62x51mm NATO?",
    answers: [
      "Bullet diameter",
      "Case length",
      "Chamber pressure specifications",
      "They are identical",
    ],
    correct: 2,
  },
  {
    question: "Which component of a cartridge contains the explosive compound?",
    answers: ["Bullet", "Case", "Primer", "Powder"],
    correct: 2,
  },
  {
    question: "What does '+P' designation mean on ammunition?",
    answers: [
      "Extra powder charge",
      "Higher pressure than standard",
      "Plus power rating",
      "Improved accuracy",
    ],
    correct: 1,
  },
  {
    question: "The AK-47 typically fires which cartridge?",
    answers: ["7.62x39mm", "7.62x51mm", "5.45x39mm", "5.56x45mm"],
    correct: 0,
  },
  {
    question:
      "What is the approximate muzzle velocity of a standard .45 ACP round?",
    answers: ["1,200 fps", "850 fps", "1,500 fps", "650 fps"],
    correct: 1,
  },
  {
    question:
      "Which of these is NOT a common bullet weight for 9mm ammunition?",
    answers: ["115 grain", "124 grain", "147 grain", "180 grain"],
    correct: 3,
  },
  {
    question: "What does 'MOA' stand for in shooting terminology?",
    answers: [
      "Method of Accuracy",
      "Minute of Angle",
      "Maximum Operating Accuracy",
      "Measured Optical Alignment",
    ],
    correct: 1,
  },
  {
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

  // Load answers
  const answersContainer = document.getElementById("answersContainer");
  answersContainer.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const answerElement = document.createElement("div");
    answerElement.className = "answer-option";
    answerElement.textContent = answer;
    answerElement.onclick = () => selectAnswer(index);
    answersContainer.appendChild(answerElement);
  });

  // Reset state
  selectedAnswer = null;
  document.getElementById("nextBtn").disabled = true;
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
  if (selectedAnswer === null) return;

  // Check if answer is correct
  if (selectedAnswer === quizData[currentQuestion].correct) {
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
  window.open("https://ammo.com", "_blank");
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Ensure landing section is shown by default
  showSection("landing");

  // Track page load
  trackQuizEvent("quiz_page_loaded");
});
