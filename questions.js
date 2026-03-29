const allQuestions = {
  interrupting: buildInterruptingQuestions(),
  kindness: buildKindnessQuestions(),
  calm: buildCalmQuestions()
};

function buildInterruptingQuestions() {
  const questionStarters = [
    "Your teacher is explaining directions",
    "Your coach is giving instructions",
    "Your parent is talking to another adult",
    "Your friend is telling a story",
    "The principal is making an announcement",
    "Your sibling is talking to a friend",
    "A librarian is explaining the rules",
    "Your class is watching a safety video",
    "Your teacher is helping another student",
    "Two adults are discussing plans"
  ];

  const nonUrgentSituations = [
    {
      ending: "and you dropped your pencil.",
      choices: ["Interrupt right away", "Wait until they finish", "Start talking to a friend instead"],
      correct: 1,
      explanation: "This is not urgent. Waiting shows respect."
    },
    {
      ending: "and you want to ask for a snack.",
      choices: ["Interrupt immediately", "Wait for a pause or say excuse me", "Whine until noticed"],
      correct: 1,
      explanation: "A snack is not an emergency."
    },
    {
      ending: "and you forgot your homework at home.",
      choices: ["Interrupt right away", "Wait until there is a good time", "Blame someone else loudly"],
      correct: 1,
      explanation: "This matters, but it can wait for a better moment."
    },
    {
      ending: "and you want to tell a joke.",
      choices: ["Say it right away", "Wait until later", "Talk over the speaker"],
      correct: 1,
      explanation: "Timing matters."
    },
    {
      ending: "and you need to know what time lunch is.",
      choices: ["Interrupt right away", "Wait for a pause", "Ask someone else by yelling"],
      correct: 1,
      explanation: "That question can wait."
    },
    {
      ending: "and you want to share something funny that happened earlier.",
      choices: ["Interrupt immediately", "Wait for the conversation to pause", "Speak louder than everyone"],
      correct: 1,
      explanation: "Funny does not mean urgent."
    },
    {
      ending: "and you want permission to go outside later.",
      choices: ["Interrupt now", "Wait until the conversation ends", "Keep repeating the question"],
      correct: 1,
      explanation: "This is not urgent."
    },
    {
      ending: "and you remembered a random thought.",
      choices: ["Say it before you forget", "Wait or write it down", "Shout it from across the room"],
      correct: 1,
      explanation: "Random thoughts do not outrank respect."
    },
    {
      ending: "and you want to ask where your shoes are.",
      choices: ["Interrupt immediately", "Wait for a better time", "Complain loudly"],
      correct: 1,
      explanation: "This can wait."
    },
    {
      ending: "and you want to ask if you can play a game later.",
      choices: ["Interrupt right away", "Wait politely", "Grab the device without asking"],
      correct: 1,
      explanation: "That is a wait-your-turn question."
    }
  ];

  const urgentSituations = [
    {
      ending: "and you suddenly feel very sick.",
      choices: ["Wait quietly", "Interrupt and tell them", "Say nothing"],
      correct: 1,
      explanation: "Health and safety are good reasons to interrupt."
    },
    {
      ending: "and you see smoke coming from a trash can.",
      choices: ["Wait until later", "Interrupt and warn an adult", "Ignore it"],
      correct: 1,
      explanation: "Danger beats manners."
    },
    {
      ending: "and someone is about to trip over a backpack.",
      choices: ["Interrupt and warn them", "Wait to see what happens", "Laugh"],
      correct: 0,
      explanation: "Preventing injury is important."
    },
    {
      ending: "and someone is about to touch a hot pan.",
      choices: ["Interrupt and warn them", "Stay quiet", "Let them find out"],
      correct: 0,
      explanation: "Safety comes first."
    },
    {
      ending: "and you see a younger child running toward the street.",
      choices: ["Interrupt and alert an adult", "Wait your turn", "Keep watching"],
      correct: 0,
      explanation: "This is urgent."
    },
    {
      ending: "and a classmate is about to spill chemicals in science class.",
      choices: ["Interrupt and warn the teacher", "Wait until class is over", "Move away and say nothing"],
      correct: 0,
      explanation: "Safety first."
    },
    {
      ending: "and someone left the dog gate open and the dog is running outside.",
      choices: ["Interrupt and say something", "Wait until the conversation is finished", "Assume someone else will notice"],
      correct: 0,
      explanation: "Urgent problems need fast action."
    },
    {
      ending: "and you smell gas in the kitchen.",
      choices: ["Interrupt and tell an adult", "Wait because it feels rude", "Light a candle to check"],
      correct: 0,
      explanation: "That is an immediate safety problem."
    },
    {
      ending: "and a student is choking in the cafeteria.",
      choices: ["Interrupt and get help", "Wait quietly", "Keep eating"],
      correct: 0,
      explanation: "Emergencies are never a wait-your-turn situation."
    },
    {
      ending: "and you realize the bus is leaving without your little brother.",
      choices: ["Interrupt and tell an adult", "Wait because they are busy", "Hope someone else notices"],
      correct: 0,
      explanation: "Urgent safety issues should be reported immediately."
    }
  ];

  const results = [];

  questionStarters.forEach((starter) => {
    nonUrgentSituations.forEach((situation) => {
      results.push({
        question: `${starter}, ${situation.ending} What should you do?`,
        choices: situation.choices,
        correct: situation.correct,
        explanation: situation.explanation
      });
    });
  });

  questionStarters.forEach((starter) => {
    urgentSituations.forEach((situation) => {
      results.push({
        question: `${starter}, ${situation.ending} What should you do?`,
        choices: situation.choices,
        correct: situation.correct,
        explanation: situation.explanation
      });
    });
  });

  return results;
}

function buildKindnessQuestions() {
  const contexts = [
    "At school",
    "At home",
    "At lunch",
    "On the bus",
    "At soccer practice",
    "During recess",
    "At the store",
    "At the library",
    "At a birthday party",
    "Online in a group chat"
  ];

  const situations = [
    {
      text: "someone drops their books.",
      choices: ["Laugh", "Walk away", "Help pick them up"],
      correct: 2,
      explanation: "Helping someone is a kind choice."
    },
    {
      text: "a classmate is sitting alone.",
      choices: ["Ignore them", "Invite them to join you", "Tell others not to sit there"],
      correct: 1,
      explanation: "Including others is kind."
    },
    {
      text: "your friend loses a game.",
      choices: ["Brag about winning", "Say something encouraging", "Make fun of them"],
      correct: 1,
      explanation: "Kindness matters most when someone feels bad."
    },
    {
      text: "someone makes a small mistake.",
      choices: ["Tease them", "Stay calm and be respectful", "Tell everyone"],
      correct: 1,
      explanation: "Kind people do not pile on when someone slips up."
    },
    {
      text: "a new kid looks nervous.",
      choices: ["Stare at them", "Say hello and be welcoming", "Whisper about them"],
      correct: 1,
      explanation: "A small welcome can change someone's whole day."
    },
    {
      text: "your sibling worked hard on something.",
      choices: ["Ignore it", "Say something supportive", "Say yours is better"],
      correct: 1,
      explanation: "Supporting others is a kind habit."
    },
    {
      text: "someone forgets their lunch.",
      choices: ["Say that's their problem", "Offer help or share if allowed", "Announce it to everyone"],
      correct: 1,
      explanation: "Helping when you can is kind."
    },
    {
      text: "a friend is upset.",
      choices: ["Change the subject", "Listen and be kind", "Tell them to get over it"],
      correct: 1,
      explanation: "Listening kindly helps people feel safe."
    },
    {
      text: "someone asks for help with directions.",
      choices: ["Point the wrong way as a joke", "Help them if you can", "Pretend not to hear"],
      correct: 1,
      explanation: "Kindness includes simple helpful actions."
    },
    {
      text: "a teammate misses a shot.",
      choices: ["Blame them", "Encourage them", "Roll your eyes"],
      correct: 1,
      explanation: "Encouragement is kinder than blame."
    }
  ];

  const results = [];

  contexts.forEach((context) => {
    situations.forEach((situation) => {
      results.push({
        question: `${context}, ${situation.text} What is the kindest choice?`,
        choices: situation.choices,
        correct: situation.correct,
        explanation: situation.explanation
      });
    });
  });

  return results;
}

function buildCalmQuestions() {
  const contexts = [
    "At school",
    "At home",
    "At practice",
    "At lunch",
    "On the bus",
    "At the store",
    "At a friend's house",
    "During a game",
    "While doing homework",
    "Online"
  ];

  const situations = [
    {
      text: "someone bumps into you by accident.",
      choices: ["Yell at them", "Stay calm and move on", "Push them back"],
      correct: 1,
      explanation: "Accidents happen. Calm reactions keep problems small."
    },
    {
      text: "you lose a game you wanted to win.",
      choices: ["Throw something", "Take a breath and try again later", "Blame everyone"],
      correct: 1,
      explanation: "Staying calm after losing shows self-control."
    },
    {
      text: "your plans change at the last minute.",
      choices: ["Explode", "Take a breath and adjust", "Refuse to speak"],
      correct: 1,
      explanation: "Calm people adjust instead of melting down."
    },
    {
      text: "someone says something rude.",
      choices: ["Say something mean back right away", "Pause before responding", "Start shouting"],
      correct: 1,
      explanation: "Pausing first is stronger than snapping back."
    },
    {
      text: "something feels unfair.",
      choices: ["Yell immediately", "Use a calm voice and explain", "Storm off"],
      correct: 1,
      explanation: "A calm voice gets better results."
    },
    {
      text: "you are frustrated because work is hard.",
      choices: ["Quit angrily", "Take a short break and try again", "Rip it up"],
      correct: 1,
      explanation: "A calm reset works better than a meltdown."
    },
    {
      text: "you have to wait longer than expected.",
      choices: ["Complain loudly", "Be patient and stay calm", "Make everyone miserable"],
      correct: 1,
      explanation: "Waiting is easier when you stay calm."
    },
    {
      text: "someone misunderstands what you said.",
      choices: ["Get louder and madder", "Explain calmly", "Insult them"],
      correct: 1,
      explanation: "Calm explanations solve more than angry ones."
    },
    {
      text: "your sibling annoys you on purpose.",
      choices: ["Hit or shove", "Walk away or use calm words", "Break their stuff"],
      correct: 1,
      explanation: "Walking away is smarter than exploding."
    },
    {
      text: "you make a mistake in front of others.",
      choices: ["Panic and yell", "Take a breath and fix it", "Blame someone else"],
      correct: 1,
      explanation: "Mistakes happen. Calm correction is the best move."
    }
  ];

  const results = [];

  contexts.forEach((context) => {
    situations.forEach((situation) => {
      results.push({
        question: `${context}, ${situation.text} What should you do first?`,
        choices: situation.choices,
        correct: situation.correct,
        explanation: situation.explanation
      });
    });
  });

  return results;
}
