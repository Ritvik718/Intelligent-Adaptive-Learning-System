class SessionTracker {
  constructor() {
    this.engagementHistory = [];
    this.emotionCounts = {};
    this.hints = [];
  }

  addEngagement(value) {
    this.engagementHistory.push({
      time: Date.now(),
      value,
    });
  }

  addEmotion(emotion) {
    this.emotionCounts[emotion] = (this.emotionCounts[emotion] || 0) + 1;
  }

  addHint(reason = "low_engagement") {
    this.hints.push({
      time: Date.now(),
      reason,
    });
  }

  getSummary() {
    return {
      engagementHistory: this.engagementHistory,
      emotionCounts: this.emotionCounts,
      hints: this.hints,
    };
  }
}

export const sessionTracker = new SessionTracker();
