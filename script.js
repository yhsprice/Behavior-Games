const APP_VERSION = "10";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let gameLength = 10;
let gameFinished = false;

let audioCtx = null;

// -------------------- SCREEN CONTROL --------------------

function hideAllScreens() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("tracker-screen").classList.add("hidden");
}

function showScreen(screen) {
  hideAllScreens();

  if (screen === "game") {
    document.getElementById("home-screen").classList.remove("hidden");
  } else if (screen === "tracker") {
    document.getElementById("tracker-screen").classList.remove("hidden");
  }
}

function goHome() {
  hideAllScreens();
  document.getElementById("home-screen").classList.remove("hidden");
}

// -------------------- GAME --------------------

function startGame(category) {
  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  gameFinished = false;

  const source = Array.isArray(allQuestions[category]) ? allQuestions[category] : [];
  currentQuestions = shuffleArray([...source]).slice(0, gameLength);

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
  document.getElementById("feedback-box").textContent = "";
  document.getElementById("restart-btn").classList.add("hidden");
  document.getElementById("next-btn").classList.add("hidden");

  loadQuestion();
}

function loadQuestion() {
  if (gameFinished) return;

  answered = false;

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
    return;
  }

  const q = currentQuestions[currentQuestionIndex];

  document.getElementById("question-text").textContent = q.question;
  document.getElementById("feedback-box").textContent = "";
  document.getElementById("next-btn").classList.add("hidden");

  const container = document.getElementById("answer-buttons");
  container.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(i);
    container.appendChild(btn);
  });

  updateProgress();
  updateBadge();
}

function selectAnswer(selectedIndex) {
  if (answered || gameFinished) return;

  answered = true;

  const q = currentQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#answer-buttons button");
  const feedback = document.getElementById("feedback-box");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.add("disabled");

    if (i === q.correct) btn.classList.add("correct");
    if (i === selectedIndex && i !== q.correct) btn.classList.add("wrong");
  });

  if (selectedIndex === q.correct) {
    score += 10;
    feedback.textContent = "✅ Correct! " + q.explanation;
    playCorrectSound();
  } else {
    feedback.textContent = "❌ Not quite. " + q.explanation;
    playWrongSound();
  }

  document.getElementById("score-text").textContent = "Score: " + score;
  updateBadge();

  if (currentQuestionIndex === currentQuestions.length - 1) {
    finishGame();
  } else {
    document.getElementById("next-btn").classList.remove("hidden");
  }
}

function nextQuestion() {
  if (gameFinished) return;

  currentQuestionIndex += 1;

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
    return;
  }

  loadQuestion();
}

function finishGame() {
  if (gameFinished) return;

  gameFinished = true;

  const total = currentQuestions.length * 10;
  const feedback = document.getElementById("feedback-box");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");

  nextBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");

  let message = " Game finished! Final score: " + score + "/" + total + ".";

  if (score === total) {
    message += " Perfect score!";
    launchConfetti();
    playWinSound();
  } else if (score >= total * 0.8) {
    message += " Strong job.";
  } else if (score >= total * 0.5) {
    message += " Keep practicing.";
  } else {
    message += " More practice will help.";
  }

  if (feedback.textContent.trim()) {
    feedback.textContent += message;
  } else {
    feedback.textContent = message.trim();
  }
}

function restartCurrentGame() {
  startGame(currentCategory);
}

function updateProgress() {
  const total = currentQuestions.length || gameLength;
  const current = Math.min(currentQuestionIndex + 1, total);
  const percent = total ? (current / total) * 100 : 0;

  document.getElementById("game-progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").textContent = "Question " + current + " of " + total;
}

function updateBadge() {
  const total = currentQuestions.length * 10;
  const percent = total ? (score / total) * 100 : 0;

  let badge = "Starting Out";
  if (percent === 100) badge = "Choice Champion";
  else if (percent >= 80) badge = "Strong Thinker";
  else if (percent >= 60) badge = "Good Judgment";
  else if (percent >= 40) badge = "Getting There";

  document.getElementById("badge-text").textContent = "Badge: " + badge;
}

// -------------------- SOUND --------------------

function getAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration, type = "sine", volume = 0.07) {
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

function playCorrectSound() {
  playTone(700, 0.12, "sine", 0.06);
  setTimeout(() => playTone(900, 0.14, "sine", 0.05), 80);
}

function playWrongSound() {
  playTone(240, 0.18, "square", 0.04);
}

function playWinSound() {
  playTone(600, 0.12, "triangle", 0.05);
  setTimeout(() => playTone(800, 0.12, "triangle", 0.05), 120);
  setTimeout(() => playTone(1000, 0.18, "triangle", 0.05), 240);
}

// -------------------- CONFETTI --------------------

let confettiPieces = [];
let confettiAnimating = false;

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#2f67ea", "#ffcc00", "#ff5f5f", "#4ecdc4", "#8a5cff", "#42b883"];

  confettiPieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: Math.random() * 8 + 4,
    speedY: Math.random() * 3 + 2,
    speedX: Math.random() * 2 - 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360
  }));

  confettiAnimating = true;

  function animate() {
    if (!confettiAnimating) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += 5;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();

  setTimeout(() => {
    confettiAnimating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 3000);
}

window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// -------------------- UTIL --------------------

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// -------------------- INIT --------------------

console.log("Choice Quest script version", APP_VERSION);

hideAllScreens();
document.getElementById("home-screen").classList.remove("hidden");
