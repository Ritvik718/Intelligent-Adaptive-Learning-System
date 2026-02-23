import React, { useRef, useEffect, useState } from "react";
import { initMediaPipe, estimateFace } from "../utils/mediapipeClient";
import { loadEmotionModel, predictEmotion } from "../utils/tfEmotionModel";
import { EngagementAggregator } from "../utils/engagement";
import { cropFaceToTensor } from "../utils/preprocess";
import { sessionTracker } from "../utils/sessionTracker";

export default function WebcamCanvas({ onEngagementChange, onTriggerHint }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 🔥 More sensitive window (3s instead of 5s)
  const aggRef = useRef(new EngagementAggregator({ windowSeconds: 3 }));

  const lastHintRef = useRef(0);
  const lastEmotionTime = useRef(0);
  const lastFaceSeenRef = useRef(Date.now());

  const previousEmotion = useRef("neutral");
  const prevMouth = useRef(0);
  const prevEyes = useRef(0);

  const [emotionState, setEmotionState] = useState("neutral");
  const lastDetectedEmotion = useRef("neutral");

  useEffect(() => {
    let running = true;
    let faceClient, model;

    async function start() {
      const video = videoRef.current;

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      await new Promise((resolve) => {
        const check = setInterval(() => {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });

      faceClient = await initMediaPipe();
      model = await loadEmotionModel();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      async function loop() {
        if (!running) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const faces = await estimateFace(faceClient, video);
        const now = Date.now();

        if (faces.length > 0) {
          lastFaceSeenRef.current = now;
          const face = faces[0];

          // Draw landmarks
          ctx.fillStyle = "lime";
          face.landmarks.forEach((p) => {
            ctx.fillRect(p.x * canvas.width, p.y * canvas.height, 3, 3);
          });

          // 🔥 Faster emotion update (300ms)
          if (now - lastEmotionTime.current > 300) {
            lastEmotionTime.current = now;

            const tensor = cropFaceToTensor(video, face.bbox, 48, 48);
            let { label, confidence } = await predictEmotion(model, tensor);

            const nose = face.landmarks[1];
            const mouthOpen = Math.abs(
              face.landmarks[13].y - face.landmarks[14].y,
            );

            const eyesWide =
              (Math.abs(face.landmarks[159].y - face.landmarks[145].y) +
                Math.abs(face.landmarks[386].y - face.landmarks[374].y)) /
              2;

            const eyesCentered = Math.abs(nose.x - 0.5) < 0.15;
            const lookingAway = Math.abs(nose.x - 0.5) > 0.3;

            // 🔥 Micro-expression boost
            const microChange =
              Math.abs(mouthOpen - prevMouth.current) > 0.015 ||
              Math.abs(eyesWide - prevEyes.current) > 0.01;

            prevMouth.current = mouthOpen;
            prevEyes.current = eyesWide;

            // Heuristics
            if (mouthOpen > 0.05 && eyesWide > 0.02) {
              label = "surprise";
              confidence = 0.75;
            } else if (mouthOpen > 0.03) {
              label = "happy";
              confidence = 0.65;
            } else if (lookingAway) {
              label = "sad";
              confidence = 0.7;
            } else if (mouthOpen < 0.025 && eyesCentered) {
              label = "neutral";
              confidence = 0.6;
            }

            if (["angry", "fear", "disgust"].includes(label)) {
              label = "sad";
            }

            // 🔥 Momentum boost
            if (label !== previousEmotion.current) {
              confidence += 0.1;
            }

            if (microChange) {
              confidence += 0.1;
            }

            previousEmotion.current = label;
            lastDetectedEmotion.current = label;

            // 🔥 Lower confidence threshold (0.35)
            setEmotionState((prev) => {
              if (label !== prev && confidence >= 0.35) {
                return label;
              }
              return prev;
            });
          }

          sessionTracker.addEmotion(lastDetectedEmotion.current);

          // 🔥 Emotion more sensitive (0.7 weight)
          const emotionScore =
            emotionState === "happy" || emotionState === "surprise"
              ? 1
              : emotionState === "neutral"
                ? 0.6
                : 0.3;

          const gazeScore = Math.abs(face.landmarks[1].x - 0.5) < 0.25 ? 1 : 0;

          const instantEng = 0.7 * emotionScore + 0.3 * gazeScore;
          const avg = aggRef.current.pushFrame(instantEng);

          onEngagementChange(avg);
          sessionTracker.addEngagement(avg);

          if (
            aggRef.current.lowSeconds >= 8 &&
            now - lastHintRef.current > 15000
          ) {
            lastHintRef.current = now;
            sessionTracker.addHint("low_engagement");
            onTriggerHint();
          }
        } else {
          // 🚨 No face detected for >2s
          if (now - lastFaceSeenRef.current > 2000) {
            lastDetectedEmotion.current = "sad";
            setEmotionState("sad");
            sessionTracker.addEmotion("sad");
          }

          const avg = aggRef.current.pushFrame(0.1);
          onEngagementChange(avg);
          sessionTracker.addEngagement(avg);
        }

        requestAnimationFrame(loop);
      }

      loop();
    }

    start();
    return () => {
      running = false;
    };
  }, [onEngagementChange, onTriggerHint, emotionState]);

  const displayState =
    emotionState === "happy"
      ? "engaged"
      : emotionState === "surprise"
        ? "surprise"
        : emotionState === "neutral"
          ? "focused"
          : "disengaged";

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]"
      />

      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-md text-xs">
        State: <b>{displayState}</b>
      </div>
    </div>
  );
}
