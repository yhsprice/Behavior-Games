const APP_VERSION = "15-fixed-home-tracker-results";

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

let goodChoices = 0;
let needsWork = 0;
let currentWeekKey = "";

// ---------------- SCREEN CONTROL ----------------

function hideAllScreens() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("results-screen").classList.add("hidden");
  document.getElementById("tracker-screen").classList.add("hidden");
}

function showScreen(screen) {
  hideAllScreens();

  if (screen === "game") {
    document.getElementById("home-screen").classList.remove("hidden");
    updateBestScoreDisplay();
  } else if (screen === "tracker") {
    document.getElementById("tracker-screen").classList.remove("hidden");
    checkWeeklyReset();
    updateTrackerDisplay();
  }
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
  updateBestScoreDisplay();

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
}

function restartCurrentGame() {
  startGame(currentCategory);
}

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

// ---------------- TRACKER ----------------

function addGoodChoice() {
  checkWeeklyReset();
  goodChoices++;
  saveTracker();
  updateTrackerDisplay();
}

function addNeedsWork() {
  checkWeeklyReset();
  needsWork++;
  saveTracker();
  updateTrackerDisplay();
}

function resetTracker() {
  goodChoices = 0;
  needsWork = 0;
  currentWeekKey = getWeekKey();

  trackerCategories = {
    listening: { good: 0, bad: 0 },
    kindness: { good: 0, bad: 0 },
    calmBody: { good: 0, bad: 0 },
    honesty: { good: 0, bad: 0 },
    respect: { good: 0, bad: 0 },
    responsibility: { good: 0, bad: 0 }
  };

  saveTracker();
  updateTrackerDisplay();
}

function updateTrackerDisplay() {
  const goodEl = document.getElementById("good-count");
  const badEl = document.getElementById("bad-count");
  const barEl = document.getElementById("tracker-progress-bar");
  const percentEl = document.getElementById("tracker-percent-text");
  const totalEl = document.getElementById("tracker-total-number");
  const badgeEl = document.getElementById("tracker-badge");
  const weekEl = document.getElementById("tracker-week-text");
  const messageEl = document.getElementById("tracker-message");
  const goodBar = document.getElementById("good-bar");
  const needsBar = document.getElementById("needs-bar");
  const improvedEl = document.getElementById("most-improved");
  const focusEl = document.getElementById("focus-area");

  if (!goodEl) return;

  goodEl.textContent = goodChoices;
  badEl.textContent = needsWork;

  const total = goodChoices + needsWork;
  const percent = total === 0 ? 0 : Math.round((goodChoices / total) * 100);
  const badPercent = total === 0 ? 0 : Math.round((needsWork / total) * 100);

  totalEl.textContent = total;
  barEl.style.width = percent + "%";
  percentEl.textContent = percent + "% good choices";
  badgeEl.textContent = getTrackerBadge(percent, total);
  weekEl.textContent = "Week of " + formatWeekKey(currentWeekKey);

  goodBar.style.width = percent + "%";
  needsBar.style.width = badPercent + "%";

  let message = "Let’s get started.";
  if (total === 0) {
    message = "No choices tracked yet.";
  } else if (percent === 100) {
    message = "Amazing week. You’re on fire.";
  } else if (percent >= 80) {
    message = "Strong progress. Keep it going.";
  } else if (percent >= 60) {
    message = "Good momentum. You’re building habits.";
  } else if (percent >= 40) {
    message = "Still working on it. Progress is progress.";
  } else {
    message = "Fresh reset energy might help.";
  }

  messageEl.textContent = message;

  updateCategoryDisplay();

  if (improvedEl) improvedEl.textContent = getMostImprovedArea();
  if (focusEl) focusEl.textContent = getFocusArea();
}

  let trackerCategories = {
  listening: { good: 0, bad: 0 },
  kindness: { good: 0, bad: 0 },
  calmBody: { good: 0, bad: 0 },
  honesty: { good: 0, bad: 0 },
  respect: { good: 0, bad: 0 },
  responsibility: { good: 0, bad: 0 }
};

  function addCategoryChoice(category, isGood) {
  checkWeeklyReset();

  if (!trackerCategories[category]) return;

  if (isGood) {
    trackerCategories[category].good++;
    goodChoices++;
  } else {
    trackerCategories[category].bad++;
    needsWork++;
  }

  saveTracker();
  updateTrackerDisplay();
}

function updateCategoryDisplay() {
  Object.keys(trackerCategories).forEach((key) => {
    const goodEl = document.getElementById(key + "-good");
    const badEl = document.getElementById(key + "-bad");

    if (goodEl) goodEl.textContent = "Good: " + trackerCategories[key].good;
    if (badEl) badEl.textContent = "Needs Work: " + trackerCategories[key].bad;
  });
}

function getMostImprovedArea() {
  let bestKey = "--";
  let bestScore = -999999;

  Object.keys(trackerCategories).forEach((key) => {
    const value = trackerCategories[key].good - trackerCategories[key].bad;
    if (value > bestScore) {
      bestScore = value;
      bestKey = key;
    }
  });

  return formatCategoryName(bestKey);
}

function getFocusArea() {
  let worstKey = "--";
  let worstScore = 999999;

  Object.keys(trackerCategories).forEach((key) => {
    const value = trackerCategories[key].good - trackerCategories[key].bad;
    if (value < worstScore) {
      worstScore = value;
      worstKey = key;
    }
  });

  return formatCategoryName(worstKey);
}

function formatCategoryName(key) {
  const map = {
    listening: "Listening",
    kindness: "Kindness",
    calmBody: "Calm Body",
    honesty: "Honesty",
    respect: "Respect",
    responsibility: "Responsibility"
  };

  return map[key] || "--";
}
  if (!goodEl) return;

  goodEl.textContent = goodChoices;
  badEl.textContent = needsWork;

  const total = goodChoices + needsWork;
  const percent = total === 0 ? 0 : Math.round((goodChoices / total) * 100);
  const badPercent = total === 0 ? 0 : Math.round((needsWork / total) * 100);

  totalEl.textContent = total;
  barEl.style.width = percent + "%";
  percentEl.textContent = percent + "% good choices";
  badgeEl.textContent = getTrackerBadge(percent, total);
  weekEl.textContent = "Week of " + formatWeekKey(currentWeekKey);

  goodBar.style.width = percent + "%";
  needsBar.style.width = badPercent + "%";

  let message = "Let’s get started.";
  if (total === 0) {
    message = "No choices tracked yet.";
  } else if (percent === 100) {
    message = "Amazing week. You’re on fire.";
  } else if (percent >= 80) {
    message = "Strong progress. Keep it going.";
  } else if (percent >= 60) {
    message = "Good momentum. You’re building habits.";
  } else if (percent >= 40) {
    message = "Still working on it. Progress is progress.";
  } else {
    message = "Fresh reset energy might help.";
  }

  messageEl.textContent = message;
function getTrackerBadge(percent, total) {
  if (total === 0) return "Starting Out";
  if (percent === 100) return "Legend Week";
  if (percent >= 80) return "Goal Crusher";
  if (percent >= 60) return "Steady Climber";
  if (percent >= 40) return "Still Building";
  return "Fresh Start";
}

function saveTracker() {
  localStorage.setItem("choiceQuestGoodChoices", goodChoices);
  localStorage.setItem("choiceQuestNeedsWork", needsWork);
  localStorage.setItem("choiceQuestWeekKey", currentWeekKey);
  localStorage.setItem("choiceQuestTrackerCategories", JSON.stringify(trackerCategories));
}

function loadTracker() {
  goodChoices = parseInt(localStorage.getItem("choiceQuestGoodChoices")) || 0;
  needsWork = parseInt(localStorage.getItem("choiceQuestNeedsWork")) || 0;
  currentWeekKey = localStorage.getItem("choiceQuestWeekKey") || getWeekKey();

  const savedCategories = localStorage.getItem("choiceQuestTrackerCategories");
  if (savedCategories) {
    try {
      trackerCategories = JSON.parse(savedCategories);
    } catch (e) {
      console.log("Tracker categories could not be loaded.");
    }
  }
}

function checkWeeklyReset() {
  const newWeekKey = getWeekKey();

  if (currentWeekKey !== newWeekKey) {
    goodChoices = 0;
    needsWork = 0;
    currentWeekKey = newWeekKey;
    saveTracker();
  }
}

function getWeekKey() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const date = String(monday.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + date;
}

function formatWeekKey(weekKey) {
  if (!weekKey) return "--";
  const parts = weekKey.split("-");
  if (parts.length !== 3) return weekKey;
  return parts[1] + "/" + parts[2] + "/" + parts[0];
}

// ---------------- CONFETTI ----------------

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = ["#2f67ea", "#ffcc00", "#ff5f5f", "#42b883"][Math.floor(Math.random() * 4)];
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      8,
      8
    );
  }

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1200);
}

// ---------------- UTIL ----------------

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ---------------- INIT ----------------

loadBestScores();
loadStreaks();
loadTracker();
updateBestScoreDisplay();
goHome();

console.log(APP_VERSION);
