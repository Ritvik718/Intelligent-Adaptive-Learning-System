export class EngagementAggregator {
  constructor({ windowSeconds = 6, fps = 10 } = {}) {
    this.windowSize = Math.round(windowSeconds * fps);
    this.buffer = [];
    this.lowThreshold = 0.4;
    this.lowSeconds = 0;
    this.fps = fps;
  }

  pushFrame(v) {
    this.buffer.push(v);
    if (this.buffer.length > this.windowSize) this.buffer.shift();
    const avg = this.buffer.reduce((a, b) => a + b, 0) / this.buffer.length;
    const lowFrames = this.buffer.filter((x) => x < this.lowThreshold).length;
    this.lowSeconds = lowFrames / this.fps;
    return avg;
  }
}
