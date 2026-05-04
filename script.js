const APP_VERSION = "FINAL-CLEAN-V2";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function startGame(category) {
  if (typeof allQuestions === "undefined" || (!allQuestions[category] && category !== "mixed")) {
    alert("Questions not loading correctly.");
    return;
  }

  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;

  let pool = category === "mixed"
    ? Object.values(allQuestions).flat()
    : [...allQuestions[category]];

  const questionCountValue = document.getElementById("question-count-select")?.value || "10";
  const count = questionCountValue === "all" ? pool.length : Number(questionCountValue);

  const recentKey = "recentQuestions_" + category;
  const recentQuestions = JSON.parse(localStorage.getItem(recentKey) || "[]");

  let freshQuestions = pool.filter(q => !recentQuestions.includes(q.question));
  if (freshQuestions.length < count) freshQuestions = pool;

  currentQuestions = shuffle([...freshQuestions]).slice(0, count);

  const newRecent = [...recentQuestions, ...currentQuestions.map(q => q.question)];
  localStorage.setItem(recentKey, JSON.stringify(newRecent.slice(-30)));

  document.getElementById("game-title").textContent = formatCategoryName(category);
  document.getElementById("score-text").textContent = "Score: 0";

  showScreen("game");
  loadQuestion();
}

function loadQuestion() {
  const q = currentQuestions[currentQuestionIndex];
  if (!q) return;

  answered = false;

  document.getElementById("question-text").textContent = q.question;

  const answerBox = document.getElementById("answer-buttons");
  answerBox.innerHTML = "";

  const shuffledChoices = q.choices
    .map((choice, index) => ({ choice, index }))
    .sort(() => Math.random() - 0.5);

  shuffledChoices.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.choice;
    btn.onclick = () => selectAnswer(item.index, btn);
    answerBox.appendChild(btn);
  });

  document.getElementById("feedback-box").textContent = "";
  document.getElementById("next-btn").classList.add("hidden");
}

function selectAnswer(index, btn) {
  if (answered) return;
  answered = true;

  const q = currentQuestions[currentQuestionIndex];

  document.querySelectorAll("#answer-buttons button").forEach(b => {
    b.disabled = true;
  });

  if (index === q.correct) {
    score += 10;
    btn.classList.add("correct");
    document.getElementById("feedback-box").textContent = "✅ " + q.explanation;
  } else {
    btn.classList.add("wrong");
    document.getElementById("feedback-box").textContent = "❌ " + q.explanation;
  }

  document.getElementById("score-text").textContent = "Score: " + score;
  document.getElementById("next-btn").classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
  } else {
    loadQuestion();
  }
}

function finishGame() {
  showScreen("results");

  document.getElementById("results-score").textContent =
    "Score: " + score + "/" + (currentQuestions.length * 10);
}

function restartCurrentGame() {
  if (currentCategory) startGame(currentCategory);
  else goHome();
}

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

/* Prevent buttons from breaking if these features are not active */
function toggleReadAloud() {}
function readQuestionAloud() {}
function addGoodChoice() {}
function addNeedsWork() {}
function resetTracker() {}
function addCategoryChoice() {}

/* Conversation Practice */
function startConversationPractice() {
  showScreen("conversation");

  document.getElementById("scenarioTitle").textContent = "Conversation Practice";
  document.getElementById("speakerBox").textContent = "Choose a role";
  document.getElementById("conversationText").textContent = "Who starts the conversation?";
  document.getElementById("feedbackBox").textContent = "";
  document.getElementById("respectMeter").textContent = "50";

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

  const parentBtn = document.createElement("button");
  parentBtn.textContent = "Parent Starts";
  parentBtn.onclick = () => showTopics("parent");
  box.appendChild(parentBtn);

  const childBtn = document.createElement("button");
  childBtn.textContent = "Child Starts";
  childBtn.onclick = () => showTopics("child");
  box.appendChild(childBtn);
}

function showTopics(role) {
  const topics = role === "parent" ? parentTopics : childTopics;

  document.getElementById("speakerBox").textContent =
    role === "parent" ? "Parent Topics" : "Child Topics";
  document.getElementById("conversationText").textContent = "Pick a situation:";
  document.getElementById("feedbackBox").textContent = "";

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

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

function loadTopic(topic) {
  document.getElementById("scenarioTitle").textContent = topic.title;
  document.getElementById("speakerBox").textContent = "Scenario";
  document.getElementById("conversationText").textContent = topic.prompt;
  document.getElementById("feedbackBox").textContent = "";

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

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

const parentTopics = [
  {
    title: "Go clean your room",
    prompt: "Parent gives instruction. What is the best way to say it?",
    choices: [
      { text: "Please go clean your room before dinner.", feedback: "Good. Clear and respectful." },
      { text: "Go clean your room NOW!", feedback: "Clear, but more aggressive." },
      { text: "Your room is disgusting.", feedback: "This attacks the person instead of the behavior." }
    ]
  },
  {
    title: "Do your homework",
    prompt: "Parent wants homework done. What is the best response?",
    choices: [
      { text: "Let’s get your homework done first.", feedback: "Supportive and clear." },
      { text: "Do it now.", feedback: "Clear, but less cooperative." },
      { text: "If you don’t, you’re grounded.", feedback: "This jumps straight to punishment." }
    ]
  }
];

const childTopics = [
  {
    title: "That’s not fair!",
    prompt: "Parent says no. What should the child say?",
    choices: [
      { text: "I don’t like it, but can you explain why?", feedback: "Excellent. Respectful disagreement." },
      { text: "You never let me do anything!", feedback: "This escalates the situation." },
      { text: "Whatever.", feedback: "This shuts down communication." }
    ]
  },
  {
    title: "Why do I have to?",
    prompt: "Parent asks you to do something. What is the best response?",
    choices: [
      { text: "Okay, I’ll do it.", feedback: "Responsible." },
      { text: "Why me?", feedback: "Pushback that slows things down." },
      { text: "No.", feedback: "This starts conflict." }
    ]
  }
];

window.startGame = startGame;
window.nextQuestion = nextQuestion;
window.showScreen = showScreen;
window.goHome = goHome;
window.restartCurrentGame = restartCurrentGame;
window.startConversationPractice = startConversationPractice;
window.toggleReadAloud = toggleReadAloud;
window.readQuestionAloud = readQuestionAloud;
window.addGoodChoice = addGoodChoice;
window.addNeedsWork = addNeedsWork;
window.resetTracker = resetTracker;
window.addCategoryChoice = addCategoryChoice;

document.addEventListener("DOMContentLoaded", () => {
  goHome();
});
