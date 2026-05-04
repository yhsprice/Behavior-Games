// ===== FINAL CLEAN VERSION (Beginner + Advanced Working) =====

const APP_VERSION = "FINAL-CLEAN-V1";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// ===== START GAME =====
function startGame(category) {
  if (!allQuestions || !allQuestions[category] && category !== "mixed") {
    alert("Questions not loading correctly.");
    return;
  }

  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;

  let pool = [];

  if (category === "mixed") {
    pool = Object.values(allQuestions).flat();
  } else {
    pool = [...allQuestions[category]];
  }

  currentQuestions = shuffle(pool).slice(0, 10);

  document.getElementById("game-title").textContent = formatCategoryName(category);
  document.getElementById("score-text").textContent = "Score: 0";

  showScreen("game");
  loadQuestion();
}

// ===== LOAD QUESTION =====
function loadQuestion() {
  const q = currentQuestions[currentQuestionIndex];
  if (!q) return;

  answered = false;

  document.getElementById("question-text").textContent = q.question;

  const answerBox = document.getElementById("answer-buttons");
  answerBox.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(i, btn);
    answerBox.appendChild(btn);
  });

  document.getElementById("feedback-box").textContent = "";
  document.getElementById("next-btn").classList.add("hidden");
}

// ===== SELECT ANSWER =====
function selectAnswer(index, btn) {
  if (answered) return;
  answered = true;

  const q = currentQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#answer-buttons button");

  buttons.forEach(b => b.disabled = true);

  if (index === q.correct) {
    score += 10;
    btn.classList.add("correct");

    document.getElementById("feedback-box").textContent =
      "✅ " + q.explanation;
  } else {
    btn.classList.add("wrong");

    document.getElementById("feedback-box").textContent =
      "❌ " + q.explanation;
  }

  document.getElementById("score-text").textContent = "Score: " + score;
  document.getElementById("next-btn").classList.remove("hidden");
}

// ===== NEXT QUESTION =====
function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
  } else {
    loadQuestion();
  }
}

// ===== FINISH =====
function finishGame() {
  showScreen("results");

  document.getElementById("results-score").textContent =
    "Score: " + score + "/" + (currentQuestions.length * 10);
}

// ===== SCREEN CONTROL =====
function showScreen(name) {
  const screens = [
    "home-screen",
    "game-screen",
    "results-screen",
    "tracker-screen",
    "conversation-screen"
  ];

  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(name + "-screen");
  if (target) target.classList.remove("hidden");
}

function goHome() {
  showScreen("home");
}
// ===== UTIL =====
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function formatCategoryName(cat) {
  const map = {
    beginner: "Beginner",
    advanced: "Advanced",
    mixed: "Mixed Practice"
  };
  return map[cat] || cat;
}

// ===== BUTTON EXPORTS =====
window.startGame = startGame;
window.nextQuestion = nextQuestion;
window.showScreen = showScreen;
window.goHome = goHome;
// ===== SIMPLE CONVERSATION PRACTICE FIX =====

function startConversationPractice() {
  showScreen("conversation");

  document.getElementById("scenarioTitle").textContent = "Conversation Practice";
  document.getElementById("speakerBox").textContent = "Choose a topic";
  document.getElementById("conversationText").textContent = "Practice choosing respectful responses.";
  document.getElementById("feedbackBox").textContent = "";
  document.getElementById("respectMeter").textContent = "50";

  const choicesBox = document.getElementById("choicesBox");
  choicesBox.innerHTML = "";

  const topics = [
    {
      title: "That’s not fair!",
      prompt: "Parent says no to something. What is the best response?",
      choices: [
        {
          text: "I don’t like it, but can you explain why?",
          feedback: "Good. You can disagree without being disrespectful."
        },
        {
          text: "You never let me do anything!",
          feedback: "This turns the conversation into an argument."
        },
        {
          text: "Whatever. I don’t care.",
          feedback: "This shuts down the conversation instead of solving anything."
        }
      ]
    },
    {
      title: "Go clean your room",
      prompt: "Parent asks you to clean your room. What is the best response?",
      choices: [
        {
          text: "Okay, I’ll do it now.",
          feedback: "Good. This shows responsibility."
        },
        {
          text: "Why do I always have to do everything?",
          feedback: "This adds attitude and usually makes things worse."
        },
        {
          text: "I’ll do it later.",
          feedback: "This delays responsibility unless you agree on a real time."
        }
      ]
    },
    {
      title: "Leave the animals alone",
      prompt: "An animal needs space. What is the best response?",
      choices: [
        {
          text: "Okay, I’ll give them space.",
          feedback: "Good. Animals need respect and boundaries too."
        },
        {
          text: "But I’m just playing!",
          feedback: "Intent does not matter if the animal is uncomfortable."
        },
        {
          text: "They like it.",
          feedback: "Not always. You have to watch body language and listen."
        }
      ]
    }
  ];

  topics.forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic.title;
    btn.onclick = () => loadConversationTopic(topic);
    choicesBox.appendChild(btn);
  });
}

function loadConversationTopic(topic) {
  document.getElementById("scenarioTitle").textContent = topic.title;
  document.getElementById("speakerBox").textContent = "Scenario";
  document.getElementById("conversationText").textContent = topic.prompt;
  document.getElementById("feedbackBox").textContent = "";

  const choicesBox = document.getElementById("choicesBox");
  choicesBox.innerHTML = "";

  topic.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      document.getElementById("feedbackBox").textContent = choice.feedback;
    };
    choicesBox.appendChild(btn);
  });

  const backBtn = document.createElement("button");
  backBtn.textContent = "Back to Topics";
  backBtn.onclick = startConversationPractice;
  choicesBox.appendChild(backBtn);
}

window.startConversationPractice = startConversationPractice;
window.loadConversationTopic = loadConversationTopic;
