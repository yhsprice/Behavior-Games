const APP_VERSION = "FINAL-STABLE-FIXED";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

let trackerData = JSON.parse(localStorage.getItem("roxyTrackerData")) || {
  good: 0,
  bad: 0,
  categories: {
    listening: { good: 0, bad: 0 },
    kindness: { good: 0, bad: 0 },
    calmBody: { good: 0, bad: 0 },
    honesty: { good: 0, bad: 0 },
    respect: { good: 0, bad: 0 },
    responsibility: { good: 0, bad: 0 }
  }
};

// ---------------- SOUND ----------------

function playSound(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "correct") {
      oscillator.frequency.setValueAtTime(700, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(950, audioCtx.currentTime + 0.12);
    } else {
      oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(120, audioCtx.currentTime + 0.12);
    }

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    console.log("Sound skipped:", e);
  }
}

// ---------------- SCREEN CONTROL ----------------

function hideAllScreens() {
  ["home-screen", "game-screen", "results-screen", "tracker-screen"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

function showScreen(screen) {
  hideAllScreens();

  if (screen === "game" && !currentCategory) {
    screen = "home";
  }

  const el = document.getElementById(screen + "-screen");
  if (el) el.classList.remove("hidden");

  if (screen === "tracker") {
    updateTrackerDisplay();
  }
}

function goHome() {
  showScreen("home");
}

// ---------------- GAME START ----------------

function startGame(category) {
  if (typeof allQuestions === "undefined") {
    alert("questions.js is not loading. Check that questions.js exists and is above script.js in index.html.");
    return;
  }

  if (!allQuestions[category]) {
    alert("No questions found for: " + category);
    return;
  }

  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;

  currentQuestions = shuffleArray([...allQuestions[category]]).slice(0, 10);

  document.getElementById("game-title").textContent = formatCategoryName(category);
  document.getElementById("score-text").textContent = "Score: 0";

  showScreen("game");
  loadQuestion();
}

// ---------------- LOAD QUESTION ----------------

function loadQuestion() {
  const q = currentQuestions[currentQuestionIndex];

  answered = false;

  const questionBox = document.getElementById("question-box");
  questionBox.classList.remove("correct-glow", "wrong-shake");

  document.getElementById("question-text").textContent = q.question;

  const progressPercent = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
  document.getElementById("game-progress-bar").style.width = progressPercent + "%";
  document.getElementById("progress-text").textContent =
    "Question " + (currentQuestionIndex + 1) + " of " + currentQuestions.length;

  const answerButtons = document.getElementById("answer-buttons");
  answerButtons.innerHTML = "";

  const shuffledChoices = shuffleArray(
    q.choices.map((choiceText, originalIndex) => ({
      text: choiceText,
      originalIndex: originalIndex
    }))
  );

  shuffledChoices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => selectAnswer(choice.originalIndex, btn);
    answerButtons.appendChild(btn);
  });

  const feedbackBox = document.getElementById("feedback-box");
  feedbackBox.className = "feedback-box";
  feedbackBox.textContent = "";

  document.getElementById("next-btn").classList.add("hidden");

  updateAnimationLabel();
}

// ---------------- SELECT ANSWER ----------------

function selectAnswer(selectedIndex, clickedButton) {
  if (answered) return;
  answered = true;

  const q = currentQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#answer-buttons button");
  const feedbackBox = document.getElementById("feedback-box");
  const questionBox = document.getElementById("question-box");

  buttons.forEach(btn => {
    btn.disabled = true;
  });

  buttons.forEach(btn => {
    const answerText = btn.textContent;
    if (answerText === q.choices[q.correct]) {
      btn.classList.add("correct");
    }
  });

  if (selectedIndex === q.correct) {
    playSound("correct");
    score += 10;

    feedbackBox.className = "feedback-box correct-feedback";
    feedbackBox.textContent = "✅ Correct! " + q.explanation;

    questionBox.classList.add("correct-glow");
  } else {
    playSound("wrong");

    if (clickedButton) clickedButton.classList.add("wrong");

    feedbackBox.className = "feedback-box wrong-feedback";
    feedbackBox.textContent = "❌ Not quite. " + q.explanation;

    questionBox.classList.add("wrong-shake");

    if (currentCategory === "online") {
      showAccessDenied(true);
    }
  }

  document.getElementById("score-text").textContent = "Score: " + score;
  document.getElementById("next-btn").classList.remove("hidden");
}

// ---------------- NEXT QUESTION ----------------

function nextQuestion() {
  currentQuestionIndex++;

  showAccessDenied(false);

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
  } else {
    loadQuestion();
  }
}

// ---------------- FINISH GAME ----------------

function finishGame() {
  const maxScore = currentQuestions.length * 10;
  const percent = Math.round((score / maxScore) * 100);

  showScreen("results");

  document.getElementById("results-score").textContent = "Score: " + score + "/" + maxScore;
  document.getElementById("results-badge").textContent = "Badge: " + getBadge(percent);
  document.getElementById("results-message").textContent = getResultsMessage(percent);

  const streak = Number(localStorage.getItem("roxyStreak") || 0) + 1;
  localStorage.setItem("roxyStreak", streak);
  document.getElementById("results-streak").textContent = "Current Streak: " + streak;

  saveBestScore(currentCategory, score);

  launchConfetti();
}

function restartCurrentGame() {
  if (currentCategory) {
    startGame(currentCategory);
  } else {
    goHome();
  }
}

// ---------------- SCORES ----------------

function saveBestScore(category, newScore) {
  const key = "best-" + category;
  const oldScore = Number(localStorage.getItem(key) || 0);

  const highScoreBox = document.getElementById("new-high-score");

  if (newScore > oldScore) {
    localStorage.setItem(key, newScore);
    if (highScoreBox) highScoreBox.classList.remove("hidden");
  } else {
    if (highScoreBox) highScoreBox.classList.add("hidden");
  }

  updateBestScores();
}

function updateBestScores() {
  const categories = [
    "interrupting",
    "kindness",
    "calm",
    "honesty",
    "respect",
    "responsibility",
    "teasing",
    "online"
  ];

  categories.forEach(category => {
    const el = document.getElementById("best-" + category);
    if (el) {
      el.textContent = "Best Score: " + Number(localStorage.getItem("best-" + category) || 0);
    }
  });
}

// ---------------- TRACKER ----------------

function saveTracker() {
  localStorage.setItem("roxyTrackerData", JSON.stringify(trackerData));
}

function addGoodChoice() {
  trackerData.good++;
  saveTracker();
  updateTrackerDisplay();
}

function addNeedsWork() {
  trackerData.bad++;
  saveTracker();
  updateTrackerDisplay();
}

function addCategoryChoice(category, isGood) {
  if (!trackerData.categories[category]) {
    trackerData.categories[category] = { good: 0, bad: 0 };
  }

  if (isGood) {
    trackerData.categories[category].good++;
    trackerData.good++;
  } else {
    trackerData.categories[category].bad++;
    trackerData.bad++;
  }

  saveTracker();
  updateTrackerDisplay();
}

function resetTracker() {
  if (!confirm("Reset the tracker?")) return;

  trackerData = {
    good: 0,
    bad: 0,
    categories: {
      listening: { good: 0, bad: 0 },
      kindness: { good: 0, bad: 0 },
      calmBody: { good: 0, bad: 0 },
      honesty: { good: 0, bad: 0 },
      respect: { good: 0, bad: 0 },
      responsibility: { good: 0, bad: 0 }
    }
  };

  saveTracker();
  updateTrackerDisplay();
}

function updateTrackerDisplay() {
  const good = trackerData.good;
  const bad = trackerData.bad;
  const total = good + bad;
  const percent = total === 0 ? 0 : Math.round((good / total) * 100);

  setText("good-count", good);
  setText("bad-count", bad);
  setText("tracker-total-number", total);
  setText("tracker-percent-text", percent + "% good choices");

  setWidth("tracker-progress-bar", percent + "%");
  setWidth("good-bar", percent + "%");
  setWidth("needs-bar", total === 0 ? "0%" : Math.round((bad / total) * 100) + "%");

  setText("tracker-badge", getBadge(percent));
  setText("tracker-message", getTrackerMessage(percent));
  setText("tracker-week-text", getWeekText());

  Object.keys(trackerData.categories).forEach(category => {
    setText(category + "-good", "Good: " + trackerData.categories[category].good);
    setText(category + "-bad", "Needs Work: " + trackerData.categories[category].bad);
  });

  updateTrackerSummary();
}

function updateTrackerSummary() {
  let bestArea = "--";
  let focusArea = "--";
  let bestScore = -1;
  let worstScore = 999;

  Object.keys(trackerData.categories).forEach(category => {
    const data = trackerData.categories[category];
    const total = data.good + data.bad;

    if (total > 0) {
      const percent = Math.round((data.good / total) * 100);

      if (percent > bestScore) {
        bestScore = percent;
        bestArea = formatCategoryName(category);
      }

      if (percent < worstScore) {
        worstScore = percent;
        focusArea = formatCategoryName(category);
      }
    }
  });

  setText("most-improved", bestArea);
  setText("focus-area", focusArea);
}

// ---------------- ACCESS DENIED ----------------

function showAccessDenied(show) {
  const overlay = document.getElementById("access-denied-overlay");
  if (!overlay) return;

  if (show) {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 4000);
  } else {
    overlay.classList.add("hidden");
  }
}

// ---------------- CONFETTI ----------------

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: 6 + Math.random() * 6,
    speed: 1 + Math.random() * 3,
    drift: -1 + Math.random() * 2
  }));

  const duration = 5000;
  const start = performance.now();

  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;

      if (p.y > canvas.height) p.y = -10;

      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    if (elapsed < duration) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(draw);
}

// ---------------- HELPERS ----------------

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setWidth(id, width) {
  const el = document.getElementById(id);
  if (el) el.style.width = width;
}

function formatCategoryName(category) {
  const names = {
    interrupting: "Interrupting",
    kindness: "Kindness",
    calm: "Calm Reactions",
    calmBody: "Calm Body",
    honesty: "Honesty",
    respect: "Respect",
    responsibility: "Responsibility",
    teasing: "Teasing",
    online: "Online Behavior",
    listening: "Listening"
  };

  return names[category] || category;
}

function getBadge(percent) {
  if (percent >= 90) return "Reality Check Champion";
  if (percent >= 75) return "Smart Choice Star";
  if (percent >= 50) return "Getting Stronger";
  return "Starting Out";
}

function getResultsMessage(percent) {
  if (percent >= 90) return "Excellent work. You made strong choices.";
  if (percent >= 75) return "Great job. You are thinking before acting.";
  if (percent >= 50) return "Good effort. Keep practicing those choices.";
  return "Keep practicing. Nobody learns this stuff by magic.";
}

function getTrackerMessage(percent) {
  if (percent >= 90) return "Amazing week.";
  if (percent >= 75) return "Strong progress.";
  if (percent >= 50) return "Getting better.";
  if (percent > 0) return "Needs practice.";
  return "Let’s get started.";
}

function getWeekText() {
  const today = new Date();
  return today.toLocaleDateString();
}

function updateAnimationLabel() {
  const icon = document.getElementById("animation-icon");
  const label = document.getElementById("animation-label");

  if (!icon || !label) return;

  const map = {
    interrupting: ["🤐", "Wait your turn."],
    kindness: ["💛", "Choose kindness."],
    calm: ["🧘", "Stay calm."],
    honesty: ["✅", "Tell the truth."],
    respect: ["🤝", "Show respect."],
    responsibility: ["🎒", "Own your choices."],
    teasing: ["🚫", "Think before joking."],
    online: ["💻", "Be smart online."]
  };

  const selected = map[currentCategory] || ["⭐", "Choose wisely."];

  icon.textContent = selected[0];
  label.textContent = selected[1];
}

// ---------------- INIT ----------------

document.addEventListener("DOMContentLoaded", () => {
  updateBestScores();
  updateTrackerDisplay();
  goHome();
  console.log(APP_VERSION);
});
