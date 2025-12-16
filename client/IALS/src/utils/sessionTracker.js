class SessionTracker {
  constructor() {
    this.engagements = [];
    this.emotions = {};
    this.hints = [];
  }

  // ---- ENGAGEMENT ----
  addEngagement(value) {
    if (typeof value === "number" && !isNaN(value)) {
      this.engagements.push(value);

      // limit size to avoid memory leak
      if (this.engagements.length > 200) {
        this.engagements.shift();
      }
    }
  }

  getEngagements() {
    return [...this.engagements];
  }

  // ---- EMOTIONS ----
  addEmotion(emotion) {
    if (!emotion) return;

    if (!this.emotions[emotion]) {
      this.emotions[emotion] = 0;
    }
    this.emotions[emotion]++;
  }

  getEmotions() {
    return { ...this.emotions };
  }

  // ---- HINTS ----
  addHint(type) {
    this.hints.push({
      type,
      time: Date.now(),
    });
  }

  getHints() {
    return [...this.hints];
  }

  reset() {
    this.engagements = [];
    this.emotions = {};
    this.hints = [];
  }
}

export const sessionTracker = new SessionTracker();
