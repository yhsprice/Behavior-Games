const APP_VERSION = "FINAL-CLEAN-V129";

let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

let selectedDifficulty = "";
let playerName = "";
let selectedRewardTheme = "";
let rewardPiecesEarned = 0;

const rewardThemes = {
  character: ["👟 Shoes", "👖 Pants", "👕 Shirt", "🎀 Accessory", "😊 Finished Character"],
  truck: ["🛞 Wheels", "🚚 Truck Body", "🪟 Windows", "💡 Lights", "🏁 Finished Truck"],
  house: ["⬛ Foundation", "🧱 Walls", "🏠 Roof", "🚪 Door", "🌸 Finished House"],
  robot: ["🦿 Legs", "🤖 Body", "🦾 Arms", "🔋 Power", "✨ Finished Robot"]
};

function startGameSetup(difficulty) {
  selectedDifficulty = difficulty;
  showScreen("setup");
}

function startGame(category) {
  if (typeof allQuestions === "undefined" || (!allQuestions[category] && category !== "mixed")) {
    alert("Questions not loading correctly.");
    return;
  }
  
  currentCategory = category;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;

  rewardPiecesEarned = 0;

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
  updateRewardDisplay();
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
  addRewardPiece();
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
    "conversation-screen",
    "setup-screen"
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

function buildConversation(title, role, turns) {
  const steps = {};

  turns.forEach((turn, index) => {
    const key = "turn" + (index + 1);
    const nextKey = "turn" + (index + 2);

    steps[key] = {
      speaker: turn.speaker,
      text: turn.text,
      choices: turn.choices.map(choice => ({
        text: choice.text,
        effect: choice.effect,
        feedback: choice.feedback,
        next: choice.next || (index === turns.length - 1 ? "final_neutral" : nextKey)
      }))
    };
  });

  steps.final_good = {
    speaker: "Result",
    text: "💬 Productive conversation. Both people practiced respect, listening, and problem-solving.",
    choices: []
  };

  steps.final_neutral = {
    speaker: "Result",
    text: "⚖️ Neutral ending. The conversation stayed mostly calm, but there is still room to improve.",
    choices: []
  };

  steps.final_bad = {
    speaker: "Result",
    text: "🔥 Escalated ending. The conversation became more about reacting than understanding.",
    choices: []
  };

  return {
    title,
    role,
    start: "turn1",
    steps
  };
}

const conversationTopics = [

  buildConversation("That’s not fair!", "child", [
    {
      speaker: "Player 1 - Parent",
      text: "Your child says: “That’s not fair!” What is a good response?",
      choices: [
        { text: "Fair doesn’t always mean equal. Let’s talk about why this decision was made.", effect: 10, feedback: "Good choice. This keeps the boundary but also explains the reason. Kids may not like the answer, but explanations help them learn instead of just feeling shut down." },
        { text: "Life isn’t fair. Get over it.", effect: -15, feedback: "This usually makes things worse. It may be true, but it sounds dismissive and teaches frustration instead of understanding." },
        { text: "Stop arguing with me.", effect: -10, feedback: "This may stop the conversation for a second, but it does not teach the child how to handle disappointment." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say back?",
      choices: [
        { text: "I still don’t like it, but can you explain why?", effect: 10, feedback: "Excellent. This shows respectful disagreement. You do not have to like the answer to talk about it respectfully." },
        { text: "That’s stupid.", effect: -10, feedback: "This keeps the fight going. It attacks the rule instead of asking to understand it." },
        { text: "Whatever.", effect: -5, feedback: "This avoids the conversation. It may feel easier, but nothing gets solved." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent continue?",
      choices: [
        { text: "The rule is different because trust and responsibility are different right now.", effect: 10, feedback: "Strong response. This connects the rule to behavior instead of making it feel random." },
        { text: "Because I’m the parent.", effect: -5, feedback: "This may be true, but it does not teach much. It can make the child feel powerless." },
        { text: "You already know why.", effect: -10, feedback: "This shuts down the learning moment." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "How should the child respond now?",
      choices: [
        { text: "Okay. I still don’t like it, but I understand better.", effect: 15, feedback: "Excellent. This shows maturity. You can dislike a rule and still respond respectfully." },
        { text: "Can I earn trust back?", effect: 15, feedback: "Excellent. This turns the problem into a goal." },
        { text: "This is still stupid.", effect: -10, feedback: "This keeps the argument alive and makes it harder to earn trust." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say to close the conversation?",
      choices: [
        { text: "Trust can be earned, but it is not automatic. As long as you keep trying then trust will build.", effect: 10, feedback: "Great close. It reinforces communication and gives a path forward." },
        { text: "See, I told you I was right.", effect: -10, feedback: "This turns a learning moment into a parent victory lap. Nobody likes a victory lap in the kitchen." },
        { text: "Now stop bringing it up.", effect: -5, feedback: "This ends the topic, but it also discourages future communication." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay. I’ll try to make better choices.", effect: 10, feedback: "Good ending. The child accepts responsibility without being shamed.", next: "final_good" },
        { text: "Fine, whatever.", effect: -5, feedback: "This ends the conversation, but it does not show real understanding.", next: "final_neutral" },
        { text: "You’re still unfair.", effect: -10, feedback: "This restarts the argument instead of ending it.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("But THEY get to do it!", "child", [
    {
      speaker: "Player 1 - Parent",
      text: "Your child says: “But THEY get to do it!” What should the parent say?",
      choices: [
        { text: "I understand that feels unfair, but different families have different rules.", effect: 10, feedback: "Good response. It validates the feeling without changing the boundary." },
        { text: "I don’t care what they get to do.", effect: -15, feedback: "This shuts the child down and usually makes them feel unheard." },
        { text: "That’s not our house.", effect: -5, feedback: "This is true, but it does not explain much or help the child process it." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "How should the child respond?",
      choices: [
        { text: "Why is it different for me?", effect: 10, feedback: "Good question. This keeps the conversation open and asks for understanding." },
        { text: "That’s not fair!", effect: -5, feedback: "This repeats the complaint without moving toward understanding." },
        { text: "You just don’t want me to have fun.", effect: -10, feedback: "This assumes bad intentions and usually makes the parent defensive." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say next?",
      choices: [
        { text: "Our rules are based on your safety, maturity, and trust.", effect: 10, feedback: "Strong response. It explains that rules are connected to responsibility, not just control." },
        { text: "Because I said so.", effect: -10, feedback: "This may end the discussion, but it does not help the child understand." },
        { text: "Maybe their parents don’t care.", effect: -10, feedback: "This criticizes others and distracts from your own family rule." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "What can I do to earn more trust?", effect: 15, feedback: "Excellent. This turns complaining into problem-solving." },
        { text: "That’s dumb.", effect: -10, feedback: "This blocks learning and keeps the argument going." },
        { text: "So I’m being punished forever?", effect: -5, feedback: "This exaggerates the situation instead of asking for a clear path forward." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent answer?",
      choices: [
        { text: "No, not forever. Let’s talk about what earning trust looks like.", effect: 10, feedback: "Good response. It lowers fear and gives a clear goal." },
        { text: "Maybe, if you keep acting like this.", effect: -10, feedback: "This turns the moment into a threat and escalates emotion." },
        { text: "We’ll see.", effect: -5, feedback: "This is vague. Kids need clear expectations, not mystery rules." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay. Can we make a plan for that?", effect: 10, feedback: "Great ending. It asks for a path forward.", next: "final_good" },
        { text: "Fine.", effect: 0, feedback: "Not terrible, but not very engaged either.", next: "final_neutral" },
        { text: "I’m still going to do it anyway.", effect: -15, feedback: "This breaks trust further and creates consequences.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("I didn’t do anything!", "child", [
    {
      speaker: "Player 1 - Parent",
      text: "Your child says: “I didn’t do anything!” What should the parent say?",
      choices: [
        { text: "Help me understand what happened from your side.", effect: 10, feedback: "Good choice. It invites honesty instead of starting with blame." },
        { text: "I know you did it. Stop lying.", effect: -15, feedback: "This may be true, but it starts as an accusation and usually creates defensiveness." },
        { text: "Then why is everyone saying you did?", effect: -5, feedback: "This is understandable, but it can feel like the child is already on trial." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "I wasn’t the only one, but I did have a part in it.", effect: 15, feedback: "Excellent. This is honest and takes responsibility without accepting all the blame." },
        { text: "They started it!", effect: -5, feedback: "This may be partly true, but it avoids talking about your own choices." },
        { text: "Everybody is lying.", effect: -10, feedback: "This makes the conversation bigger and harder to solve." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent respond?",
      choices: [
        { text: "Thank you for being honest. Let’s talk about your part first.", effect: 10, feedback: "Good response. It rewards honesty and focuses on responsibility." },
        { text: "See, I knew it.", effect: -10, feedback: "This makes honesty feel like a trap." },
        { text: "You’re always involved in something.", effect: -15, feedback: "This labels the child instead of addressing the situation." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say next?",
      choices: [
        { text: "I should have walked away.", effect: 10, feedback: "Good reflection. It shows the child is thinking about a better choice." },
        { text: "But they were worse than me.", effect: -5, feedback: "This compares blame instead of focusing on growth." },
        { text: "I don’t care.", effect: -10, feedback: "This blocks learning and responsibility." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say to teach the lesson?",
      choices: [
        { text: "Next time, walking away or asking for help would be a better choice.", effect: 10, feedback: "Good teaching. It gives a specific replacement behavior." },
        { text: "You should know better.", effect: -5, feedback: "This may be true, but it does not teach what to do next time." },
        { text: "I’m tired of dealing with this.", effect: -10, feedback: "This expresses frustration but does not help the child improve." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "I’ll try to walk away next time.", effect: 10, feedback: "Good ending. It shows a plan for better choices.", next: "final_good" },
        { text: "Okay.", effect: 0, feedback: "This accepts the conversation but does not show much reflection.", next: "final_neutral" },
        { text: "Whatever, it wasn’t my fault.", effect: -10, feedback: "This avoids responsibility and keeps the pattern going.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("You always blame me!", "child", [
    {
      speaker: "Player 1 - Parent",
      text: "Your child says: “You always blame me!” What should the parent say?",
      choices: [
        { text: "It feels that way to you. Let’s look at what happened this time.", effect: 10, feedback: "Good response. It acknowledges the feeling without agreeing to an unfair exaggeration." },
        { text: "Because it usually is you.", effect: -15, feedback: "This is an instant escalation. It labels the child instead of solving the current issue." },
        { text: "That’s not true.", effect: -5, feedback: "This may be true, but it dismisses the feeling too quickly." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "I feel like nobody listens to my side.", effect: 10, feedback: "Great response. It explains the feeling without attacking." },
        { text: "You never believe me!", effect: -10, feedback: "The word 'never' usually makes the other person defensive." },
        { text: "Forget it.", effect: -5, feedback: "This shuts down the conversation before anything gets solved." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent respond?",
      choices: [
        { text: "I want to hear your side. Tell me what happened.", effect: 10, feedback: "Good response. It opens the door for honesty." },
        { text: "Fine, talk.", effect: -5, feedback: "This technically allows talking, but the tone is not very welcoming." },
        { text: "I already know what happened.", effect: -10, feedback: "This tells the child there is no point in explaining." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child do next?",
      choices: [
        { text: "Explain calmly what happened.", effect: 10, feedback: "Good choice. Calm details are easier to listen to than accusations." },
        { text: "Blame someone else completely.", effect: -10, feedback: "This avoids responsibility and makes the story harder to trust." },
        { text: "Yell louder.", effect: -15, feedback: "Yelling usually makes people listen less, not more." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say after listening?",
      choices: [
        { text: "Thank you for explaining. Now let’s talk about what part you can control.", effect: 10, feedback: "Excellent. It validates the child and brings the focus back to responsibility." },
        { text: "That sounds like excuses.", effect: -10, feedback: "This discourages honesty and makes the child feel dismissed." },
        { text: "I still think it was your fault.", effect: -10, feedback: "This ignores the effort to explain and restarts the blame cycle." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay. I can talk about my part.", effect: 10, feedback: "Great ending. This shows accountability.", next: "final_good" },
        { text: "I guess.", effect: 0, feedback: "This is not perfect, but it keeps the conversation from exploding.", next: "final_neutral" },
        { text: "No, everyone else is the problem.", effect: -10, feedback: "This avoids growth and keeps the same problem alive.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("I hate this house!", "child", [
    {
      speaker: "Player 1 - Parent",
      text: "Your child says: “I hate this house!” What should the parent say?",
      choices: [
        { text: "You sound really upset. Tell me what’s going on.", effect: 10, feedback: "Good response. It hears the emotion underneath the words." },
        { text: "Then leave.", effect: -20, feedback: "This is a nuclear response. It can deeply hurt trust and safety." },
        { text: "That’s not something we say.", effect: -5, feedback: "This addresses the words, but it may miss the bigger feeling behind them." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say next?",
      choices: [
        { text: "I’m really mad and I don’t feel listened to.", effect: 10, feedback: "Excellent. This names the feeling instead of attacking." },
        { text: "Nobody cares about me.", effect: -5, feedback: "This may be how it feels, but it is a big statement that can scare or upset others." },
        { text: "I hate everyone here.", effect: -15, feedback: "This expands the hurt and makes repair harder." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent respond?",
      choices: [
        { text: "I care about you. Let’s slow down and figure out what happened.", effect: 10, feedback: "Strong response. It reassures the child and moves toward problem-solving." },
        { text: "You’re being ridiculous.", effect: -15, feedback: "This dismisses the child’s feelings and usually escalates." },
        { text: "Go cool off.", effect: -5, feedback: "A break can help, but it needs warmth and follow-up." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "I need a minute, but I’ll talk after.", effect: 10, feedback: "Great. Taking space is okay when you also plan to come back." },
        { text: "No, I’m not talking.", effect: -5, feedback: "This protects feelings short-term but blocks repair." },
        { text: "You don’t care.", effect: -10, feedback: "This assumes the worst and keeps the argument emotional." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say to finish safely?",
      choices: [
        { text: "Take a minute. I’ll be here when you’re ready.", effect: 10, feedback: "Excellent. This gives space while keeping connection." },
        { text: "Fine. Stay mad.", effect: -10, feedback: "This abandons the repair moment." },
        { text: "You’re grounded for saying that.", effect: -10, feedback: "Consequences may be needed later, but in a big emotional moment, connection comes first." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay. I need a few minutes, then I’ll talk.", effect: 10, feedback: "Good ending. This shows emotional control.", next: "final_good" },
        { text: "Fine.", effect: 0, feedback: "Not perfect, but it avoids making things worse.", next: "final_neutral" },
        { text: "I’m never talking to you again.", effect: -10, feedback: "This keeps the hurt going instead of moving toward repair.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("Go clean your room", "parent", [
    {
      speaker: "Player 1 - Parent",
      text: "Parent wants the child to clean their room. What should the parent say?",
      choices: [
        { text: "Please clean your room before dinner.", effect: 10, feedback: "Good choice. It is clear, respectful, and gives a time frame." },
        { text: "Go clean your room right now!", effect: -5, feedback: "This is clear, but the harsh tone may create resistance." },
        { text: "Your room is disgusting. Go fix it.", effect: -15, feedback: "This attacks the child instead of the behavior. Shame usually creates defensiveness." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "Okay. I’ll do it.", effect: 15, feedback: "Great response. It accepts responsibility without arguing." },
        { text: "Do I have to?", effect: -5, feedback: "This is mild pushback. It delays responsibility." },
        { text: "I’ll do it later.", effect: -5, feedback: "This avoids the task. Later often turns into never." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent follow up?",
      choices: [
        { text: "Clean it first, then you can take a break.", effect: 10, feedback: "Good. It keeps the expectation clear and gives a reasonable next step." },
        { text: "Because I said so.", effect: -5, feedback: "This may get obedience, but it does not teach responsibility." },
        { text: "If you don’t do it, you lose everything.", effect: -15, feedback: "This jumps too big too fast and can make the situation explode." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "How should the child respond?",
      choices: [
        { text: "Okay. Can I listen to music while I clean?", effect: 10, feedback: "Good compromise. The task still gets done." },
        { text: "This is dumb.", effect: -10, feedback: "This keeps the conflict alive." },
        { text: "Fine, whatever.", effect: -5, feedback: "This may lead to action, but the attitude keeps tension." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say?",
      choices: [
        { text: "Yes, music is fine as long as the room gets cleaned.", effect: 10, feedback: "Good choice. It allows reasonable independence while keeping the goal." },
        { text: "No, you don’t deserve music.", effect: -10, feedback: "This adds a battle that was not needed." },
        { text: "Just do it already.", effect: -5, feedback: "This may be understandable, but it does not calm the situation." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay, I’ll start now.", effect: 10, feedback: "Great. Responsibility accepted.", next: "final_good" },
        { text: "I’ll do some of it.", effect: 0, feedback: "This is partial effort, but not full responsibility.", next: "final_neutral" },
        { text: "No, I’m not doing it.", effect: -15, feedback: "This creates consequences and breaks cooperation.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("Do your homework", "parent", [
    {
      speaker: "Player 1 - Parent",
      text: "Parent wants homework done. What should the parent say?",
      choices: [
        { text: "Let’s get your homework done first.", effect: 10, feedback: "Good choice. It is clear and supportive." },
        { text: "Do your homework now.", effect: -5, feedback: "Clear, but it may feel harsh." },
        { text: "If you don’t do it, you’re grounded.", effect: -15, feedback: "This jumps straight to punishment before understanding the problem." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "I don’t understand part of it.", effect: 10, feedback: "Great honesty. Asking for help is better than avoiding." },
        { text: "I’ll do it later.", effect: -5, feedback: "This delays the responsibility." },
        { text: "No.", effect: -10, feedback: "This starts conflict instead of solving the homework problem." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent respond?",
      choices: [
        { text: "Let’s look at the first part together.", effect: 10, feedback: "Good support. It helps the child start without doing everything for them." },
        { text: "Figure it out yourself.", effect: -10, feedback: "This can increase frustration and avoidance." },
        { text: "You should have paid attention.", effect: -10, feedback: "This shames instead of helping the child move forward." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child do next?",
      choices: [
        { text: "Try the first problem with help.", effect: 10, feedback: "Good choice. Starting is often the hardest part." },
        { text: "Complain the whole time.", effect: -10, feedback: "Complaining makes the task feel harder and longer." },
        { text: "Guess without trying.", effect: -5, feedback: "This finishes faster but does not help learning." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say after the child starts?",
      choices: [
        { text: "Good start. Keep going and ask if you get stuck.", effect: 10, feedback: "Good encouragement. It builds confidence and independence." },
        { text: "See, that wasn’t hard.", effect: -5, feedback: "This can feel dismissive if the child was genuinely struggling." },
        { text: "You better finish all of it perfectly.", effect: -10, feedback: "This adds pressure and can create anxiety." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay. I’ll keep working and ask if I need help.", effect: 10, feedback: "Excellent. This shows responsibility and communication.", next: "final_good" },
        { text: "I’ll try.", effect: 5, feedback: "Good enough. It shows effort.", next: "final_neutral" },
        { text: "I hate homework and I quit.", effect: -15, feedback: "This avoids the task and keeps the conflict going.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("Do your chores", "parent", [
    {
      speaker: "Player 1 - Parent",
      text: "Parent wants chores done. What should the parent say?",
      choices: [
        { text: "It’s time to get your chores done.", effect: 10, feedback: "Clear and neutral. Good start." },
        { text: "Why haven’t you done your chores yet?", effect: -5, feedback: "This may be fair, but it can sound blaming." },
        { text: "You never do anything!", effect: -15, feedback: "This attacks the child instead of the chore." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "I forgot. I’ll do them now.", effect: 10, feedback: "Good response. It admits the mistake and fixes it." },
        { text: "Why do I have to?", effect: -5, feedback: "This pushes back instead of accepting responsibility." },
        { text: "I’m not doing it.", effect: -15, feedback: "This creates a power struggle." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent explain chores?",
      choices: [
        { text: "Everyone helps because we all live here.", effect: 10, feedback: "Good explanation. It teaches contribution instead of just obedience." },
        { text: "Because I’m not your maid.", effect: -10, feedback: "Understandable frustration, but it adds insult to instruction." },
        { text: "Just stop being lazy.", effect: -15, feedback: "This labels the child and creates shame." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say next?",
      choices: [
        { text: "Okay. Which chore should I start with?", effect: 10, feedback: "Great. Asking where to start helps action happen." },
        { text: "This is annoying.", effect: -5, feedback: "Honest, but not helpful if it becomes the main focus." },
        { text: "Someone else should do it.", effect: -10, feedback: "This avoids responsibility." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say?",
      choices: [
        { text: "Start with the dishes, then take a break.", effect: 10, feedback: "Good. Clear first step and reasonable finish." },
        { text: "Do all of it now or else.", effect: -10, feedback: "This may overwhelm the child and escalate." },
        { text: "Never mind, I’ll do it.", effect: -10, feedback: "This teaches the child that avoiding works." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay. I’ll start with the dishes.", effect: 10, feedback: "Good ending. Responsibility accepted.", next: "final_good" },
        { text: "Fine, but I’m mad.", effect: 0, feedback: "Not perfect, but the chore may still get done.", next: "final_neutral" },
        { text: "Nope.", effect: -15, feedback: "This keeps the conflict going.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("Go outside and play", "parent", [
    {
      speaker: "Player 1 - Parent",
      text: "Parent wants the child to go outside. What should the parent say?",
      choices: [
        { text: "Let’s take a screen break and go outside for a while.", effect: 10, feedback: "Good choice. It explains the reason and sounds less like punishment." },
        { text: "You’ve been inside too long. Go outside.", effect: -5, feedback: "Clear, but a little blunt." },
        { text: "Get off that screen right now!", effect: -15, feedback: "This can trigger a power struggle." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "Can I finish this first, then go?", effect: 10, feedback: "Good negotiating if said respectfully." },
        { text: "I don’t want to.", effect: -5, feedback: "Honest, but resistant." },
        { text: "No, you can’t make me.", effect: -15, feedback: "This escalates fast." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent respond?",
      choices: [
        { text: "You can finish this part, then outside for 20 minutes.", effect: 10, feedback: "Good compromise. It gives a clear limit." },
        { text: "No. Now means now.", effect: -10, feedback: "Sometimes needed, but it may escalate if compromise was reasonable." },
        { text: "You’re addicted to that thing.", effect: -15, feedback: "This labels and shames instead of guiding." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say next?",
      choices: [
        { text: "Okay, 20 minutes is fine.", effect: 10, feedback: "Good. The child accepts a reasonable plan." },
        { text: "Only 5 minutes.", effect: -5, feedback: "This keeps bargaining and delays the action." },
        { text: "I’m not going.", effect: -15, feedback: "This refuses the boundary." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say to close?",
      choices: [
        { text: "Thanks for working with me. Set it down when this part ends.", effect: 10, feedback: "Good close. It reinforces cooperation." },
        { text: "I’ll believe it when I see it.", effect: -5, feedback: "This shows distrust and may cause resentment." },
        { text: "If you don’t, I’m taking it forever.", effect: -15, feedback: "Too big. Huge threats usually create huge reactions." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay. I’ll go when this part is done.", effect: 10, feedback: "Good ending. The child follows the plan.", next: "final_good" },
        { text: "Fine.", effect: 0, feedback: "Not enthusiastic, but not awful.", next: "final_neutral" },
        { text: "I’m hiding the tablet.", effect: -15, feedback: "This breaks trust and creates bigger consequences.", next: "final_bad" }
      ]
    }
  ]),

  buildConversation("Leave the animals alone", "parent", [
    {
      speaker: "Player 1 - Parent",
      text: "Parent sees the child bothering the animals. What should the parent say?",
      choices: [
        { text: "The animals need space. Leave them alone.", effect: 10, feedback: "Good. It is clear and explains the reason." },
        { text: "Stop bothering them.", effect: -5, feedback: "Clear, but it does not teach much." },
        { text: "What is wrong with you? Leave them alone!", effect: -20, feedback: "This shames the child and escalates the situation." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child say?",
      choices: [
        { text: "Okay. I didn’t realize they needed space.", effect: 10, feedback: "Good response. It shows learning." },
        { text: "I just want to play with them.", effect: 0, feedback: "Honest, but the animal’s comfort still matters." },
        { text: "No, they like it.", effect: -10, feedback: "This ignores the parent’s warning and the animal’s signals." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "How should the parent explain it?",
      choices: [
        { text: "Animals can get scared or hurt if we don’t respect their space.", effect: 10, feedback: "Good explanation. It teaches empathy and safety." },
        { text: "Because I said stop.", effect: -5, feedback: "Clear, but not very educational." },
        { text: "If you get scratched, don’t cry to me.", effect: -15, feedback: "This is harsh and misses the teaching moment." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What should the child do next?",
      choices: [
        { text: "Step away and let the animal rest.", effect: 10, feedback: "Excellent. This respects the animal’s needs." },
        { text: "Pet them one more time.", effect: -5, feedback: "This still ignores the boundary." },
        { text: "Keep chasing them.", effect: -15, feedback: "This is unsafe and disrespectful to the animal." }
      ]
    },
    {
      speaker: "Player 1 - Parent",
      text: "What should the parent say after the child steps away?",
      choices: [
        { text: "Thank you. You can play gently later when they come to you.", effect: 10, feedback: "Great. It gives a safe future option." },
        { text: "Finally.", effect: -5, feedback: "This adds attitude after the child made a better choice." },
        { text: "You’re never allowed near them again.", effect: -15, feedback: "Too extreme unless there is a serious safety issue." }
      ]
    },
    {
      speaker: "Player 2 - Child",
      text: "What is the best final child response?",
      choices: [
        { text: "Okay. I’ll wait until they want attention.", effect: 10, feedback: "Excellent. This shows respect for animals.", next: "final_good" },
        { text: "Okay, I guess.", effect: 0, feedback: "Not perfect, but the behavior changed.", next: "final_neutral" },
        { text: "I’ll do it when you’re not looking.", effect: -15, feedback: "This breaks trust and creates safety concerns.", next: "final_bad" }
      ]
    }
  ])
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
  currentStep = choice.next;

  document.getElementById("respectMeter").textContent = respectScore;

  const choicesBox = document.getElementById("choicesBox");
  const feedbackBox = document.getElementById("feedbackBox");

  // Clear answer buttons
  choicesBox.innerHTML = "";

  // Show chosen answer + explanation
  feedbackBox.innerHTML = `
    <div style="font-size:22px; line-height:1.5; margin-top:15px;">
      <strong>You chose:</strong><br>
      ${choice.text}
      <br><br>
      <strong>Why:</strong><br>
      ${choice.feedback || ""}
    </div>
  `;

  // Put Next BELOW the explanation
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.className = "primary-btn";
  nextBtn.style.marginTop = "18px";
  nextBtn.onclick = showConversationStep;
  
  feedbackBox.appendChild(nextBtn);
}

function goBackOneStep() {
  if (conversationHistory.length === 0) return;

  const previous = conversationHistory.pop();
  currentStep = previous.step;
  respectScore = previous.score;

  showConversationStep();
}

function selectRewardTheme(theme) {
  selectedRewardTheme = theme;
  rewardPiecesEarned = 0;

  function updateRewardDisplay() {
  const rewardBox = document.getElementById("reward-box");
  if (!rewardBox || !selectedRewardTheme) return;

  const pieces = rewardThemes[selectedRewardTheme] || [];
  const earned = pieces.slice(0, rewardPiecesEarned);
  const remaining = pieces.slice(rewardPiecesEarned);

  rewardBox.innerHTML = `
    <h3>${playerName}'s Reward Puzzle</h3>
    <div style="font-size: 22px; line-height: 1.6;">
      <strong>Earned:</strong><br>
      ${earned.length ? earned.join(" | ") : "No pieces yet"}
      <br><br>
      <strong>Still hidden:</strong><br>
      ${remaining.map(() => "⬜").join(" ")}
    </div>
  `;
}

function addRewardPiece() {
  const pieces = rewardThemes[selectedRewardTheme] || [];
  if (rewardPiecesEarned < pieces.length) {
    rewardPiecesEarned++;
  }
  updateRewardDisplay();
}

  const nameInput = document.getElementById("player-name-input");
  playerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Player";

  startGame(selectedDifficulty);
}

function updateRewardDisplay() {
  const rewardBox = document.getElementById("reward-box");
  if (!rewardBox || !selectedRewardTheme) return;

  const pieces = rewardThemes[selectedRewardTheme] || [];
  const earned = pieces.slice(0, rewardPiecesEarned);
  const remaining = pieces.slice(rewardPiecesEarned);

  rewardBox.innerHTML = `
    <h3>${playerName}'s Reward Puzzle</h3>
    <div style="font-size:22px; line-height:1.6;">
      <strong>Earned:</strong><br>
      ${earned.length ? earned.join(" | ") : "No pieces yet"}
      <br><br>
      <strong>Still hidden:</strong><br>
      ${remaining.map(() => "⬜").join(" ")}
    </div>
  `;
}

function addRewardPiece() {
  const pieces = rewardThemes[selectedRewardTheme] || [];

  if (rewardPiecesEarned < pieces.length) {
    rewardPiecesEarned++;
  }

  updateRewardDisplay();
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
window.startGameSetup = startGameSetup;
window.selectRewardTheme = selectRewardTheme;
window.updateRewardDisplay = updateRewardDisplay;
window.addRewardPiece = addRewardPiece;

document.addEventListener("DOMContentLoaded", () => {
  goHome();
});

