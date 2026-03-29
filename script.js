const questions = [
  // EASY (1–30)
  {
    question: "Your teacher is talking and you dropped your pencil. What should you do?",
    choices: ["Interrupt", "Wait", "Talk to a friend"],
    correct: 1,
    explanation: "Instructions are important—wait."
  },
  {
    question: "Your friend is telling a story. What should you do?",
    choices: ["Interrupt", "Listen", "Talk louder"],
    correct: 1,
    explanation: "Listening shows respect."
  },
  {
    question: "Your parent is talking and you want a snack. What should you do?",
    choices: ["Interrupt", "Wait", "Yell"],
    correct: 1,
    explanation: "Snacks are not urgent."
  },
  {
    question: "Someone is about to trip. What should you do?",
    choices: ["Interrupt", "Wait", "Ignore"],
    correct: 0,
    explanation: "Safety comes first."
  },
  {
    question: "Your teacher is helping another student. What should you do?",
    choices: ["Interrupt", "Wait", "Complain"],
    correct: 1,
    explanation: "Wait your turn."
  },

  {
    question: "You want to tell a joke during a serious conversation. What should you do?",
    choices: ["Interrupt", "Wait", "Say it anyway"],
    correct: 1,
    explanation: "Timing matters."
  },
  {
    question: "Someone is about to touch something hot. What should you do?",
    choices: ["Interrupt", "Wait", "Watch"],
    correct: 0,
    explanation: "Preventing harm is important."
  },
  {
    question: "Your sibling is talking and you want attention. What should you do?",
    choices: ["Interrupt", "Wait", "Annoy them"],
    correct: 1,
    explanation: "Attention can wait."
  },
  {
    question: "Your teacher is explaining directions. What should you do?",
    choices: ["Interrupt", "Listen", "Ignore"],
    correct: 1,
    explanation: "Listening helps you understand."
  },
  {
    question: "You know the answer but the teacher is still talking. What should you do?",
    choices: ["Interrupt", "Wait", "Shout"],
    correct: 1,
    explanation: "Let them finish."
  },

  // MEDIUM (31–70)
  {
    question: "Your parent is on the phone and you feel sick. What should you do?",
    choices: ["Interrupt", "Wait", "Ignore"],
    correct: 0,
    explanation: "Health is important."
  },
  {
    question: "Two people are talking and you need something small. What should you do?",
    choices: ["Interrupt", "Wait or say excuse me", "Walk away mad"],
    correct: 1,
    explanation: "Polite interruption is okay."
  },
  {
    question: "Your friend is talking and you disagree. What should you do?",
    choices: ["Interrupt", "Wait", "Yell"],
    correct: 1,
    explanation: "Let them finish first."
  },
  {
    question: "You are bored while someone is talking. What should you do?",
    choices: ["Interrupt", "Wait", "Distract others"],
    correct: 1,
    explanation: "Boredom isn’t an emergency."
  },
  {
    question: "You are in a store and want something. What should you do?",
    choices: ["Interrupt", "Wait", "Grab it"],
    correct: 1,
    explanation: "Wait your turn."
  },

  {
    question: "Someone is crying and talking. What should you do?",
    choices: ["Interrupt", "Listen", "Ignore"],
    correct: 1,
    explanation: "Listening shows care."
  },
  {
    question: "Your coach is giving instructions. What should you do?",
    choices: ["Interrupt", "Listen", "Ignore"],
    correct: 1,
    explanation: "Instructions matter."
  },
  {
    question: "You forgot homework and teacher is talking. What should you do?",
    choices: ["Interrupt", "Wait", "Blame others"],
    correct: 1,
    explanation: "Non-urgent issues can wait."
  },
  {
    question: "You walk into a room where someone is on a video call. What should you do?",
    choices: ["Interrupt", "Wait quietly", "Talk loudly"],
    correct: 1,
    explanation: "Respect conversations."
  },
  {
    question: "Someone is about to do something unsafe. What should you do?",
    choices: ["Interrupt", "Wait", "Ignore"],
    correct: 0,
    explanation: "Safety is priority."
  },

  // HARD (71–100)
  {
    question: "Your teacher is talking and you realize you misunderstood directions that affect your grade. What should you do?",
    choices: ["Interrupt", "Wait", "Ignore"],
    correct: 0,
    explanation: "Important situations can justify interrupting."
  },
  {
    question: "Your parent is talking and you remember something important for tomorrow. What should you do?",
    choices: ["Interrupt", "Wait or write it down", "Forget"],
    correct: 1,
    explanation: "Not urgent—handle it smartly."
  },
  {
    question: "Your friend is talking and says something wrong. What should you do?",
    choices: ["Interrupt", "Wait", "Embarrass them"],
    correct: 1,
    explanation: "Correct respectfully."
  },
  {
    question: "You think something might be dangerous but aren’t sure. What should you do?",
    choices: ["Interrupt", "Wait", "Ignore"],
    correct: 0,
    explanation: "When in doubt—speak up."
  },
  {
    question: "Someone is venting and you want to give advice immediately. What should you do?",
    choices: ["Interrupt", "Listen first", "Walk away"],
    correct: 1,
    explanation: "People need to feel heard first."
  }
];

function showGame() {
  document.getElementById("game-section").style.display = "block";
  document.getElementById("tracker-section").style.display = "none";
  loadQuestion();
}

function showTracker() {
  document.getElementById("game-section").style.display = "none";
  document.getElementById("tracker-section").style.display = "block";
  updateTracker();
}
