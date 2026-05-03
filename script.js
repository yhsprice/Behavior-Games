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
