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
}
