let faceLandmarker = null;

export async function initMediaPipe() {
  if (faceLandmarker) return faceLandmarker;

  // Load MediaPipe Vision bundle dynamically
  const vision = await import(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3"
  );

  const { FaceLandmarker, FilesetResolver } = vision;

  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
    },
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  console.log("✅ MediaPipe FaceLandmarker loaded");
  return faceLandmarker;
}

export async function estimateFace(faceLandmarker, video) {
  const nowInMs = performance.now();
  const result = faceLandmarker.detectForVideo(video, nowInMs);

  if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
    return [];
  }

  return result.faceLandmarks.map((landmarks) => ({
    landmarks,
    bbox: computeBoundingBox(landmarks),
  }));
}

function computeBoundingBox(landmarks) {
  let minX = 1,
    minY = 1,
    maxX = 0,
    maxY = 0;

  landmarks.forEach((p) => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
