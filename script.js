let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let gameLength = 10;
let gameFinished = false;

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
  score = 0;
  currentQuestionIndex = 0;
  gameFinished = false;

  currentQuestions = shuffleArray([...allQuestions[category]]).slice(0, gameLength);

  hideAllScreens();
  document.getElementById("game-screen").classList.remove("hidden");

  loadQuestion();
}

function loadQuestion() {
  if (gameFinished) return;

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
}

function selectAnswer(i) {
  if (answered || gameFinished) return;
  answered = true;

  const q = currentQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#answer-buttons button");

  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === q.correct) btn.classList.add("correct");
    if (index === i && i !== q.correct) btn.classList.add("wrong");
  });

  if (i === q.correct) {
    score += 10;
    document.getElementById("feedback-box").textContent = "✅ Correct! " + q.explanation;
    playCorrectSound();
  } else {
    document.getElementById("feedback-box").textContent = "❌ Not quite. " + q.explanation;
    playWrongSound();
  }

  document.getElementById("score-text").textContent = "Score: " + score;

  if (currentQuestionIndex >= currentQuestions.length - 1) {
    finishGame();
  } else {
    document.getElementById("next-btn").classList.remove("hidden");
  }
}

function nextQuestion() {
  answered = false;
  currentQuestionIndex++;
  loadQuestion();
}

function finishGame() {
  gameFinished = true;

  const total = currentQuestions.length * 10;
  const box = document.getElementById("feedback-box");

  box.textContent += ` Game finished! Final score: ${score}/${total}.`;

  if (score === total) {
    box.textContent += " Perfect score!";
    launchConfetti();
    playWinSound();
  }

  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("restart-btn").classList.remove("hidden");
}

function restartCurrentGame() {
  startGame(currentCategory);
}

// -------------------- SOUND --------------------

let audioCtx;

function getAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, time) {
  const ctx = getAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time);
  osc.stop(ctx.currentTime + time);
}

function playCorrectSound() {
  playTone(700, 0.15);
  setTimeout(() => playTone(900, 0.15), 100);
}

function playWrongSound() {
  playTone(250, 0.2);
}

function playWinSound() {
  playTone(600, 0.15);
  setTimeout(() => playTone(800, 0.15), 150);
  setTimeout(() => playTone(1000, 0.2), 300);
}

// -------------------- CONFETTI --------------------

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 6 + 4,
    speed: Math.random() * 3 + 2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      ctx.fillStyle = "blue";
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.speed;
      if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// -------------------- UTIL --------------------

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// -------------------- INIT --------------------

hideAllScreens();
document.getElementById("home-screen").classList.remove("hidden");
