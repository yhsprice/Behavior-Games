const APP_VERSION = "13-results-fixed";

// ---------------- VARIABLES ----------------
let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let gameFinished = false;

let bestScores = {
  interrupting: 0,
  kindness: 0,
  calm: 0,
  honesty: 0,
  respect: 0,
  responsibility: 0,
  teasing: 0,
  online: 0
};

// ---------------- SCREEN CONTROL ----------------

function hideAllScreens() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("results-screen").classList.add("hidden");
}

function goHome() {
  hideAllScreens();
  document.getElementById("home-screen").classList.remove("hidden");
  updateBestScoreDisplay();
}

// ---------------- GAME ----------------

function startGame(category) {
  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  gameFinished = false;

  currentQuestions = shuffleArray([...allQuestions[category]]).slice(0, 10);

  hideAllScreens();
  document.getElementById("game-screen").classList.remove("hidden");

  document.getElementById("score-text").textContent = "Score: 0";
  document.getElementById("feedback-box").textContent = "";

  loadQuestion();
}

function loadQuestion() {
  if (gameFinished) return;

  const q = currentQuestions[currentQuestionIndex];

  document.getElementById("question-text").textContent = q.question;

  const container = document.getElementById("answer-buttons");
  container.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(i);
    container.appendChild(btn);
  });

  updateProgress();
}

function selectAnswer(index) {
  if (answered || gameFinished) return;

  answered = true;

  const q = currentQuestions[currentQuestionIndex];

  if (index === q.correct) {
    score += 10;
  }

  document.getElementById("score-text").textContent = "Score: " + score;

  if (currentQuestionIndex === currentQuestions.length - 1) {
    finishGame();
  } else {
    currentQuestionIndex++;
    answered = false;
    loadQuestion();
  }
}

function finishGame() {
  gameFinished = true;

  const total = currentQuestions.length * 10;
  const percent = (score / total) * 100;

  saveBestScore(currentCategory, score);

  document.getElementById("results-score").textContent =
    "Score: " + score + "/" + total;

  let message = "Nice work.";
  if (percent >= 80) {
    message = "Great job!";
    launchConfetti();
  }

  document.getElementById("results-message").textContent = message;

  hideAllScreens();
  document.getElementById("results-screen").classList.remove("hidden");
}

// ---------------- PROGRESS ----------------

function updateProgress() {
  const current = currentQuestionIndex + 1;
  document.getElementById("progress-text").textContent =
    "Question " + current + " of 10";
}

// ---------------- BEST SCORES ----------------

function saveBestScore(category, score) {
  if (score > bestScores[category]) {
    bestScores[category] = score;
    localStorage.setItem("bestScores", JSON.stringify(bestScores));
  }
}

function loadBestScores() {
  const saved = localStorage.getItem("bestScores");
  if (saved) {
    bestScores = JSON.parse(saved);
  }
}

function updateBestScoreDisplay() {
  Object.keys(bestScores).forEach((key) => {
    const el = document.getElementById("best-" + key);
    if (el) el.textContent = "Best Score: " + bestScores[key];
  });
}

// ---------------- CONFETTI ----------------

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = ["red", "blue", "yellow", "green"][
      Math.floor(Math.random() * 4)
    ];
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      6,
      6
    );
  }
}

// ---------------- UTIL ----------------

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ---------------- INIT ----------------

loadBestScores();
updateBestScoreDisplay();
goHome();

console.log("VERSION 13 LOADED");
