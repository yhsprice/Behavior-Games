const APP_VERSION = "FINAL-STABLE";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let gameFinished = false;

let confettiAnimationId = null;

// ---------------- SOUND ----------------

function playSound(type) {
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
}

// ---------------- SCREEN CONTROL ----------------

function hideAllScreens() {
  ["home-screen", "game-screen", "results-screen"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

function showScreen(screen) {
  hideAllScreens();
  document.getElementById(screen + "-screen").classList.remove("hidden");
}

function goHome() {
  showScreen("home");
}

// ---------------- GAME START ----------------

function startGame(category) {
  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  gameFinished = false;

  currentQuestions = shuffleArray([...allQuestions[category]]).slice(0, 10);

  showScreen("game");

  document.getElementById("score-text").textContent = "Score: 0";

  loadQuestion();
}

// ---------------- LOAD QUESTION ----------------

function loadQuestion() {
  const q = currentQuestions[currentQuestionIndex];

  answered = false;

  document.getElementById("question-text").textContent = q.question;
  const answerButtons = document.getElementById("answer-buttons");
  answerButtons.innerHTML = "";

  const shuffled = shuffleArray(q.choices.map((c, i) => ({
    text: c,
    index: i
  })));

  shuffled.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => selectAnswer(choice.index);
    answerButtons.appendChild(btn);
  });

  document.getElementById("feedback-box").textContent = "";
  document.getElementById("next-btn").classList.add("hidden");
}

// ---------------- SELECT ANSWER ----------------

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = currentQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#answer-buttons button");
  const feedbackBox = document.getElementById("feedback-box");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
  });

  if (index === q.correct) {
    playSound("correct");
    score += 10;

    feedbackBox.className = "feedback-box correct-feedback";
    feedbackBox.textContent = "✅ Correct! " + q.explanation;

    document.getElementById("question-box").classList.add("correct-glow");
  } else {
    playSound("wrong");

    feedbackBox.className = "feedback-box wrong-feedback";
    feedbackBox.textContent = "❌ Not quite. " + q.explanation;

    document.getElementById("question-box").classList.add("wrong-shake");
  }

  document.getElementById("score-text").textContent = "Score: " + score;

  document.getElementById("next-btn").classList.remove("hidden");
}

// ---------------- NEXT QUESTION ----------------

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
  } else {
    document.getElementById("question-box").classList.remove("correct-glow", "wrong-shake");
    loadQuestion();
  }
}

// ---------------- FINISH GAME ----------------

function finishGame() {
  showScreen("results");

  document.getElementById("results-score").textContent =
    "Score: " + score + "/" + (currentQuestions.length * 10);

  launchConfetti();
}

// ---------------- CONFETTI ----------------

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: 6 + Math.random() * 6,
    speed: 1 + Math.random() * 2,
    color: ["#2f67ea", "#ffcc00", "#ff5f5f", "#42b883"][Math.floor(Math.random() * 4)]
  }));

  const duration = 5000;
  const start = performance.now();

  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.y += p.speed;
      if (p.y > canvas.height) p.y = -10;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    if (elapsed < duration) {
      requestAnimationFrame(draw);
    }
  }

  requestAnimationFrame(draw);
}

// ---------------- UTILS ----------------

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ---------------- INIT ----------------

goHome();
console.log(APP_VERSION);
