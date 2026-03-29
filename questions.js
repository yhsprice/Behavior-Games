const allQuestions = {
  interrupting: buildInterruptingQuestions(),
  kindness: buildKindnessQuestions(),
  calm: buildCalmQuestions(),
  honesty: buildHonestyQuestions(),
  respect: buildRespectQuestions(),
  responsibility: buildResponsibilityQuestions(),
  teasing: buildTeasingQuestions(),
  online: buildOnlineQuestions()
};

function combineQuestions(starters, situations, endingText) {
  const results = [];
  starters.forEach((starter) => {
    situations.forEach((situation) => {
      results.push({
        question: `${starter}, ${situation.text} ${endingText}`,
        choices: situation.choices,
        correct: situation.correct,
        explanation: situation.explanation
      });
    });
  });
  return results;
}

function buildInterruptingQuestions() {
  const starters = [
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

  const situations = [
    { text: "you dropped your pencil", choices: ["Interrupt right away", "Wait until they finish", "Start talking to a friend instead"], correct: 1, explanation: "This is not urgent. Waiting shows respect." },
    { text: "you want to ask for a snack", choices: ["Interrupt immediately", "Wait for a pause or say excuse me", "Whine until noticed"], correct: 1, explanation: "A snack is not an emergency." },
    { text: "you forgot your homework at home", choices: ["Interrupt right away", "Wait until there is a good time", "Blame someone else loudly"], correct: 1, explanation: "This matters, but it can wait for a better moment." },
    { text: "you want to tell a joke", choices: ["Say it right away", "Wait until later", "Talk over the speaker"], correct: 1, explanation: "Timing matters." },
    { text: "you need to know what time lunch is", choices: ["Interrupt right away", "Wait for a pause", "Ask someone else by yelling"], correct: 1, explanation: "That question can wait." },
    { text: "you suddenly feel very sick", choices: ["Wait quietly", "Interrupt and tell them", "Say nothing"], correct: 1, explanation: "Health and safety are good reasons to interrupt." },
    { text: "you see smoke coming from a trash can", choices: ["Wait until later", "Interrupt and warn an adult", "Ignore it"], correct: 1, explanation: "Danger beats manners." },
    { text: "someone is about to trip over a backpack", choices: ["Interrupt and warn them", "Wait to see what happens", "Laugh"], correct: 0, explanation: "Preventing injury is important." },
    { text: "someone is about to touch a hot pan", choices: ["Interrupt and warn them", "Stay quiet", "Let them find out"], correct: 0, explanation: "Safety comes first." },
    { text: "you see a younger child running toward the street", choices: ["Interrupt and alert an adult", "Wait your turn", "Keep watching"], correct: 0, explanation: "This is urgent." }
  ];

  return combineQuestions(starters, situations, "What should you do?");
}

function buildKindnessQuestions() {
  const starters = [
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
    { text: "someone drops their books", choices: ["Laugh", "Walk away", "Help pick them up"], correct: 2, explanation: "Helping someone is a kind choice." },
    { text: "a classmate is sitting alone", choices: ["Ignore them", "Invite them to join you", "Tell others not to sit there"], correct: 1, explanation: "Including others is kind." },
    { text: "your friend loses a game", choices: ["Brag about winning", "Say something encouraging", "Make fun of them"], correct: 1, explanation: "Kindness matters most when someone feels bad." },
    { text: "someone makes a small mistake", choices: ["Tease them", "Stay calm and be respectful", "Tell everyone"], correct: 1, explanation: "Kind people do not pile on when someone slips up." },
    { text: "a new kid looks nervous", choices: ["Stare at them", "Say hello and be welcoming", "Whisper about them"], correct: 1, explanation: "A small welcome can change someone's whole day." },
    { text: "your sibling worked hard on something", choices: ["Ignore it", "Say something supportive", "Say yours is better"], correct: 1, explanation: "Supporting others is a kind habit." },
    { text: "someone forgets their lunch", choices: ["Say that's their problem", "Offer help or share if allowed", "Announce it to everyone"], correct: 1, explanation: "Helping when you can is kind." },
    { text: "a friend is upset", choices: ["Change the subject", "Listen and be kind", "Tell them to get over it"], correct: 1, explanation: "Listening kindly helps people feel safe." },
    { text: "someone asks for help with directions", choices: ["Point the wrong way as a joke", "Help them if you can", "Pretend not to hear"], correct: 1, explanation: "Kindness includes simple helpful actions." },
    { text: "a teammate misses a shot", choices: ["Blame them", "Encourage them", "Roll your eyes"], correct: 1, explanation: "Encouragement is kinder than blame." }
  ];

  return combineQuestions(starters, situations, "What is the kindest choice?");
}

function buildCalmQuestions() {
  const starters = [
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
    { text: "someone bumps into you by accident", choices: ["Yell at them", "Stay calm and move on", "Push them back"], correct: 1, explanation: "Accidents happen. Calm reactions keep problems small." },
    { text: "you lose a game you wanted to win", choices: ["Throw something", "Take a breath and try again later", "Blame everyone"], correct: 1, explanation: "Staying calm after losing shows self-control." },
    { text: "your plans change at the last minute", choices: ["Explode", "Take a breath and adjust", "Refuse to speak"], correct: 1, explanation: "Calm people adjust instead of melting down." },
    { text: "someone says something rude", choices: ["Say something mean back right away", "Pause before responding", "Start shouting"], correct: 1, explanation: "Pausing first is stronger than snapping back." },
    { text: "something feels unfair", choices: ["Yell immediately", "Use a calm voice and explain", "Storm off"], correct: 1, explanation: "A calm voice gets better results." },
    { text: "you are frustrated because work is hard", choices: ["Quit angrily", "Take a short break and try again", "Rip it up"], correct: 1, explanation: "A calm reset works better than a meltdown." },
    { text: "you have to wait longer than expected", choices: ["Complain loudly", "Be patient and stay calm", "Make everyone miserable"], correct: 1, explanation: "Waiting is easier when you stay calm." },
    { text: "someone misunderstands what you said", choices: ["Get louder and madder", "Explain calmly", "Insult them"], correct: 1, explanation: "Calm explanations solve more than angry ones." },
    { text: "your sibling annoys you on purpose", choices: ["Hit or shove", "Walk away or use calm words", "Break their stuff"], correct: 1, explanation: "Walking away is smarter than exploding." },
    { text: "you make a mistake in front of others", choices: ["Panic and yell", "Take a breath and fix it", "Blame someone else"], correct: 1, explanation: "Mistakes happen. Calm correction is the best move." }
  ];

  return combineQuestions(starters, situations, "What should you do first?");
}

function buildHonestyQuestions() {
  const starters = [
    "At school",
    "At home",
    "At lunch",
    "On the bus",
    "At practice",
    "At the store",
    "At a friend's house",
    "During homework time",
    "In a group project",
    "Online"
  ];

  const situations = [
    { text: "you broke something by accident", choices: ["Hide it and say nothing", "Tell the truth", "Blame someone else"], correct: 1, explanation: "Honesty builds trust." },
    { text: "you forgot to do something important", choices: ["Make up an excuse", "Be honest about it", "Pretend you already did it"], correct: 1, explanation: "Owning mistakes is stronger than covering them up." },
    { text: "you got caught doing something you should not have done", choices: ["Lie quickly", "Tell the truth", "Change the subject"], correct: 1, explanation: "Truth is the better path, even when awkward." },
    { text: "you found money that is not yours", choices: ["Keep it", "Turn it in or tell an adult", "Hide it"], correct: 1, explanation: "Honest people return what is not theirs." },
    { text: "your friend wants you to lie for them", choices: ["Lie to help them", "Tell them no", "Half-lie"], correct: 1, explanation: "Helping someone lie is still lying." },
    { text: "you accidentally copied someone’s answer", choices: ["Pretend it was fine", "Admit it", "Say they copied you"], correct: 1, explanation: "Being honest fixes problems faster." },
    { text: "you said you cleaned up but did not", choices: ["Keep pretending", "Tell the truth", "Blame your sibling"], correct: 1, explanation: "Trust grows when your words match your actions." },
    { text: "you spilled something and no one saw", choices: ["Walk away", "Tell someone and clean it up", "Say the pet did it"], correct: 1, explanation: "Honesty includes doing the right thing when no one is watching." },
    { text: "you already know the answer to a question because you peeked", choices: ["Act proud", "Be honest", "Stay quiet and keep the advantage"], correct: 1, explanation: "Integrity matters more than looking smart." },
    { text: "you told a story that was not true to sound cool", choices: ["Keep it going", "Admit you made it up", "Add more fake details"], correct: 1, explanation: "Honesty matters even in small stories." }
  ];

  return combineQuestions(starters, situations, "What is the most honest choice?");
}

function buildRespectQuestions() {
  const starters = [
    "At school",
    "At home",
    "At lunch",
    "On the bus",
    "At practice",
    "At the library",
    "At a friend's house",
    "During class",
    "At a store",
    "Online"
  ];

  const situations = [
    { text: "someone else is talking", choices: ["Talk over them", "Listen and wait your turn", "Roll your eyes"], correct: 1, explanation: "Respect starts with listening." },
    { text: "you do not agree with someone", choices: ["Insult them", "Use respectful words", "Mock them"], correct: 1, explanation: "You can disagree without being rude." },
    { text: "an adult gives you a direction", choices: ["Ignore them", "Respond respectfully", "Argue loudly"], correct: 1, explanation: "Respect includes how you respond." },
    { text: "someone is using something you want", choices: ["Grab it", "Wait and ask respectfully", "Complain"], correct: 1, explanation: "Respect means not acting entitled." },
    { text: "a friend says no", choices: ["Keep pushing", "Respect their answer", "Make fun of them"], correct: 1, explanation: "Respect includes accepting boundaries." },
    { text: "someone likes something different from you", choices: ["Call it stupid", "Respect their opinion", "Laugh at them"], correct: 1, explanation: "Different does not mean wrong." },
    { text: "you are in a quiet place", choices: ["Be loud anyway", "Use a quiet voice", "Bang things around"], correct: 1, explanation: "Respect changes with the setting." },
    { text: "someone makes a mistake", choices: ["Embarrass them", "Be respectful", "Tell everyone"], correct: 1, explanation: "Respect matters most when someone is already uncomfortable." },
    { text: "another person is waiting in line", choices: ["Cut in front", "Wait your turn", "Push ahead"], correct: 1, explanation: "Respect includes fairness." },
    { text: "someone asks you to stop", choices: ["Keep doing it", "Stop", "Do it more"], correct: 1, explanation: "Respect means taking people seriously." }
  ];

  return combineQuestions(starters, situations, "What is the most respectful choice?");
}

function buildResponsibilityQuestions() {
  const starters = [
    "At school",
    "At home",
    "At lunch",
    "On the bus",
    "At practice",
    "After school",
    "At a friend's house",
    "During homework time",
    "In your room",
    "Online"
  ];

  const situations = [
    { text: "you make a mess", choices: ["Leave it", "Clean it up", "Wait for someone else"], correct: 1, explanation: "Responsibility means handling your own mess." },
    { text: "you borrow something", choices: ["Forget about it", "Return it properly", "Keep it"], correct: 1, explanation: "Responsible people return what they borrow." },
    { text: "you have homework due", choices: ["Ignore it", "Work on it", "Pretend you forgot on purpose"], correct: 1, explanation: "Responsibility means doing what needs to be done." },
    { text: "you said you would help", choices: ["Disappear", "Follow through", "Make excuses"], correct: 1, explanation: "Doing what you said matters." },
    { text: "you notice your stuff is left out", choices: ["Leave it there", "Put it away", "Kick it aside"], correct: 1, explanation: "Taking care of your things is responsibility." },
    { text: "you are running late", choices: ["Blame everyone", "Get ready faster next time and be honest", "Ignore it"], correct: 1, explanation: "Responsibility includes owning your time." },
    { text: "your pet needs care", choices: ["Pretend someone else will do it", "Take care of it", "Forget"], correct: 1, explanation: "Living things depend on responsible choices." },
    { text: "you make a mistake in a group", choices: ["Hide it", "Own it and help fix it", "Blame someone else"], correct: 1, explanation: "Responsibility includes fixing what you can." },
    { text: "you promised to charge a device or pack something", choices: ["Hope it works out", "Do it when you should", "Say it is not your fault"], correct: 1, explanation: "Planning ahead is responsibility." },
    { text: "you finish using something shared", choices: ["Leave it messy", "Put it back properly", "Walk away"], correct: 1, explanation: "Shared spaces need responsible habits." }
  ];

  return combineQuestions(starters, situations, "What is the most responsible choice?");
}

function buildTeasingQuestions() {
  const starters = [
    "At school",
    "At home",
    "At lunch",
    "On the bus",
    "At practice",
    "During recess",
    "At a party",
    "In a group chat",
    "At a friend's house",
    "Online"
  ];

  const situations = [
    { text: "someone looks different today", choices: ["Tease them", "Say nothing rude", "Get others to laugh"], correct: 1, explanation: "Teasing people about appearance is not okay." },
    { text: "your friend messes up a word", choices: ["Mock them", "Let it go", "Repeat it to embarrass them"], correct: 1, explanation: "Not every mistake needs an audience." },
    { text: "someone is bad at a game", choices: ["Call them names", "Be decent", "Make a joke at their expense"], correct: 1, explanation: "Being better at something is not permission to be mean." },
    { text: "you think a joke is funny but they do not", choices: ["Keep going", "Stop", "Do it louder"], correct: 1, explanation: "If it hurts someone, it is not harmless teasing." },
    { text: "others start making fun of someone", choices: ["Join in", "Do not pile on", "Add a nickname"], correct: 1, explanation: "Following a crowd into mean behavior is still mean behavior." },
    { text: "your sibling is already upset", choices: ["Tease them more", "Back off", "Copy them to annoy them"], correct: 1, explanation: "Teasing upset people usually makes things worse." },
    { text: "someone asks you to stop joking about them", choices: ["Say they are too sensitive", "Stop", "Keep doing it"], correct: 1, explanation: "When someone says stop, stop." },
    { text: "you want attention from the group", choices: ["Make someone the joke", "Say something without hurting anyone", "Embarrass a friend"], correct: 1, explanation: "Attention is not worth making someone feel small." },
    { text: "someone makes a simple mistake", choices: ["Turn it into a running joke", "Move on respectfully", "Bring it up all day"], correct: 1, explanation: "Dragging things out becomes mean fast." },
    { text: "you think your joke is harmless", choices: ["Say it anyway", "Check whether it is kind first", "Post it publicly"], correct: 1, explanation: "Funny is not a free pass." }
  ];

  return combineQuestions(starters, situations, "What should you do?");
}

function buildOnlineQuestions() {
  const starters = [
    "Online in a game",
    "In a group chat",
    "On a video call",
    "While texting",
    "On a class website",
    "On social media",
    "In a comment section",
    "While messaging a friend",
    "In a shared online document",
    "During virtual class"
  ];

  const situations = [
    { text: "someone sends a mean message", choices: ["Send one back", "Pause and respond safely or tell an adult", "Post it publicly"], correct: 1, explanation: "Online problems get worse fast when you react badly." },
    { text: "you want to post a picture of someone else", choices: ["Post it without asking", "Ask first", "Post it to embarrass them"], correct: 1, explanation: "Respect and permission matter online too." },
    { text: "someone shares private information", choices: ["Forward it", "Do not share it", "Screenshot it for jokes"], correct: 1, explanation: "Private means private." },
    { text: "you are angry while typing", choices: ["Hit send immediately", "Pause before sending", "Type more mean things"], correct: 1, explanation: "A pause online saves a lot of trouble." },
    { text: "someone is being left out online", choices: ["Join in", "Be kind", "Add mean emojis"], correct: 1, explanation: "Online kindness still counts." },
    { text: "a stranger asks for personal information", choices: ["Give it", "Do not share it", "Send even more"], correct: 1, explanation: "Personal information should be protected." },
    { text: "you see a rumor spreading", choices: ["Pass it on", "Do not share it", "Make it bigger"], correct: 1, explanation: "Spreading rumors online is still harmful." },
    { text: "someone makes a mistake on video", choices: ["Clip it and post it", "Let it go", "Mock them in chat"], correct: 1, explanation: "Embarrassing people online is not harmless." },
    { text: "you disagree with a post", choices: ["Insult the person", "Respond respectfully or move on", "Start a fight"], correct: 1, explanation: "You do not have to become a keyboard tornado." },
    { text: "you want to use someone else’s work", choices: ["Pretend it is yours", "Give credit or ask", "Copy it quietly"], correct: 1, explanation: "Honesty and respect matter online too." }
  ];

  return combineQuestions(starters, situations, "What is the best choice?");
}
