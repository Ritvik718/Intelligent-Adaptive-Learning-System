import React, { useRef, useEffect, useState } from "react";
import { initMediaPipe, estimateFace } from "../utils/mediapipeClient";
import { loadEmotionModel, predictEmotion } from "../utils/tfEmotionModel";
import { EngagementAggregator } from "../utils/engagement";
import { cropFaceToTensor } from "../utils/preprocess";
import { sessionTracker } from "../utils/sessionTracker";

export default function WebcamCanvas({ onEngagementChange, onTriggerHint }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const aggRef = useRef(new EngagementAggregator({ windowSeconds: 5 }));
  const lastHintRef = useRef(0);
  const lastEmotionTime = useRef(0);

  const [emotionState, setEmotionState] = useState("neutral");

  useEffect(() => {
    let running = true;
    let faceClient, model;

    async function start() {
      const video = videoRef.current;

      // Start webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      // Wait for video readiness
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

      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      async function loop() {
        if (!running) return;

        ctx.drawImage(
          video,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const faces = await estimateFace(faceClient, video);

        if (faces.length > 0) {
          const face = faces[0];

          // Draw landmarks
          ctx.fillStyle = "lime";
          face.landmarks.forEach((p) => {
            ctx.fillRect(
              p.x * canvasRef.current.width,
              p.y * canvasRef.current.height,
              3,
              3
            );
          });

          const now = Date.now();
          if (now - lastEmotionTime.current > 700) {
            lastEmotionTime.current = now;

            // ---------- ML Emotion ----------
            const tensor = cropFaceToTensor(video, face.bbox, 48, 48);
            let { label, confidence } = await predictEmotion(model, tensor);

            console.log("[RAW MODEL]", label, confidence?.toFixed(2));

            // ---------- Geometry ----------
            const nose = face.landmarks[1];

            const topLip = face.landmarks[13];
            const bottomLip = face.landmarks[14];
            const mouthOpen = Math.abs(topLip.y - bottomLip.y);

            const leftEyeOpen = Math.abs(
              face.landmarks[159].y - face.landmarks[145].y
            );
            const rightEyeOpen = Math.abs(
              face.landmarks[386].y - face.landmarks[374].y
            );
            const eyesWide = (leftEyeOpen + rightEyeOpen) / 2;

            const eyesCentered = Math.abs(nose.x - 0.5) < 0.15;
            const lookingAway = Math.abs(nose.x - 0.5) > 0.3;

            // ---------- Heuristics (ORDER MATTERS) ----------

            // Smile → happy
            if (mouthOpen > 0.03) {
              label = "happy";
              confidence = 0.65;
            }

            // Surprise
            if (mouthOpen > 0.05 && eyesWide > 0.02) {
              label = "surprise";
              confidence = 0.7;
            }

            // Disengaged
            if (lookingAway) {
              label = "sad";
              confidence = 0.7;
            }

            // Focused / neutral
            if (mouthOpen < 0.025 && eyesCentered && confidence < 0.5) {
              label = "neutral";
              confidence = 0.6;
            }

            // Collapse rare negatives
            if (["angry", "fear", "disgust"].includes(label)) {
              label = "sad";
            }

            // ---------- State Update ----------
            setEmotionState((prev) => {
              if (label !== prev && confidence >= 0.45) {
                console.log("[STATE CHANGE]", prev, "→", label);
                return label;
              }
              return prev;
            });
          }

          // ---------- CONTINUOUS EMOTION LOGGING (FIX) ----------
          sessionTracker.addEmotion(emotionState);

          // ---------- Engagement ----------
          const emotionScore =
            emotionState === "happy" || emotionState === "surprise"
              ? 1
              : emotionState === "neutral"
              ? 0.6
              : 0.3;

          const gazeScore = Math.abs(face.landmarks[1].x - 0.5) < 0.25 ? 1 : 0;

          const instantEng = 0.6 * emotionScore + 0.4 * gazeScore;
          const avg = aggRef.current.pushFrame(instantEng);

          onEngagementChange(avg);
          sessionTracker.addEngagement(avg);

          // ---------- Hint Trigger ----------
          if (
            aggRef.current.lowSeconds >= 8 &&
            Date.now() - lastHintRef.current > 15000
          ) {
            lastHintRef.current = Date.now();
            sessionTracker.addHint("low_engagement");
            onTriggerHint();
          }
        } else {
          const avg = aggRef.current.pushFrame(0.1);
          onEngagementChange(avg);
          sessionTracker.addEngagement(avg);
          sessionTracker.addEmotion("sad");
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

  // UI label mapping
  const displayState =
    emotionState === "happy"
      ? "engaged"
      : emotionState === "surprise"
      ? "surprise"
      : emotionState === "neutral"
      ? "focused"
      : "disengaged";

  return (
    <div
      style={{
        position: "relative",
        width: "640px",
        height: "480px",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "14px",
        }}
      >
        State: <b>{displayState}</b>
      </div>
    </div>
  );
}
