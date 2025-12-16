import * as tf from "@tensorflow/tfjs";

export function cropFaceToTensor(video, bbox, w = 48, h = 48) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;

  // Clamp bounding box to video bounds
  const x = Math.max(0, bbox.x * vw);
  const y = Math.max(0, bbox.y * vh);
  const width = Math.min(vw - x, bbox.width * vw);
  const height = Math.min(vh - y, bbox.height * vh);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(video, x, y, width, height, 0, 0, w, h);

  return tf.tidy(() => {
    const img = ctx.getImageData(0, 0, w, h);

    // Convert to [48,48,1] normalized grayscale tensor
    return tf.browser.fromPixels(img).mean(2).expandDims(-1).toFloat().div(255);
  });
}
