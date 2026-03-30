let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let gameLength = 10;

let goodChoices = 0;
let needsWork = 0;
let currentWeekKey = "";

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

function hideAllScreens() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("tracker-screen").classList.add("hidden");
}

function showScreen(screenName) {
  hideAllScreens();

  if (screenName === "game") {
    document.getElementById("home-screen").classList.remove("hidden");
    updateBestScoreDisplay();
  } else if (screenName === "tracker") {
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

function startGame(category) {
  currentCategory = category;
  score = 0;
  currentQuestionIndex = 0;
  answered = false;

  const fullSet = allQuestions[category] || [];
  currentQuestions = shuffleArray([...fullSet]).slice(0, gameLength);

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
  document.getElementById("badge-text").textContent = "Badge: Starting Out";
  document.getElementById("restart-btn").classList.add("hidden");

  loadQuestion();
}

function loadQuestion() {
  answered = false;

  const questionData = currentQuestions[currentQuestionIndex];
  if (!questionData) {
    finishGame();
    return;
  }

  document.getElementById("question-text").textContent = questionData.question;
  document.getElementById("feedback-box").textContent = "";
  document.getElementById("next-btn").classList.add("hidden");

  const answerButtons = document.getElementById("answer-buttons");
  answerButtons.innerHTML = "";

  questionData.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.onclick = function () {
      selectAnswer(index);
    };
    answerButtons.appendChild(button);
  });

  updateGameProgress();
  updateGameBadge();
}

function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;
  const questionData = currentQuestions[currentQuestionIndex];
  const answerButtons = document.querySelectorAll("#answer-buttons button");
  const feedbackBox = document.getElementById("feedback-box");

  answerButtons.forEach((button, index) => {
    button.classList.add("disabled");
    button.disabled = true;

    if (index === questionData.correct) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && index !== questionData.correct) {
      button.classList.add("wrong");
    }
  });

  if (selectedIndex === questionData.correct) {
    score += 10;
    feedbackBox.textContent = "✅ Correct! " + questionData.explanation;
  } else {
    feedbackBox.textContent = "❌ Not quite. " + questionData.explanation;
  }

  document.getElementById("score-text").textContent = "Score: " + score;
  updateGameBadge();

  if (currentQuestionIndex < currentQuestions.length - 1) {
    document.getElementById("next-btn").classList.remove("hidden");
  } else {
    finishGame();
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  loadQuestion();
}

function finishGame() {
  const feedbackBox = document.getElementById("feedback-box");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");

  saveBestScore(currentCategory, score);
  updateBestScoreDisplay();

  let message = " Game finished! Final score: " + score + " out of " + (currentQuestions.length * 10) + ".";
  feedbackBox.textContent += message;

  nextBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");
}

function restartCurrentGame() {
  startGame(currentCategory);
}

function updateGameProgress() {
  const total = currentQuestions.length;
  const currentNumber = currentQuestionIndex + 1;
  const percent = total === 0 ? 0 : (currentNumber / total) * 100;

  document.getElementById("game-progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").textContent = "Question " + currentNumber + " of " + total;
}

function updateGameBadge() {
  document.getElementById("badge-text").textContent = "Badge: " + getGameBadge(score, currentQuestions.length);
}

function getGameBadge(scoreValue, totalQuestions) {
  const maxScore = totalQuestions * 10;
  const percent = maxScore === 0 ? 0 : (scoreValue / maxScore) * 100;

  if (percent === 100) return "Choice Champion";
  if (percent >= 80) return "Strong Thinker";
  if (percent >= 60) return "Good Judgment";
  if (percent >= 40) return "Getting There";
  return "Starting Out";
}

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
  saveTracker();
  updateTrackerDisplay();
}

function updateTrackerDisplay() {
  document.getElementById("good-count").textContent = goodChoices;
  document.getElementById("bad-count").textContent = needsWork;

  const total = goodChoices + needsWork;
  const percent = total === 0 ? 0 : Math.round((goodChoices / total) * 100);

  document.getElementById("tracker-progress-bar").style.width = percent + "%";
  document.getElementById("tracker-percent-text").textContent = percent + "% good choices";
  document.getElementById("tracker-total-text").textContent = "Total choices: " + total;
  document.getElementById("tracker-badge").textContent = getTrackerBadge(percent, total);
  document.getElementById("tracker-week-text").textContent = "Week of " + formatWeekKey(currentWeekKey);
}

function getTrackerBadge(percent, total) {
  if (total === 0) return "Starting Out";
  if (percent === 100) return "Amazing Week";
  if (percent >= 80) return "Great Week";
  if (percent >= 60) return "Good Progress";
  if (percent >= 40) return "Keep Going";
  return "Fresh Start";
}

function saveTracker() {
  localStorage.setItem("choiceQuestGoodChoices", goodChoices);
  localStorage.setItem("choiceQuestNeedsWork", needsWork);
  localStorage.setItem("choiceQuestWeekKey", currentWeekKey);
}

function loadTracker() {
  goodChoices = parseInt(localStorage.getItem("choiceQuestGoodChoices")) || 0;
  needsWork = parseInt(localStorage.getItem("choiceQuestNeedsWork")) || 0;
  currentWeekKey = localStorage.getItem("choiceQuestWeekKey") || getWeekKey();
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

function saveBestScore(category, newScore) {
  if (!bestScores[category] || newScore > bestScores[category]) {
    bestScores[category] = newScore;
    localStorage.setItem("choiceQuestBestScores", JSON.stringify(bestScores));
  }
}

function loadBestScores() {
  const saved = localStorage.getItem("choiceQuestBestScores");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.keys(bestScores).forEach((key) => {
        bestScores[key] = parsed[key] || 0;
      });
    } catch (e) {}
  }
}

function updateBestScoreDisplay() {
  Object.keys(bestScores).forEach((key) => {
    const el = document.getElementById("best-" + key);
    if (el) {
      el.textContent = "Best Score: " + bestScores[key];
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

loadTracker();
checkWeeklyReset();
loadBestScores();
hideAllScreens();
document.getElementById("home-screen").classList.remove("hidden");
updateTrackerDisplay();
updateBestScoreDisplay();
