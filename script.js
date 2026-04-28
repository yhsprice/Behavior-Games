const APP_VERSION = "18-animations-real-confetti";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let gameFinished = false;

let confettiAnimationId = null;

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

let trackerCategories = {
  listening: { good: 0, bad: 0 },
  kindness: { good: 0, bad: 0 },
  calmBody: { good: 0, bad: 0 },
  honesty: { good: 0, bad: 0 },
  respect: { good: 0, bad: 0 },
  responsibility: { good: 0, bad: 0 }
};

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

const animationMap = {
  interrupting: {
    icon: "💬",
    label: "Pause first. Your words can wait their turn."
  },
  kindness: {
    icon: "💛",
    label: "Kind choice loading... please do not be a gremlin."
  },
  calm: {
    icon: "🫧",
    label: "Breathe first. Exploding is not a strategy."
  },
  honesty: {
    icon: "✅",
    label: "Truth check: honesty builds trust."
  },
  respect: {
    icon: "🤝",
    label: "Respect means treating people like they matter."
  },
  responsibility: {
    icon: "📋",
    label: "Responsible mode: handle your stuff."
  },
  teasing: {
    icon: "🛑",
    label: "Stop sign says: funny should not hurt."
  },
  online: {
    icon: "📱",
    label: "Online safety mode: think before you click."
  }
};

// ---------------- SCREEN CONTROL ----------------

function hideAllScreens() {
  const ids = ["home-screen", "game-screen", "results-screen", "tracker-screen"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

function showScreen(screen) {
  hideAllScreens();

  if (screen === "game") {
    const home = document.getElementById("home-screen");
    if (home) home.classList.remove("hidden");
    updateBestScoreDisplay();
  } else if (screen === "tracker") {
    const tracker = document.getElementById("tracker-screen");
    if (tracker) tracker.classList.remove("hidden");
    checkWeeklyReset();
    updateTrackerDisplay();
  }
}

function goHome() {
  hideAllScreens();
  const home = document.getElementById("home-screen");
  if (home) home.classList.remove("hidden");
  updateBestScoreDisplay();
}

// ---------------- GAME ----------------

function startGame(category) {
  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  gameFinished = false;

  const source = Array.isArray(allQuestions[category]) ? allQuestions[category] : [];
  currentQuestions = shuffleArray([...source]).slice(0, 10);

  hideAllScreens();

  const gameScreen = document.getElementById("game-screen");
  if (gameScreen) gameScreen.classList.remove("hidden");

  const gameTitle = document.getElementById("game-title");
  const scoreText = document.getElementById("score-text");
  const feedbackBox = document.getElementById("feedback-box");
  const newHighScore = document.getElementById("new-high-score");
  const nextBtn = document.getElementById("next-btn");

  if (gameTitle) gameTitle.textContent = titleMap[category] || "Game";
  if (scoreText) scoreText.textContent = "Score: 0";
  if (feedbackBox) {
    feedbackBox.textContent = "";
    feedbackBox.className = "feedback-box";
  }
  if (newHighScore) newHighScore.classList.add("hidden");
  if (nextBtn) {
    nextBtn.classList.add("hidden");
    nextBtn.textContent = "Next Question";
  }

  updateCategoryAnimation(category);
  loadQuestion();
}

function loadQuestion() {
  if (gameFinished) return;

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
    return;
  }

  answered = false;

  const q = currentQuestions[currentQuestionIndex];
  const questionText = document.getElementById("question-text");
  const answerButtons = document.getElementById("answer-buttons");
  const feedbackBox = document.getElementById("feedback-box");
  const nextBtn = document.getElementById("next-btn");
  const questionBox = document.getElementById("question-box");

  if (questionBox) {
    questionBox.classList.remove("pop-question", "correct-glow", "wrong-shake");
    void questionBox.offsetWidth;
    questionBox.classList.add("pop-question");
  }

  if (questionText) questionText.textContent = q.question;
  if (feedbackBox) {
    feedbackBox.textContent = "";
    feedbackBox.className = "feedback-box";
  }
  if (answerButtons) answerButtons.innerHTML = "";

  if (nextBtn) {
    nextBtn.classList.add("hidden");
    nextBtn.textContent = currentQuestionIndex === currentQuestions.length - 1
      ? "See Results"
      : "Next Question";
  }

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(i);
    if (answerButtons) answerButtons.appendChild(btn);
  });

  updateProgress();
}

function selectAnswer(index) {
  if (answered || gameFinished) return;
  answered = true;

  const q = currentQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#answer-buttons button");
  const feedbackBox = document.getElementById("feedback-box");
  const scoreText = document.getElementById("score-text");
  const nextBtn = document.getElementById("next-btn");
  const questionBox = document.getElementById("question-box");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    if (i === index && i !== q.correct) btn.classList.add("wrong");
  });

  if (questionBox) {
    questionBox.classList.remove("correct-glow", "wrong-shake");
    void questionBox.offsetWidth;
  }

  if (index === q.correct) {
    score += 10;

    if (feedbackBox) {
      feedbackBox.className = "feedback-box correct-feedback";
      feedbackBox.textContent = "✅ Correct! " + q.explanation;
    }

    if (questionBox) questionBox.classList.add("correct-glow");
    if (currentCategory === "online") showAccessDenied(false);
  } else {
    if (feedbackBox) {
      feedbackBox.className = "feedback-box wrong-feedback";
      feedbackBox.textContent = "❌ Not quite. " + q.explanation;
    }

    if (questionBox) questionBox.classList.add("wrong-shake");
    if (currentCategory === "online") showAccessDenied(true);
  }

  if (scoreText) scoreText.textContent = "Score: " + score;

  if (nextBtn) {
    nextBtn.textContent = currentQuestionIndex === currentQuestions.length - 1
      ? "See Results"
      : "Next Question";
    nextBtn.classList.remove("hidden");
  }
}

function nextQuestion() {
  if (!answered || gameFinished) return;

  if (currentQuestionIndex === currentQuestions.length - 1) {
    finishGame();
  } else {
    currentQuestionIndex++;
    loadQuestion();
  }
}

function finishGame() {
  if (gameFinished) return;
  gameFinished = true;

  const total = currentQuestions.length * 10;
  const percent = total === 0 ? 0 : (score / total) * 100;
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

  const resultsScore = document.getElementById("results-score");
  const resultsBadge = document.getElementById("results-badge");
  const resultsStreak = document.getElementById("results-streak");
  const resultsMessage = document.getElementById("results-message");
  const newHighEl = document.getElementById("new-high-score");

  if (resultsScore) resultsScore.textContent = "Score: " + score + "/" + total;
  if (resultsBadge) resultsBadge.textContent = "Badge: " + badge;
  if (resultsStreak) resultsStreak.textContent = "Current Streak: " + (streaks[currentCategory] || 0);

  let message = "Nice work.";
  if (percent === 100) {
    message = "Perfect score. That was sharp.";
    launchConfetti();
  } else if (percent >= 80) {
    message = "Great job. Strong round.";
  } else if (percent >= 60) {
    message = "Good work. You’re getting stronger.";
  } else {
    message = "Keep practicing. Progress still counts.";
  }

  if (resultsMessage) resultsMessage.textContent = message;

  if (newHighEl) {
    if (isNewHighScore) newHighEl.classList.remove("hidden");
    else newHighEl.classList.add("hidden");
  }

  hideAllScreens();
  const resultsScreen = document.getElementById("results-screen");
  if (resultsScreen) resultsScreen.classList.remove("hidden");
}

function restartCurrentGame() {
  startGame(currentCategory);
}

function updateProgress() {
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("game-progress-bar");
  const current = currentQuestionIndex + 1;
  const total = currentQuestions.length || 10;
  const percent = Math.round((currentQuestionIndex / total) * 100);

  if (progressText) progressText.textContent = "Question " + current + " of " + total;
  if (progressBar) progressBar.style.width = percent + "%";
}

function updateCategoryAnimation(category) {
  const wrap = document.getElementById("category-animation");
  const icon = document.getElementById("animation-icon");
  const label = document.getElementById("animation-label");

  if (!wrap || !icon || !label) return;

  const info = animationMap[category] || {
    icon: "⭐",
    label: "Choose wisely."
  };

  wrap.className = "category-animation " + category;
  icon.textContent = info.icon;
  label.textContent = info.label;
}

function showAccessDenied(showDenied) {
  const overlay = document.getElementById("access-denied-overlay");
  const box = overlay ? overlay.querySelector(".access-denied-box") : null;

  if (!overlay || !box) return;

  box.textContent = showDenied ? "ACCESS DENIED" : "SMART CLICK";
  overlay.classList.remove("hidden");

  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 700);
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
    try {
      bestScores = JSON.parse(saved);
    } catch (e) {
      console.log("Best scores could not be loaded.");
    }
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
    try {
      streaks = JSON.parse(saved);
    } catch (e) {
      console.log("Streaks could not be loaded.");
    }
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

  if (totalEl) totalEl.textContent = total;
  if (barEl) barEl.style.width = percent + "%";
  if (percentEl) percentEl.textContent = percent + "% good choices";
  if (badgeEl) badgeEl.textContent = getTrackerBadge(percent, total);
  if (weekEl) weekEl.textContent = "Week of " + formatWeekKey(currentWeekKey);

  if (goodBar) goodBar.style.width = percent + "%";
  if (needsBar) needsBar.style.width = badPercent + "%";

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

  if (messageEl) messageEl.textContent = message;

  updateCategoryDisplay();

  if (improvedEl) improvedEl.textContent = getMostImprovedArea();
  if (focusEl) focusEl.textContent = getFocusArea();
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

    trackerCategories = {
      listening: { good: 0, bad: 0 },
      kindness: { good: 0, bad: 0 },
      calmBody: { good: 0, bad: 0 },
      honesty: { good: 0, bad: 0 },
      respect: { good: 0, bad: 0 },
      responsibility: { good: 0, bad: 0 }
    };

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

// ---------------- REAL FALLING CONFETTI ----------------

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const duration = 2600;
  const start = performance.now();

  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: 6 + Math.random() * 8,
    speed: 2 + Math.random() * 5,
    rotation: Math.random() * 360,
    rotationSpeed: -8 + Math.random() * 16,
    drift: -2 + Math.random() * 4,
    color: ["#2f67ea", "#ffcc00", "#ff5f5f", "#42b883", "#d97706"][Math.floor(Math.random() * 5)]
  }));

  function draw(now) {
    const elapsed = now - start;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += piece.rotationSpeed;

      if (piece.y > canvas.height + 20) {
        piece.y = -20;
        piece.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
      ctx.restore();
    });

    if (elapsed < duration) {
      confettiAnimationId = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiAnimationId = null;
    }
  }

  confettiAnimationId = requestAnimationFrame(draw);
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
