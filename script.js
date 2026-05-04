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

 // Shuffle answers while keeping track of correct one
const shuffled = q.choices
  .map((choice, index) => ({ choice, index }))
  .sort(() => Math.random() - 0.5);

shuffled.forEach((item) => {
  const btn = document.createElement("button");
  btn.textContent = item.choice;

  btn.onclick = () => selectAnswer(item.index, btn);

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

// ===== CONVERSATION PRACTICE (FULL VERSION) =====

function startConversationPractice() {
  showScreen("conversation");

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

  document.getElementById("scenarioTitle").textContent = "Conversation Practice";
  document.getElementById("speakerBox").textContent = "Choose a role";
  document.getElementById("conversationText").textContent = "Who starts the conversation?";
  document.getElementById("feedbackBox").textContent = "";
  document.getElementById("respectMeter").textContent = "50";

  const parentBtn = document.createElement("button");
  parentBtn.textContent = "Parent Starts";
  parentBtn.onclick = () => showTopics("parent");

  const childBtn = document.createElement("button");
  childBtn.textContent = "Child Starts";
  childBtn.onclick = () => showTopics("child");

  box.appendChild(parentBtn);
  box.appendChild(childBtn);
}

// ===== SHOW TOPICS =====
function showTopics(role) {
  const topics = role === "parent" ? parentTopics : childTopics;

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

  document.getElementById("speakerBox").textContent = role === "parent" ? "Parent Topics" : "Child Topics";
  document.getElementById("conversationText").textContent = "Pick a situation:";
  document.getElementById("feedbackBox").textContent = "";

  topics.forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic.title;
    btn.onclick = () => loadTopic(topic);
    box.appendChild(btn);
  });

  const back = document.createElement("button");
  back.textContent = "⬅ Back";
  back.onclick = startConversationPractice;
  box.appendChild(back);
}

// ===== LOAD TOPIC =====
function loadTopic(topic) {
  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

  document.getElementById("scenarioTitle").textContent = topic.title;
  document.getElementById("speakerBox").textContent = "Scenario";
  document.getElementById("conversationText").textContent = topic.prompt;
  document.getElementById("feedbackBox").textContent = "";

  topic.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      document.getElementById("feedbackBox").textContent = choice.feedback;
    };
    box.appendChild(btn);
  });

  const back = document.createElement("button");
  back.textContent = "⬅ Back to Topics";
  back.onclick = startConversationPractice;
  box.appendChild(back);
}

// ===== DATA =====

const parentTopics = [
  {
    title: "Go clean your room",
    prompt: "Parent gives instruction. What is the BEST way to say it?",
    choices: [
      {
        text: "Please go clean your room before dinner.",
        feedback: "Good. Clear + respectful."
      },
      {
        text: "Go clean your room NOW!",
        feedback: "Clear, but more aggressive tone."
      },
      {
        text: "Your room is disgusting.",
        feedback: "Attacks the person, not the behavior."
      }
    ]
  },
  {
    title: "Do your homework",
    prompt: "Parent wants homework done. Best response?",
    choices: [
      {
        text: "Let’s get your homework done first.",
        feedback: "Supportive and clear."
      },
      {
        text: "Do it now.",
        feedback: "Works, but less cooperative."
      },
      {
        text: "If you don’t, you’re grounded.",
        feedback: "Jumps straight to punishment."
      }
    ]
  }
];

const childTopics = [
  {
    title: "That’s not fair!",
    prompt: "Parent says no. What should the child say?",
    choices: [
      {
        text: "I don’t like it, but can you explain why?",
        feedback: "Excellent. Respectful disagreement."
      },
      {
        text: "You never let me do anything!",
        feedback: "Escalates the situation."
      },
      {
        text: "Whatever.",
        feedback: "Shuts down communication."
      }
    ]
  },
  {
    title: "Why do I have to?",
    prompt: "Parent asks you to do something.",
    choices: [
      {
        text: "Okay, I’ll do it.",
        feedback: "Responsible."
      },
      {
        text: "Why me?",
        feedback: "Pushback that slows things down."
      },
      {
        text: "No.",
        feedback: "Starts a conflict."
      }
    ]
  }
];

window.startConversationPractice = startConversationPractice;
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
