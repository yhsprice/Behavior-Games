const APP_VERSION = "FINAL-CLEAN-V2";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function startGame(category) {
  if (typeof allQuestions === "undefined" || (!allQuestions[category] && category !== "mixed")) {
    alert("Questions not loading correctly.");
    return;
  }

  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;

  let pool = category === "mixed"
    ? Object.values(allQuestions).flat()
    : [...allQuestions[category]];

  const questionCountValue = document.getElementById("question-count-select")?.value || "10";
  const count = questionCountValue === "all" ? pool.length : Number(questionCountValue);

  const recentKey = "recentQuestions_" + category;
  const recentQuestions = JSON.parse(localStorage.getItem(recentKey) || "[]");

  let freshQuestions = pool.filter(q => !recentQuestions.includes(q.question));
  if (freshQuestions.length < count) freshQuestions = pool;

  currentQuestions = shuffle([...freshQuestions]).slice(0, count);

  const newRecent = [...recentQuestions, ...currentQuestions.map(q => q.question)];
  localStorage.setItem(recentKey, JSON.stringify(newRecent.slice(-30)));

  document.getElementById("game-title").textContent = formatCategoryName(category);
  document.getElementById("score-text").textContent = "Score: 0";

  showScreen("game");
  loadQuestion();
}

function loadQuestion() {
  const q = currentQuestions[currentQuestionIndex];
  if (!q) return;

  answered = false;

  document.getElementById("question-text").textContent = q.question;

  const answerBox = document.getElementById("answer-buttons");
  answerBox.innerHTML = "";

  const shuffledChoices = q.choices
    .map((choice, index) => ({ choice, index }))
    .sort(() => Math.random() - 0.5);

  shuffledChoices.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.choice;
    btn.onclick = () => selectAnswer(item.index, btn);
    answerBox.appendChild(btn);
  });

  document.getElementById("feedback-box").textContent = "";
  document.getElementById("next-btn").classList.add("hidden");
}

function selectAnswer(index, btn) {
  if (answered) return;
  answered = true;

  const q = currentQuestions[currentQuestionIndex];

  document.querySelectorAll("#answer-buttons button").forEach(b => {
    b.disabled = true;
  });

  if (index === q.correct) {
    score += 10;
    btn.classList.add("correct");
    document.getElementById("feedback-box").textContent = "✅ " + q.explanation;
  } else {
    btn.classList.add("wrong");
    document.getElementById("feedback-box").textContent = "❌ " + q.explanation;
  }

  document.getElementById("score-text").textContent = "Score: " + score;
  document.getElementById("next-btn").classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= currentQuestions.length) {
    finishGame();
  } else {
    loadQuestion();
  }
}

function finishGame() {
  showScreen("results");

  document.getElementById("results-score").textContent =
    "Score: " + score + "/" + (currentQuestions.length * 10);
}

function restartCurrentGame() {
  if (currentCategory) startGame(currentCategory);
  else goHome();
}

function showScreen(name) {
  const screens = [
    "home-screen",
    "game-screen",
    "results-screen",
    "tracker-screen",
    "conversation-screen"
  ];

  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(name + "-screen");
  if (target) target.classList.remove("hidden");
}

function goHome() {
  showScreen("home");
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function formatCategoryName(cat) {
  const map = {
    beginner: "Beginner",
    advanced: "Advanced",
    mixed: "Mixed Practice"
  };
  return map[cat] || cat;
}

/* Prevent buttons from breaking if these features are not active */
function toggleReadAloud() {}
function readQuestionAloud() {}
function addGoodChoice() {}
function addNeedsWork() {}
function resetTracker() {}
function addCategoryChoice() {}

/* Conversation Practice - Long Learning Version */

let currentConversation = null;
let currentStep = "";
let respectScore = 50;
let conversationHistory = [];

const conversationTopics = [
  {
    title: "That’s not fair!",
    role: "child",
    start: "parent_start",
    steps: {
      parent_start: {
        speaker: "Player 1 - Parent",
        text: "Your child says: “That’s not fair!” What should the parent say?",
        choices: [
          {
            text: "Fair doesn’t always mean equal. Let’s talk about why this decision was made.",
            next: "child_reply",
            effect: 10,
            feedback: "Good choice. This keeps the boundary but also explains the reason. Kids may not like the answer, but explanations help them learn instead of just feeling shut down."
          },
          {
            text: "Life isn’t fair. Get over it.",
            next: "child_upset",
            effect: -15,
            feedback: "This usually makes things worse. It may be true, but it sounds dismissive and teaches frustration instead of understanding."
          },
          {
            text: "Stop arguing with me.",
            next: "child_shutdown",
            effect: -10,
            feedback: "This may stop the conversation for a second, but it does not teach the child how to handle disappointment."
          }
        ]
      },

      child_reply: {
        speaker: "Player 2 - Child",
        text: "Parent explained calmly. What should the child say?",
        choices: [
          {
            text: "I still don’t like it, but can you explain why?",
            next: "parent_teach",
            effect: 10,
            feedback: "Excellent. This shows respectful disagreement. You do not have to like the answer to talk about it respectfully."
          },
          {
            text: "That’s stupid.",
            next: "parent_recover",
            effect: -10,
            feedback: "This keeps the fight going. It attacks the rule instead of asking to understand it."
          },
          {
            text: "Whatever.",
            next: "parent_shutdown_response",
            effect: -5,
            feedback: "This avoids the conversation. It may feel easier, but nothing gets solved."
          }
        ]
      },

      child_upset: {
        speaker: "Player 2 - Child",
        text: "Parent said: “Life isn’t fair. Get over it.” What does the child say?",
        choices: [
          {
            text: "You’re so unfair!",
            next: "parent_recover",
            effect: -10,
            feedback: "This escalates the argument. Big feelings are real, but yelling usually makes the other person stop listening."
          },
          {
            text: "Can we talk about it without being mean?",
            next: "parent_teach",
            effect: 10,
            feedback: "Great recovery. This calls out the problem without attacking."
          },
          {
            text: "Fine. I’m done talking.",
            next: "parent_shutdown_response",
            effect: -5,
            feedback: "This stops the conversation, but it also stops learning."
          }
        ]
      },

      child_shutdown: {
        speaker: "Player 2 - Child",
        text: "Parent says: “Stop arguing with me.” What should the child say?",
        choices: [
          {
            text: "Okay, but can we talk about it later?",
            next: "parent_teach",
            effect: 10,
            feedback: "Good choice. This respects the parent’s boundary while keeping communication open."
          },
          {
            text: "You never listen!",
            next: "parent_recover",
            effect: -10,
            feedback: "This may be how the child feels, but saying 'you never' usually makes the parent defensive."
          },
          {
            text: "Whatever.",
            next: "parent_shutdown_response",
            effect: -5,
            feedback: "This shuts down instead of solving the issue."
          }
        ]
      },

      parent_teach: {
        speaker: "Player 1 - Parent",
        text: "The child is willing to listen. What should the parent say next?",
        choices: [
          {
            text: "The rule is different because trust and responsibility are different right now.",
            next: "child_final",
            effect: 10,
            feedback: "Strong response. This connects the rule to behavior instead of making it feel random."
          },
          {
            text: "Because I’m the parent.",
            next: "child_final",
            effect: -5,
            feedback: "This may be true, but it does not teach much. It can make the child feel powerless."
          },
          {
            text: "You already know why.",
            next: "final_bad",
            effect: -10,
            feedback: "This shuts down the learning moment."
          }
        ]
      },

      parent_recover: {
        speaker: "Player 1 - Parent",
        text: "The conversation is getting tense. What should the parent say?",
        choices: [
          {
            text: "I hear that you’re upset. Let’s slow down and talk respectfully.",
            next: "child_final",
            effect: 10,
            feedback: "Good recovery. The parent stays calm and models the behavior they want to see."
          },
          {
            text: "Stop being dramatic.",
            next: "final_bad",
            effect: -15,
            feedback: "This dismisses feelings and usually makes the child feel unheard."
          },
          {
            text: "Go to your room.",
            next: "final_neutral",
            effect: -5,
            feedback: "This may create space, but it does not teach conversation skills unless you come back to it later."
          }
        ]
      },

      parent_shutdown_response: {
        speaker: "Player 1 - Parent",
        text: "The child is shutting down. What should the parent say?",
        choices: [
          {
            text: "We can take a break, but I want to talk about this later.",
            next: "final_neutral",
            effect: 5,
            feedback: "Good boundary. It gives space without ignoring the issue."
          },
          {
            text: "Fine. Don’t talk then.",
            next: "final_bad",
            effect: -10,
            feedback: "This creates distance and teaches avoidance."
          },
          {
            text: "You need to learn to listen.",
            next: "final_bad",
            effect: -5,
            feedback: "This sounds like a lecture. It may be true, but timing matters."
          }
        ]
      },

      child_final: {
        speaker: "Player 2 - Child",
        text: "How should the child finish the conversation?",
        choices: [
          {
            text: "Okay. I still don’t like it, but I understand better.",
            next: "final_good",
            effect: 15,
            feedback: "Excellent. This shows maturity. You can dislike a rule and still respond respectfully."
          },
          {
            text: "Can I earn trust back?",
            next: "final_good",
            effect: 15,
            feedback: "Excellent. This turns the problem into a goal."
          },
          {
            text: "This is still stupid.",
            next: "final_bad",
            effect: -10,
            feedback: "This keeps the argument alive and makes it harder to earn trust."
          }
        ]
      },

      final_good: {
        speaker: "Result",
        text: "💬 Productive conversation. Both people stayed respectful enough to learn from each other.",
        choices: []
      },
      final_neutral: {
        speaker: "Result",
        text: "⚖️ Neutral ending. The conversation did not fully solve the issue, but it avoided a blow-up.",
        choices: []
      },
      final_bad: {
        speaker: "Result",
        text: "🔥 Escalated ending. The conversation became more about winning than understanding.",
        choices: []
      }
    }
  },

  {
    title: "Go clean your room",
    role: "parent",
    start: "parent_start",
    steps: {
      parent_start: {
        speaker: "Player 1 - Parent",
        text: "Parent wants the child to clean their room. What should the parent say?",
        choices: [
          {
            text: "Please clean your room before dinner.",
            next: "child_reply",
            effect: 10,
            feedback: "Good choice. It is clear, respectful, and gives a time frame."
          },
          {
            text: "Go clean your room right now!",
            next: "child_pushback",
            effect: -5,
            feedback: "This is clear, but the harsh tone may create resistance."
          },
          {
            text: "Your room is disgusting. Go fix it.",
            next: "child_upset",
            effect: -15,
            feedback: "This attacks the child instead of the behavior. Shame usually creates defensiveness."
          }
        ]
      },

      child_reply: {
        speaker: "Player 2 - Child",
        text: "Parent gave a calm instruction. What should the child say?",
        choices: [
          {
            text: "Okay. I’ll do it.",
            next: "final_good",
            effect: 15,
            feedback: "Great response. It accepts responsibility without arguing."
          },
          {
            text: "Do I have to?",
            next: "parent_follow",
            effect: -5,
            feedback: "This is mild pushback. It is not terrible, but it delays responsibility."
          },
          {
            text: "I’ll do it later.",
            next: "parent_follow",
            effect: -5,
            feedback: "This avoids the task. Later often turns into never."
          }
        ]
      },

      child_pushback: {
        speaker: "Player 2 - Child",
        text: "Parent sounded frustrated. What should the child say?",
        choices: [
          {
            text: "Okay, I’ll do it.",
            next: "final_good",
            effect: 10,
            feedback: "Good choice. Even if the tone was annoying, the child still handled the responsibility."
          },
          {
            text: "Stop yelling at me!",
            next: "parent_recover",
            effect: -10,
            feedback: "This may be how the child feels, but it can turn the focus into arguing about tone."
          },
          {
            text: "No.",
            next: "parent_recover",
            effect: -15,
            feedback: "This starts a power struggle."
          }
        ]
      },

      child_upset: {
        speaker: "Player 2 - Child",
        text: "Parent insulted the room. What should the child say?",
        choices: [
          {
            text: "I don’t like how you said that, but I’ll clean it.",
            next: "parent_repair",
            effect: 10,
            feedback: "Excellent. This accepts responsibility while still expressing feelings respectfully."
          },
          {
            text: "You’re mean!",
            next: "parent_recover",
            effect: -10,
            feedback: "This attacks back and makes the conflict bigger."
          },
          {
            text: "Fine, whatever.",
            next: "parent_shutdown",
            effect: -5,
            feedback: "This may get the task done, but it leaves resentment."
          }
        ]
      },

      parent_follow: {
        speaker: "Player 1 - Parent",
        text: "The child is delaying. What should the parent say?",
        choices: [
          {
            text: "Yes. Clean it first, then you can take a break.",
            next: "child_final",
            effect: 10,
            feedback: "Good. It keeps the expectation clear and gives a reasonable next step."
          },
          {
            text: "Because I said so.",
            next: "child_final",
            effect: -5,
            feedback: "This may get obedience, but it does not teach responsibility."
          },
          {
            text: "If you don’t do it, you lose everything.",
            next: "final_bad",
            effect: -15,
            feedback: "This jumps too big too fast and can make the situation explode."
          }
        ]
      },

      parent_recover: {
        speaker: "Player 1 - Parent",
        text: "The conversation is turning into an argument. What should the parent say?",
        choices: [
          {
            text: "Let’s reset. I need your room cleaned, and we can talk respectfully.",
            next: "child_final",
            effect: 10,
            feedback: "Good recovery. The parent corrects the tone without dropping the expectation."
          },
          {
            text: "Don’t talk back to me.",
            next: "final_bad",
            effect: -10,
            feedback: "This focuses on control instead of solving the task."
          },
          {
            text: "Forget it. I’ll do it myself.",
            next: "final_bad",
            effect: -10,
            feedback: "This removes responsibility from the child and teaches avoidance."
          }
        ]
      },

      parent_repair: {
        speaker: "Player 1 - Parent",
        text: "The child accepted responsibility but did not like the parent’s tone. What should the parent say?",
        choices: [
          {
            text: "You’re right. I could have said that better. Thank you for still taking care of it.",
            next: "final_good",
            effect: 15,
            feedback: "Excellent. Parents can model accountability too."
          },
          {
            text: "Don’t correct me.",
            next: "final_bad",
            effect: -10,
            feedback: "This teaches that only the child has to be respectful, which is not fair or helpful."
          },
          {
            text: "Just clean it.",
            next: "final_neutral",
            effect: -5,
            feedback: "This keeps the task moving but misses a chance to model repair."
          }
        ]
      },

      parent_shutdown: {
        speaker: "Player 1 - Parent",
        text: "The child is shutting down. What should the parent say?",
        choices: [
          {
            text: "I can tell you’re frustrated. Clean first, then we can talk.",
            next: "final_neutral",
            effect: 5,
            feedback: "Good balance. The parent notices feelings but keeps the expectation."
          },
          {
            text: "Lose the attitude.",
            next: "final_bad",
            effect: -10,
            feedback: "This usually creates more attitude, not less."
          },
          {
            text: "Whatever, just do it.",
            next: "final_neutral",
            effect: -5,
            feedback: "This may end the moment, but it does not teach better communication."
          }
        ]
      },

      child_final: {
        speaker: "Player 2 - Child",
        text: "How should the child finish?",
        choices: [
          {
            text: "Okay. I’ll clean it now.",
            next: "final_good",
            effect: 15,
            feedback: "Great. Responsibility accepted."
          },
          {
            text: "Can I have music on while I clean?",
            next: "final_good",
            effect: 10,
            feedback: "Good compromise. The task still gets done."
          },
          {
            text: "This is dumb.",
            next: "final_bad",
            effect: -10,
            feedback: "This keeps the conflict alive."
          }
        ]
      },

      final_good: {
        speaker: "Result",
        text: "💬 Productive outcome. The room gets cleaned and both sides practice respect.",
        choices: []
      },
      final_neutral: {
        speaker: "Result",
        text: "⚖️ Neutral outcome. The task may get done, but the relationship repair is incomplete.",
        choices: []
      },
      final_bad: {
        speaker: "Result",
        text: "🔥 Escalated outcome. The task became a power struggle.",
        choices: []
      }
    }
  }
];

function startConversationPractice() {
  showScreen("conversation");

  currentConversation = null;
  currentStep = "";
  respectScore = 50;
  conversationHistory = [];

  document.getElementById("scenarioTitle").textContent = "Conversation Practice";
  document.getElementById("speakerBox").textContent = "Choose a role";
  document.getElementById("conversationText").textContent = "Who starts the conversation?";
  document.getElementById("feedbackBox").textContent = "";
  document.getElementById("respectMeter").textContent = "50";

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

  const parentBtn = document.createElement("button");
  parentBtn.textContent = "Parent Starts";
  parentBtn.onclick = () => showTopics("parent");
  box.appendChild(parentBtn);

  const childBtn = document.createElement("button");
  childBtn.textContent = "Child Starts";
  childBtn.onclick = () => showTopics("child");
  box.appendChild(childBtn);
}

function showTopics(role) {
  const topics = conversationTopics.filter(topic => topic.role === role);

  document.getElementById("scenarioTitle").textContent =
    role === "parent" ? "Parent Starts" : "Child Starts";
  document.getElementById("speakerBox").textContent = "Choose a topic";
  document.getElementById("conversationText").textContent = "Pick a situation to practice.";
  document.getElementById("feedbackBox").textContent = "";

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

  topics.forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic.title;
    btn.onclick = () => loadTopic(topic);
    box.appendChild(btn);
  });

  const back = document.createElement("button");
  back.textContent = "⬅ Back to Role Choice";
  back.onclick = startConversationPractice;
  box.appendChild(back);
}

function loadTopic(topic) {
  currentConversation = topic;
  currentStep = topic.start;
  respectScore = 50;
  conversationHistory = [];
  showConversationStep();
}

function showConversationStep() {
  const step = currentConversation.steps[currentStep];

  document.getElementById("scenarioTitle").textContent = currentConversation.title;
  document.getElementById("speakerBox").textContent = step.speaker;
  document.getElementById("conversationText").textContent = step.text;
  document.getElementById("respectMeter").textContent = respectScore;
  document.getElementById("feedbackBox").textContent = "";

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

  if (conversationHistory.length > 0) {
    const back = document.createElement("button");
    back.textContent = "⬅ Back One Step";
    back.onclick = goBackOneStep;
    box.appendChild(back);
  }

  if (!step.choices || step.choices.length === 0) {
    const another = document.createElement("button");
    another.textContent = "Choose Another Topic";
    another.onclick = startConversationPractice;
    box.appendChild(another);
    return;
  }

  step.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => chooseConversationAnswer(choice);
    box.appendChild(btn);
  });
}

function chooseConversationAnswer(choice) {
  conversationHistory.push({
    step: currentStep,
    score: respectScore
  });

  respectScore += choice.effect || 0;
  document.getElementById("respectMeter").textContent = respectScore;
  document.getElementById("feedbackBox").textContent = choice.feedback || "";

  currentStep = choice.next;

  const box = document.getElementById("choicesBox");
  box.innerHTML = "";

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.onclick = showConversationStep;
  box.appendChild(nextBtn);
}

function goBackOneStep() {
  if (conversationHistory.length === 0) return;

  const previous = conversationHistory.pop();
  currentStep = previous.step;
  respectScore = previous.score;

  showConversationStep();
}

function goBackOneStep() {
  if (conversationHistory.length === 0) return;

  const previous = conversationHistory.pop();
  currentStep = previous.step;
  respectScore = previous.score;

  showConversationStep();
}
              
window.startGame = startGame;
window.nextQuestion = nextQuestion;
window.showScreen = showScreen;
window.goHome = goHome;
window.restartCurrentGame = restartCurrentGame;
window.startConversationPractice = startConversationPractice;
window.toggleReadAloud = toggleReadAloud;
window.readQuestionAloud = readQuestionAloud;
window.addGoodChoice = addGoodChoice;
window.addNeedsWork = addNeedsWork;
window.resetTracker = resetTracker;
window.addCategoryChoice = addCategoryChoice;

document.addEventListener("DOMContentLoaded", () => {
  goHome();
});
