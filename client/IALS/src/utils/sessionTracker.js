class SessionTracker {
  constructor() {
    this.engagements = [];
    this.emotions = [];
    this.hints = [];

    // Quiz / interaction tracking (can be reused later)
    this.quizAttempts = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
  }

  // ---------- ENGAGEMENT ----------
  addEngagement(value) {
    if (typeof value === "number" && !isNaN(value)) {
      this.engagements.push(value);
    }
  }

  getEngagements() {
    return this.engagements;
  }

  // ---------- EMOTIONS ----------
  addEmotion(emotion) {
    if (emotion) this.emotions.push(emotion);
  }

  getEmotionStats() {
    const stats = {};
    this.emotions.forEach((e) => {
      stats[e] = (stats[e] || 0) + 1;
    });
    return stats;
  }

  // ---------- HINTS ----------
  addHint(reason) {
    this.hints.push({ reason, time: Date.now() });
  }

  getHints() {
    return this.hints;
  }

  // ---------- QUIZ / INTERACTIONS ----------
  addQuizResult(isCorrect) {
    this.quizAttempts += 1;
    isCorrect ? this.correctAnswers++ : this.wrongAnswers++;
  }

  getQuizStats() {
    return {
      attempts: this.quizAttempts,
      correct: this.correctAnswers,
      wrong: this.wrongAnswers,
      accuracy:
        this.quizAttempts === 0 ? 0 : this.correctAnswers / this.quizAttempts,
    };
  }

  reset() {
    this.engagements = [];
    this.emotions = [];
    this.hints = [];
    this.quizAttempts = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
  }
}

export const sessionTracker = new SessionTracker();
