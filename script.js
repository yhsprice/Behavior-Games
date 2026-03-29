let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let gameLength = 10;

let goodChoices = 0;
let needsWork = 0;

function showScreen(screenName) {
  const homeScreen = document.getElementById("home-screen");
  const gameScreen = document.getElementById("game-screen");
  const trackerScreen = document.getElementById("tracker-screen");

  homeScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  trackerScreen.classList.add("hidden");

  if (screenName === "game") {
    homeScreen.classList.remove("hidden");
  } else if (screenName === "tracker") {
    trackerScreen.classList.remove("hidden");
    updateTrackerDisplay();
  }
}

function goHome() {
  document.getElementById("home-screen").classList.remove("hidden");
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("tracker-screen").classList.add("hidden");
}

function startGame(category) {
  currentCategory = category;
  score = 0;
  currentQuestionIndex = 0;
  answered = false;

  const fullSet = allQuestions[category] || [];
  currentQuestions = shuffleArray([...fullSet]).slice(0, gameLength);

  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("tracker-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  const titleMap = {
    interrupting: "Interrupting",
    kindness: "Kindness",
    calm: "Calm Reactions"
  };

  document.getElementById("game-title").textContent = titleMap[category] || "Game";
  document.getElementById("score-text").textContent = "Score: 0";
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

  const answerButtons = document.getElementById("answer-buttons");
  answerButtons.innerHTML = "";

  document.getElementById("feedback-box").textContent = "";
  document.getElementById("next-btn").classList.add("hidden");

  questionData.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.onclick = function () {
      selectAnswer(index);
    };
    answerButtons.appendChild(button);
  });

  updateGameProgress();
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

  let message = " Game finished! Final score: " + score + " out of " + (currentQuestions.length * 10) + ".";

  if (score === currentQuestions.length * 10) {
    message += " Perfect score. Nicely done.";
  } else if (score >= currentQuestions.length * 7) {
    message += " Strong job.";
  } else if (score >= currentQuestions.length * 5) {
    message += " Not bad. Keep practicing.";
  } else {
    message += " More practice will help.";
  }

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

function addGoodChoice() {
  goodChoices++;
  saveTracker();
  updateTrackerDisplay();
}

function addNeedsWork() {
  needsWork++;
  saveTracker();
  updateTrackerDisplay();
}

function resetTracker() {
  goodChoices = 0;
  needsWork = 0;
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
}

function saveTracker() {
  localStorage.setItem("choiceQuestGoodChoices", goodChoices);
  localStorage.setItem("choiceQuestNeedsWork", needsWork);
}

function loadTracker() {
  goodChoices = parseInt(localStorage.getItem("choiceQuestGoodChoices")) || 0;
  needsWork = parseInt(localStorage.getItem("choiceQuestNeedsWork")) || 0;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

loadTracker();
updateTrackerDisplay();
