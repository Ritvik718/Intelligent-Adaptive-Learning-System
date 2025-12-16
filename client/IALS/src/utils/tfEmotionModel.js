import * as tf from "@tensorflow/tfjs";

const EMOTIONS = [
  "angry",
  "disgust",
  "fear",
  "happy",
  "sad",
  "surprise",
  "neutral",
];

let model = null;

// Load FER2013 emotion model (TensorFlow.js)
export async function loadEmotionModel() {
  if (model) return model;

  model = await tf.loadLayersModel("/src/assets/model/model.json");
  console.log("✅ Emotion model loaded successfully");

  return model;
}

// Predict emotion from face tensor
export async function predictEmotion(model, faceTensor) {
  if (!model || !faceTensor) {
    return { label: "neutral", confidence: 0 };
  }

  // Expected input shape: [1, 48, 48, 1]
  const input = faceTensor.expandDims(0);

  const prediction = model.predict(input);
  const probabilities = await prediction.data();

  const maxIndex = probabilities.indexOf(Math.max(...probabilities));

  return {
    label: EMOTIONS[maxIndex],
    confidence: probabilities[maxIndex],
  };
}
