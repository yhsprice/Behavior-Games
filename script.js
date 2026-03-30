const APP_VERSION = "14-highscore-badges-streaks";

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

let streaks = {
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

  const titleMap = {
    interrupting: "Interrupting",
    kindness: "Kindness",
    calm: "Calm Reactions",
    honesty: "Honesty",
    respect: "Respect",
    responsibility: "Responsibility",
    teasing: "Teasing",
    online: "Online Behavior"
  };

  document.getElementById("game-title").textContent = titleMap[category] || "Game";
  document.getElementById("score-text").textContent = "Score: 0";
  document.getElementById("feedback-box").textContent = "";
  document.getElementById("new-high-score").classList.add("hidden");

  loadQuestion();
}

function loadQuestion() {
  if (gameFinished) return;

  const q = currentQuestions[currentQuestionIndex];
  document.getElementById("question-text").textContent = q.question;

  const container = document.getElementById("answer-buttons");
  container.innerHTML = "";
  document.getElementById("feedback-box").textContent = "";

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
  const buttons = document.querySelectorAll("#answer-buttons button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    if (i === index && i !== q.correct) btn.classList.add("wrong");
  });

  if (index === q.correct) {
    score += 10;
    document.getElementById("feedback-box").textContent = "✅ Correct! " + q.explanation;
  } else {
    document.getElementById("feedback-box").textContent = "❌ Not quite. " + q.explanation;
  }

  document.getElementById("score-text").textContent = "Score: " + score;

  setTimeout(() => {
    if (currentQuestionIndex === currentQuestions.length - 1) {
      finishGame();
    } else {
      currentQuestionIndex++;
      answered = false;
      loadQuestion();
    }
  }, 700);
}

function finishGame() {
  gameFinished = true;

  const total = currentQuestions.length * 10;
  const percent = (score / total) * 100;
  const badge = getBadge(currentCategory, percent);

  const oldBest = bestScores[currentCategory] || 0;
  let isNewHighScore = false;

  if (score > oldBest) {
    bestScores[currentCategory] = score;
    isNewHighScore = true;
  }

  if (percent >= 80) {
    streaks[currentCategory] = (streaks[currentCategory] || 0) + 1;
    launchConfetti();
  } else {
    streaks[currentCategory] = 0;
  }

  saveBestScores();
  saveStreaks();

  document.getElementById("results-score").textContent = "Score: " + score + "/" + total;
  document.getElementById("results-badge").textContent = "Badge: " + badge;
  document.getElementById("results-streak").textContent =
    "Current Streak: " + (streaks[currentCategory] || 0);

  let message = "Nice work.";
  if (percent === 100) {
    message = "Perfect score. That was sharp.";
  } else if (percent >= 80) {
    message = "Great job. Strong round.";
  } else if (percent >= 60) {
    message = "Good work. You’re getting stronger.";
  } else {
    message = "Keep practicing. Progress still counts.";
  }

  document.getElementById("results-message").textContent = message;

  const newHighEl = document.getElementById("new-high-score");
  if (isNewHighScore) {
    newHighEl.classList.remove("hidden");
  } else {
    newHighEl.classList.add("hidden");
  }

  hideAllScreens();
  document.getElementById("results-screen").classList.remove("hidden");

  updateBestScoreDisplay();
}

function restartCurrentGame() {
  startGame(currentCategory);
}

// ---------------- PROGRESS ----------------

function updateProgress() {
  const current = currentQuestionIndex + 1;
  document.getElementById("progress-text").textContent = "Question " + current + " of 10";
}

// ---------------- BADGES ----------------

function getBadge(category, percent) {
  const badgeMap = {
    interrupting: {
      top: "Timing Master",
      high: "Polite Pause Pro",
      mid: "Learning Timing",
      low: "Practice Needed"
    },
    kindness: {
      top: "Kindness Champion",
      high: "Caring Teammate",
      mid: "Helping Heart",
      low: "Practice Needed"
    },
    calm: {
      top: "Calm Captain",
      high: "Cool Thinker",
      mid: "Breathing Through It",
      low: "Practice Needed"
    },
    honesty: {
      top: "Truth Titan",
      high: "Honesty Hero",
      mid: "Building Trust",
      low: "Practice Needed"
    },
    respect: {
      top: "Respect Leader",
      high: "Respect Builder",
      mid: "Learning Respect",
      low: "Practice Needed"
    },
    responsibility: {
      top: "Responsibility Boss",
      high: "Reliable Helper",
      mid: "Stepping Up",
      low: "Practice Needed"
    },
    teasing: {
      top: "Kind Words Champion",
      high: "Friendly Speaker",
      mid: "Better Choices Builder",
      low: "Practice Needed"
    },
    online: {
      top: "Digital Wisdom Pro",
      high: "Smart Online Thinker",
      mid: "Safer Clicks",
      low: "Practice Needed"
    }
  };

  const badges = badgeMap[category] || {
    top: "Champion",
    high: "Strong Thinker",
    mid: "Getting Better",
    low: "Practice Needed"
  };

  if (percent === 100) return badges.top;
  if (percent >= 80) return badges.high;
  if (percent >= 60) return badges.mid;
  return badges.low;
}

// ---------------- BEST SCORES ----------------

function saveBestScores() {
  localStorage.setItem("bestScores", JSON.stringify(bestScores));
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
    if (el) {
      el.textContent = "Best Score: " + (bestScores[key] || 0);
    }
  });
}

// ---------------- STREAKS ----------------

function saveStreaks() {
  localStorage.setItem("streaks", JSON.stringify(streaks));
}

function loadStreaks() {
  const saved = localStorage.getItem("streaks");
  if (saved) {
    streaks = JSON.parse(saved);
  }
}

// ---------------- CONFETTI ----------------

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = ["#2f67ea", "#ffcc00", "#ff5f5f", "#42b883"][Math.floor(Math.random() * 4)];
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      8,
      8
    );
  }
}

// ---------------- UTIL ----------------

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ---------------- INIT ----------------

loadBestScores();
loadStreaks();
updateBestScoreDisplay();
goHome();

console.log(APP_VERSION);
