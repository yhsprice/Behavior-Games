const gameData = {
  interrupting: {
    title: "Interrupting",
    subtitle: "Practice waiting, asking politely, and speaking at the right time.",
    questions: [
      {
        prompt: "Mom is talking to another adult and you want to tell her about your drawing.",
        choices: [
          "Talk over them right away",
          "Wait and then say, 'Excuse me'",
          "Keep saying 'Mom, Mom, Mom' louder"
        ],
        correct: 1,
        responses: [
          "Talking over people makes them feel ignored.",
          "Great job. Waiting and saying 'Excuse me' is respectful.",
          "Repeating it louder is still interrupting. Loud does not become polite by magic."
        ]
      },
      {
        prompt: "Your teacher is giving directions and you remember you forgot your pencil.",
        choices: [
          "Yell it across the room",
          "Raise your hand and wait",
          "Walk up and start talking"
        ],
        correct: 1,
        responses: [
          "Yelling stops everyone from listening.",
          "Nice work. Raising your hand shows self-control.",
          "Walking up and starting to talk can interrupt the whole class."
        ]
      },
      {
        prompt: "Someone is still speaking and you already know your answer.",
        choices: [
          "Cut them off before you forget",
          "Wait until they finish",
          "Answer for them"
        ],
        correct: 1,
        responses: [
          "Cutting people off feels rude to them.",
          "Correct. Waiting shows respect.",
          "Answering for them is not your job, captain chaos."
        ]
      }
    ]
  },
  meanWords: {
    title: "Kind vs Mean",
    subtitle: "Practice saying things in a kind and helpful way.",
    questions: [
      {
        prompt: "Your friend shows you a picture they drew and you do not like it.",
        choices: [
          "Say, 'That's ugly'",
          "Say, 'I like the colors'",
          "Laugh at it"
        ],
        correct: 1,
        responses: [
          "That hurts feelings.",
          "Good choice. Kind words help people feel safe.",
          "Laughing at someone can feel mean, even if you think it's funny."
        ]
      },
      {
        prompt: "Someone makes a small mistake during a game.",
        choices: [
          "Call them stupid",
          "Say, 'That's okay, try again'",
          "Tell everyone they messed up"
        ],
        correct: 1,
        responses: [
          "Name-calling is mean and not okay.",
          "Exactly. Encouragement helps more than insults.",
          "Embarrassing someone on purpose is not kind."
        ]
      },
      {
        prompt: "You feel annoyed with your sister.",
        choices: [
          "Use a mean nickname",
          "Say, 'I need space right now'",
          "Say the meanest thing you can think of"
        ],
        correct: 1,
        responses: [
          "Mean nicknames stick around longer than people think.",
          "Perfect. Honest and calm beats cruel every time.",
          "That may feel powerful for two seconds and ugly for much longer."
        ]
      }
    ]
  },
  seriousMoments: {
    title: "Joking vs Serious",
    subtitle: "Practice knowing when it is time to joke and when it is time to be serious.",
    questions: [
      {
        prompt: "Someone is crying because they got bad news.",
        choices: [
          "Make a joke to be funny",
          "Stay calm and ask if they are okay",
          "Laugh because crying looks silly"
        ],
        correct: 1,
        responses: [
          "Jokes can hurt when someone is upset.",
          "Yes. This is the right time to be gentle, not goofy.",
          "Laughing at pain is not funny. It just feels mean."
        ]
      },
      {
        prompt: "The teacher is explaining a safety rule.",
        choices: [
          "Crack a joke so people laugh",
          "Listen quietly",
          "Make silly noises"
        ],
        correct: 1,
        responses: [
          "Wrong time. Safety rules matter.",
          "Right. Serious information needs serious listening.",
          "Silly noises are not a personality. They're just annoying here."
        ]
      },
      {
        prompt: "Everyone is happily playing at recess.",
        choices: [
          "Tell one silly joke",
          "Act upset for no reason",
          "Yell a rude joke at someone"
        ],
        correct: 0,
        responses: [
          "Correct. This is a fine time for playful joking.",
          "That would confuse people and ruin the fun.",
          "A rude joke can turn a fun moment into a fight fast."
        ]
      }
    ]
  },
  thinkSay: {
    title: "Think It or Say It",
    subtitle: "Practice using a brain filter before speaking.",
    questions: [
      {
        prompt: "You think, 'That shirt looks weird.'",
        choices: [
          "Say it out loud",
          "Keep it in your brain",
          "Say it louder so everyone hears"
        ],
        correct: 1,
        responses: [
          "Not every thought should become a sentence.",
          "Exactly. Some thoughts stay private.",
          "Making it louder just makes it meaner."
        ]
      },
      {
        prompt: "You are angry and want to say something hurtful.",
        choices: [
          "Say it right away",
          "Pause and choose better words",
          "Text it to someone else"
        ],
        correct: 1,
        responses: [
          "Fast words can do slow damage.",
          "Good job. Pausing gives your brain a chance to help.",
          "Sending mean words through a screen is still mean."
        ]
      },
      {
        prompt: "You notice someone spilled on their shirt.",
        choices: [
          "Point and laugh",
          "Quietly tell them if they need to know",
          "Announce it to the whole room"
        ],
        correct: 1,
        responses: [
          "That embarrasses them.",
          "Correct. Quiet and kind is the way to go.",
          "No need to turn a tiny problem into a stage performance."
        ]
      }
    ]
  },
  reactions: {
    title: "Pause Button",
    subtitle: "Practice calm reactions when something goes wrong.",
    questions: [
      {
        prompt: "Someone bumps into you by accident.",
        choices: [
          "Push them back",
          "Say, 'Please be careful'",
          "Yell at them"
        ],
        correct: 1,
        responses: [
          "Pushing turns accidents into bigger problems.",
          "Right. Calm words work better than angry actions.",
          "Yelling makes the moment bigger, not better."
        ]
      },
      {
        prompt: "You lose a game.",
        choices: [
          "Throw something",
          "Take a breath and try again later",
          "Blame everyone else"
        ],
        correct: 1,
        responses: [
          "Throwing things is not safe.",
          "Strong choice. Big feelings need a calm plan.",
          "Blaming people does not fix the feeling."
        ]
      },
      {
        prompt: "You are told 'no' after asking for something.",
        choices: [
          "Scream",
          "Ask once why, then accept it",
          "Keep arguing until everyone is tired"
        ],
        correct: 1,
        responses: [
          "Screaming does not turn no into yes.",
          "Exactly. Asking calmly once is okay.",
          "Wearing people down is not the same as being right."
        ]
      }
    ]
  }
};

const categoryGrid = document.getElementById("categoryGrid");
const gamePanel = document.getElementById("gamePanel");
const gameTitle = document.getElementById("gameTitle");
const gameSubtitle = document.getElementById("gameSubtitle");
const questionText = document.getElementById("questionText");
const choicesWrap = document.getElementById("choices");
const feedbackBox = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const questionCount = document.getElementById("questionCount");

let currentCategory = null;
let currentQuestionIndex = 0;
let answered = false;

function renderCategories() {
  categoryGrid.innerHTML = "";
  Object.entries(gameData).forEach(([key, value]) => {
    const card = document.createElement("button");
    card.className = "category-card";
    card.innerHTML = `
      <h3>${value.title}</h3>
      <p>${value.subtitle}</p>
      <span class="badge">${value.questions.length} questions</span>
    `;
    card.addEventListener("click", () => startGame(key));
    categoryGrid.appendChild(card);
  });
}

function startGame(categoryKey) {
  currentCategory = gameData[categoryKey];
  currentQuestionIndex = 0;
  gameTitle.textContent = currentCategory.title;
  gameSubtitle.textContent = currentCategory.subtitle;
  gamePanel.classList.remove("hidden");
  document.getElementById("gamePanel").scrollIntoView({ behavior: "smooth" });
  renderQuestion();
}

function renderQuestion() {
  const q = currentCategory.questions[currentQuestionIndex];
  answered = false;
  questionText.textContent = q.prompt;
  feedbackBox.textContent = "";
  feedbackBox.classList.add("hidden");
  nextBtn.classList.add("hidden");
  questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${currentCategory.questions.length}`;

  choicesWrap.innerHTML = "";
  q.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.addEventListener("click", () => chooseAnswer(index));
    choicesWrap.appendChild(btn);
  });
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;

  const q = currentCategory.questions[currentQuestionIndex];
  const buttons = Array.from(document.querySelectorAll(".choice-btn"));

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    if (i === index && i !== q.correct) btn.classList.add("wrong");
  });

  feedbackBox.textContent = q.responses[index];
  feedbackBox.classList.remove("hidden");

  if (currentQuestionIndex < currentCategory.questions.length - 1) {
    nextBtn.classList.remove("hidden");
  } else {
    nextBtn.textContent = "Finish";
    nextBtn.classList.remove("hidden");
  }
}

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < currentCategory.questions.length - 1) {
    currentQuestionIndex += 1;
    nextBtn.textContent = "Next";
    renderQuestion();
  } else {
    feedbackBox.textContent = "Nice work. You finished this category. Go try another one or log a good choice below.";
    feedbackBox.classList.remove("hidden");
    nextBtn.classList.add("hidden");
  }
});

backToMenuBtn.addEventListener("click", () => {
  gamePanel.classList.add("hidden");
  document.getElementById("games").scrollIntoView({ behavior: "smooth" });
});

const STORAGE_KEY = "choiceQuestWeeklyTracker";
const WEEKLY_GOAL = 100;

const scoreValue = document.getElementById("scoreValue");
const scoreLevel = document.getElementById("scoreLevel");
const meterFill = document.getElementById("meterFill");
const meterPercent = document.getElementById("meterPercent");
const logList = document.getElementById("logList");
const customNote = document.getElementById("customNote");
const customPoints = document.getElementById("customPoints");
const addCustomBtn = document.getElementById("addCustomBtn");
const resetWeekBtn = document.getElementById("resetWeekBtn");
const exportBtn = document.getElementById("exportBtn");

function getTrackerData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return { score: 0, logs: [] };
}

function saveTrackerData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getLevel(score) {
  if (score >= 100) return "Rock Star";
  if (score >= 70) return "Strong Week";
  if (score >= 40) return "Getting Better";
  if (score >= 15) return "Trying Hard";
  return "Starter";
}

function renderTracker() {
  const data = getTrackerData();
  const percent = Math.max(0, Math.min(100, Math.round((data.score / WEEKLY_GOAL) * 100)));

  scoreValue.textContent = data.score;
  scoreLevel.textContent = getLevel(data.score);
  meterFill.style.width = `${percent}%`;
  meterPercent.textContent = `${percent}%`;

  logList.innerHTML = "";
  if (!data.logs.length) {
    const empty = document.createElement("li");
    empty.className = "log-item";
    empty.innerHTML = `<div><strong>No entries yet.</strong><div class="log-meta">Start logging wins and rough moments for the week.</div></div>`;
    logList.appendChild(empty);
    return;
  }

  data.logs.slice().reverse().forEach((entry) => {
    const item = document.createElement("li");
    item.className = "log-item";
    const pointClass = entry.points >= 0 ? "plus" : "minus";
    const pointLabel = entry.points >= 0 ? `+${entry.points}` : `${entry.points}`;
    item.innerHTML = `
      <div>
        <strong>${entry.label}</strong>
        <div class="log-meta">${entry.time}</div>
      </div>
      <div class="log-points ${pointClass}">${pointLabel} pts</div>
    `;
    logList.appendChild(item);
  });
}

function addLog(label, points) {
  const data = getTrackerData();
  data.score += points;
  data.logs.push({
    label,
    points,
    time: new Date().toLocaleString()
  });
  saveTrackerData(data);
  renderTracker();
}

Array.from(document.querySelectorAll("[data-points]")).forEach((btn) => {
  btn.addEventListener("click", () => {
    addLog(btn.dataset.label, Number(btn.dataset.points));
  });
});

addCustomBtn.addEventListener("click", () => {
  const note = customNote.value.trim();
  const pts = Number(customPoints.value);
  if (!note) {
    alert("Please add a note first.");
    return;
  }
  if (Number.isNaN(pts)) {
    alert("Please enter a valid point amount.");
    return;
  }
  addLog(note, pts);
  customNote.value = "";
  customPoints.value = 5;
});

resetWeekBtn.addEventListener("click", () => {
  const okay = confirm("Reset this week's points and log?");
  if (!okay) return;
  saveTrackerData({ score: 0, logs: [] });
  renderTracker();
});

exportBtn.addEventListener("click", () => {
  const data = getTrackerData();
  const lines = [
    `Weekly Score: ${data.score}`,
    `Level: ${getLevel(data.score)}`,
    "",
    "Log:"
  ];
  data.logs.forEach((entry) => {
    lines.push(`${entry.time} | ${entry.label} | ${entry.points >= 0 ? "+" : ""}${entry.points}`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "weekly-goal-log.txt";
  a.click();
  URL.revokeObjectURL(url);
});

renderCategories();
renderTracker();
