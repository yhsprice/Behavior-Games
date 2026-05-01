const APP_VERSION = "FINAL-V116-CLEAN";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let readAloudOn = false;
let categoryMistakes = {};

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

if (!trackerData.categories) {
  trackerData.categories = {
    listening: { good: 0, bad: 0 },
    kindness: { good: 0, bad: 0 },
    calmBody: { good: 0, bad: 0 },
    honesty: { good: 0, bad: 0 },
    respect: { good: 0, bad: 0 },
    responsibility: { good: 0, bad: 0 }
  };
}

function hideAllScreens() {
  ["home-screen", "game-screen", "results-screen", "tracker-screen", "conversation-screen"].forEach(id => {
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

  if (screen === "tracker") updateTrackerDisplay();
}

function goHome() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  showScreen("home");
}

function startGame(category) {
  if (typeof allQuestions === "undefined") {
    alert("questions.js is not loading.");
    return;
  }
  
  categoryMistakes = {};

  if (category !== "mixed" && !allQuestions[category]) {
    alert("No questions found for: " + category);
    return;
  }

  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;

  let questionPool = [];

  if (category === "mixed") {
    questionPool = Object.values(allQuestions).flat();
  } else {
    questionPool = [...allQuestions[category]];
  }

  const questionCountValue =
    document.getElementById("question-count-select")?.value || "10";

  const shuffledPool = shuffleArray([...questionPool]);

  if (questionCountValue === "all") {
    currentQuestions = shuffledPool;
  } else {
    currentQuestions = shuffledPool.slice(0, Number(questionCountValue));
  }

  document.getElementById("game-title").textContent = formatCategoryName(category);
  document.getElementById("score-text").textContent = "Score: 0";

  showScreen("game");
  moveRaceCar();
  loadQuestion();
}

function loadQuestion() {
  const q = currentQuestions[currentQuestionIndex];
  if (!q) return;

  answered = false;

  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  const questionBox = document.getElementById("question-box");
  if (questionBox) questionBox.classList.remove("correct-glow", "wrong-shake");

  document.getElementById("question-text").textContent = q.question;

  const questionImage = document.getElementById("question-image");
  if (questionImage && q.image) {
    questionImage.src = q.image;
    questionImage.classList.remove("hidden");
  } else if (questionImage) {
    questionImage.classList.add("hidden");
  }

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

  if (readAloudOn) autoReadQuestion();
}

function toggleReadAloud() {
  readAloudOn = !readAloudOn;

  const btn = document.getElementById("read-toggle-btn");
  if (btn) {
    btn.textContent = readAloudOn ? "🔊 Read Aloud: ON" : "🔇 Read Aloud: OFF";
  }

  if (readAloudOn) {
    readQuestionAloud();
  } else if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function readQuestionAloud() {
  if (!("speechSynthesis" in window)) return;

  const questionText = document.getElementById("question-text");
  if (!questionText) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(questionText.textContent);
  speech.lang = "en-US";
  speech.rate = 0.82;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}

function autoReadQuestion() {
  if (!("speechSynthesis" in window)) return;

  const q = currentQuestions[currentQuestionIndex];
  if (!q) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(q.question);
  speech.lang = "en-US";
  speech.rate = 0.78;
  speech.pitch = 1;
  speech.volume = 1;

  setTimeout(() => {
    if (readAloudOn) window.speechSynthesis.speak(speech);
  }, 500);
}

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

function selectAnswer(selectedIndex, clickedButton) {
  if (answered) return;
  answered = true;

  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  const q = currentQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#answer-buttons button");
  const feedbackBox = document.getElementById("feedback-box");
  const questionBox = document.getElementById("question-box");

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === q.choices[q.correct]) btn.classList.add("correct");
  });

  if (selectedIndex === q.correct) {
    playSound("correct");
    score += 10;
    moveRaceCar();

    feedbackBox.className = "feedback-box correct-feedback";
    feedbackBox.textContent = "✅ Correct! " + q.explanation;

    if (questionBox) questionBox.classList.add("correct-glow");
  } else {
    playSound("wrong");

    if (clickedButton) clickedButton.classList.add("wrong");
    
    const questionKey = q.question;

if (!categoryMistakes[questionKey]) {
  categoryMistakes[questionKey] = 0;
}
categoryMistakes[questionKey]++;

    feedbackBox.className = "feedback-box wrong-feedback";
    feedbackBox.textContent = "❌ Not quite. " + q.explanation;

    if (questionBox) questionBox.classList.add("wrong-shake");

    if (currentCategory === "online") showAccessDenied(true);
  }

  document.getElementById("score-text").textContent = "Score: " + score;
  document.getElementById("next-btn").classList.remove("hidden");
}

function nextQuestion() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  currentQuestionIndex++;
  showAccessDenied(false);

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
  } else {
    loadQuestion();
  }
}

function finishGame() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  const maxScore = currentQuestions.length * 10;
  const percent = Math.round((score / maxScore) * 100);
  const perfect = score === maxScore;

  showScreen("results");

  document.getElementById("results-score").textContent =
    "Score: " + score + "/" + maxScore;

  document.getElementById("results-badge").textContent =
    "Badge: " + getBadge(percent);

  if (perfect) {
    document.getElementById("results-message").textContent =
      "🚗💨 PERFECT RUN! You made every right choice. That was awesome!";
  } else {
    document.getElementById("results-message").textContent =
      getResultsMessage(percent);
  }

  const streak = Number(localStorage.getItem("roxyStreak") || 0) + 1;
  localStorage.setItem("roxyStreak", streak);
  document.getElementById("results-streak").textContent =
    "Current Streak: " + streak;

  saveBestScore(currentCategory, score);
  launchConfetti();

  if (perfect) {
    celebrateRaceCar();
    setTimeout(() => launchConfetti(), 500);
    setTimeout(() => launchConfetti(), 1000);
  }
  let worstCategory = null;
let highestMistakes = 0;

for (let cat in categoryMistakes) {
  if (categoryMistakes[cat] > highestMistakes) {
    highestMistakes = categoryMistakes[cat];
    worstCategory = cat;
  }
}

if (worstCategory && highestMistakes > 0) {
  document.getElementById("results-message").textContent +=
    " Focus Area: Review this situation: " + worstCategory;
}
}

function restartCurrentGame() {
  if (currentCategory) startGame(currentCategory);
  else goHome();
}

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
    "mixed",
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
    if (!el) return;

    el.textContent =
      "Best Score: " + Number(localStorage.getItem("best-" + category) || 0);
  });
}

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
  if (!trackerData.categories) trackerData.categories = {};
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
  const good = trackerData.good || 0;
  const bad = trackerData.bad || 0;
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

  Object.keys(trackerData.categories || {}).forEach(category => {
    setText(category + "-good", "Good: " + trackerData.categories[category].good);
    setText(category + "-bad", "Needs Work: " + trackerData.categories[category].bad);
  });
  let focusArea = "--";
let mostNeeds = -1;

Object.keys(trackerData.categories || {}).forEach(category => {
  const badCount = trackerData.categories[category].bad || 0;

  if (badCount > mostNeeds) {
    mostNeeds = badCount;
    focusArea = formatCategoryName(category);
  }
});

setText("focus-area", focusArea);

let bestArea = "--";
let bestPercent = -1;

Object.keys(trackerData.categories || {}).forEach(category => {
  const goodCount = trackerData.categories[category].good || 0;
  const badCount = trackerData.categories[category].bad || 0;
  const total = goodCount + badCount;

  if (total > 0) {
    const areaPercent = goodCount / total;

    if (areaPercent > bestPercent) {
      bestPercent = areaPercent;
      bestArea = formatCategoryName(category);
    }
  }
});

setText("most-improved", bestArea);
}

function showAccessDenied(show) {
  const overlay = document.getElementById("access-denied-overlay");
  if (!overlay) return;

  if (show) {
    overlay.classList.remove("hidden");
    setTimeout(() => overlay.classList.add("hidden"), 4000);
  } else {
    overlay.classList.add("hidden");
  }
}

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
    drift: -1 + Math.random() * 2,
    color: ["#2f67ea", "#ffcc00", "#ff5f5f", "#42b883"][Math.floor(Math.random() * 4)]
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
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    if (elapsed < duration) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(draw);
}

function celebrateRaceCar() {
  const raceCar = document.getElementById("race-car");
  if (!raceCar) return;

  raceCar.classList.remove("car-celebrate");
  void raceCar.offsetWidth;
  raceCar.classList.add("car-celebrate");
}

function moveRaceCar() {
  const raceCar = document.getElementById("race-car");
  if (!raceCar) return;

  const maxScore = currentQuestions.length * 10;
  const percent = maxScore === 0 ? 0 : (score / maxScore) * 95;

  raceCar.style.left = percent + "%";
}

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
    mixed: "Mixed Practice",
    interrupting: "Interrupting",
    kindness: "Kindness",
    calm: "Calm Reactions",
    honesty: "Honesty",
    respect: "Respect",
    responsibility: "Responsibility",
    teasing: "Teasing",
    online: "Online Behavior",
    listening: "Listening",
    calmBody: "Calm Body"
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
  return new Date().toLocaleDateString();
}

function updateAnimationLabel() {
  const icon = document.getElementById("animation-icon");
  const label = document.getElementById("animation-label");
  if (!icon || !label) return;

  const map = {
    mixed: ["🎲", "Mixed practice."],
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

document.addEventListener("DOMContentLoaded", () => {
  updateBestScores();
  updateTrackerDisplay();
  goHome();
  console.log(APP_VERSION);
});

window.startGame = startGame;
window.showScreen = showScreen;
window.goHome = goHome;
window.nextQuestion = nextQuestion;
window.restartCurrentGame = restartCurrentGame;
window.addGoodChoice = addGoodChoice;
window.addNeedsWork = addNeedsWork;
window.addCategoryChoice = addCategoryChoice;
window.resetTracker = resetTracker;
window.toggleReadAloud = toggleReadAloud;
window.readQuestionAloud = readQuestionAloud;

let conversationData = [
  {
    title: "That's not fair!",
    start: "parent_start",
    steps: {
      parent_start: {
        player: "Player 1 - Parent",
        prompt: "Your child says: “That’s not fair!” What should the parent say?",
        choices: [
          {
            text: "Fair doesn’t always mean equal. Let’s talk about why this decision was made.",
            effect: 10,
            next: "kid_good_path",
            feedback: "Good response. It explains the rule without shutting the child down."
          },
          {
            text: "Life isn’t fair. Get over it.",
            effect: -15,
            next: "kid_escalated_path",
            feedback: "This may be true, but it sounds dismissive and usually makes the argument worse."
          },
          {
            text: "We’re not arguing about this.",
            effect: -5,
            next: "kid_shutdown_path",
            feedback: "This sets a boundary, but it does not help the child understand."
          }
        ]
      },

      kid_good_path: {
        player: "Player 2 - Kid",
        prompt: "Parent says: “Fair doesn’t always mean equal. Let’s talk about why this decision was made.” What should the kid say?",
        choices: [
          {
            text: "I don’t want to talk about it. It’s still not fair.",
            effect: -5,
            next: "parent_recover_1",
            feedback: "This is honest, but it keeps the argument going."
          },
          {
            text: "Okay… but I don’t get it.",
            effect: 10,
            next: "parent_teach_1",
            feedback: "Good response. It keeps the conversation open."
          },
          {
            text: "Then explain it.",
            effect: 5,
            next: "parent_teach_1",
            feedback: "This asks for an explanation, but tone matters."
          }
        ]
      },

      kid_escalated_path: {
        player: "Player 2 - Kid",
        prompt: "Parent says: “Life isn’t fair. Get over it.” What does the kid say?",
        choices: [
          {
            text: "You’re so unfair!",
            effect: -10,
            next: "parent_escalated_end",
            feedback: "That response throws gas on the fire."
          },
          {
            text: "I hate this!",
            effect: -10,
            next: "parent_escalated_end",
            feedback: "This shows big feelings, but it does not solve the problem."
          },
          {
            text: "Fine. Whatever.",
            effect: -5,
            next: "parent_shutdown_end",
            feedback: "This stops talking, but it does not fix the problem."
          }
        ]
      },

      kid_shutdown_path: {
        player: "Player 2 - Kid",
        prompt: "Parent says: “We’re not arguing about this.” What does the kid say?",
        choices: [
          {
            text: "You never listen!",
            effect: -10,
            next: "parent_recover_1",
            feedback: "This makes the parent feel attacked and can restart the fight."
          },
          {
            text: "Okay, but can you tell me why later?",
            effect: 10,
            next: "parent_teach_1",
            feedback: "Great response. It accepts the boundary but still asks to understand."
          },
          {
            text: "Whatever.",
            effect: -5,
            next: "parent_shutdown_end",
            feedback: "This ends the conversation cold. Not helpful, but common."
          }
        ]
      },

      parent_recover_1: {
        player: "Player 1 - Parent",
        prompt: "The conversation is getting tense. What should the parent say next?",
        choices: [
          {
            text: "I hear that you’re upset. I still want to explain it calmly.",
            effect: 10,
            next: "kid_final_choice",
            feedback: "Good recovery. This lowers the temperature."
          },
          {
            text: "Stop being dramatic.",
            effect: -15,
            next: "final_bad",
            feedback: "That dismisses feelings and usually makes things worse."
          },
          {
            text: "Go to your room.",
            effect: -10,
            next: "final_bad",
            feedback: "That may stop the conversation, but it does not teach the skill."
          }
        ]
      },

      parent_teach_1: {
        player: "Player 1 - Parent",
        prompt: "The kid is willing to listen. What should the parent say?",
        choices: [
          {
            text: "The rule is different because trust and responsibility are different right now.",
            effect: 10,
            next: "kid_final_choice",
            feedback: "Strong explanation. It connects the rule to behavior."
          },
          {
            text: "Because I’m the parent.",
            effect: -5,
            next: "kid_final_choice",
            feedback: "This may be true, but it does not teach much."
          },
          {
            text: "You already know why.",
            effect: -10,
            next: "final_bad",
            feedback: "This shuts down the chance to learn."
          }
        ]
      },

      kid_final_choice: {
        player: "Player 2 - Kid",
        prompt: "What should the kid say to finish the conversation better?",
        choices: [
          {
            text: "Okay. I still don’t like it, but I understand better.",
            effect: 15,
            next: "final_good",
            feedback: "Excellent. You can disagree and still be respectful."
          },
          {
            text: "Can I earn more trust back?",
            effect: 15,
            next: "final_good",
            feedback: "Excellent. This turns the problem into a goal."
          },
          {
            text: "This is still stupid.",
            effect: -10,
            next: "final_bad",
            feedback: "That keeps the argument alive."
          }
        ]
      },

      parent_escalated_end: {
        player: "Player 1 - Parent",
        prompt: "The kid is upset. What should the parent do now?",
        choices: [
          {
            text: "Let’s pause and talk when we are both calmer.",
            effect: 5,
            next: "final_neutral",
            feedback: "Good save. Sometimes pausing is the best move."
          },
          {
            text: "Keep talking like that and you lose more.",
            effect: -15,
            next: "final_bad",
            feedback: "That escalates the power struggle."
          },
          {
            text: "I’m done with this.",
            effect: -10,
            next: "final_bad",
            feedback: "This ends the conversation without repair."
          }
        ]
      },

      parent_shutdown_end: {
        player: "Player 1 - Parent",
        prompt: "The kid has shut down. What should the parent say?",
        choices: [
          {
            text: "We can take a break, but I want to talk about this later.",
            effect: 5,
            next: "final_neutral",
            feedback: "Good boundary. It gives space without ignoring the issue."
          },
          {
            text: "Fine. Don’t talk then.",
            effect: -10,
            next: "final_bad",
            feedback: "This creates distance instead of repair."
          },
          {
            text: "You need to learn to listen.",
            effect: -5,
            next: "final_bad",
            feedback: "It may be true, but it sounds like a lecture."
          }
        ]
      },

      final_good: {
        player: "Result",
        prompt: "💬 Productive conversation. Both people stayed respectful enough to understand each other.",
        choices: []
      },

      final_neutral: {
        player: "Result",
        prompt: "⚖️ Neutral ending. The conversation did not fully solve the issue, but it avoided a blow-up.",
        choices: []
      },

      final_bad: {
        player: "Result",
        prompt: "🔥 Escalated ending. The conversation became more about winning than understanding.",
        choices: []
      }
    }
  }
];
let currentScenario = null;
let currentStep = "";
let respectScore = 50;

function startConversationPractice() {
  showScreen("conversation");

  currentScenario = conversationData[0];
  currentStep = currentScenario.start;
  respectScore = 50;

  updateConversation();
}

function updateConversation() {
  const step = currentScenario.steps[currentStep];

  document.getElementById("scenarioTitle").innerText = currentScenario.title;
  document.getElementById("speakerBox").innerText = step.player;
  document.getElementById("conversationText").innerText = step.prompt;
  document.getElementById("respectMeter").innerText = respectScore;

  const choicesBox = document.getElementById("choicesBox");
  const feedbackBox = document.getElementById("feedbackBox");

  choicesBox.innerHTML = "";
  feedbackBox.innerText = "";

  if (!step.choices || step.choices.length === 0) {
    choicesBox.innerHTML =
      '<button class="primary-btn" onclick="startConversationPractice()">Try Again</button>';
    return;
  }

  step.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => chooseConversationAnswer(index);
    choicesBox.appendChild(btn);
  });
}

function chooseConversationAnswer(index) {
  const step = currentScenario.steps[currentStep];
  const choice = step.choices[index];

  respectScore += choice.effect;
  document.getElementById("respectMeter").innerText = respectScore;
  document.getElementById("feedbackBox").innerText = choice.feedback;

  currentStep = choice.next;

  setTimeout(updateConversation, 1800);
}

window.startConversationPractice = startConversationPractice;
window.chooseConversationAnswer = chooseConversationAnswer;

