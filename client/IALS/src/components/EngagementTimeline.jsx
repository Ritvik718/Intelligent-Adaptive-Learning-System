import React from "react";
import { useEffect, useRef } from "react";
import { sessionTracker } from "../utils/sessionTracker";

export default function EngagementTimeline() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const data = sessionTracker
        .getEngagements()
        .slice(-60)
        .filter((v) => typeof v === "number" && !isNaN(v));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (data.length < 2) return;

      const paddingTop = 20;
      const paddingBottom = 30;
      const paddingX = 20;

      const w = canvas.width - paddingX * 2;
      const h = canvas.height - paddingTop - paddingBottom;

      // ─── GRID (fixed reference levels) ───
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;

      const levels = [
        { y: 0.2, label: "Low" },
        { y: 0.5, label: "Neutral" },
        { y: 0.8, label: "High" },
      ];

      levels.forEach((lvl) => {
        const y = paddingTop + h - lvl.y * h;
        ctx.beginPath();
        ctx.moveTo(paddingX, y);
        ctx.lineTo(canvas.width - paddingX, y);
        ctx.stroke();
      });

      // ─── MAP DATA (0 → 1 scale) ───
      const points = data.map((v, i) => {
        const clamped = Math.min(1, Math.max(0, v));

        const x = paddingX + (i / (data.length - 1)) * w;

        const y = paddingTop + h - clamped * h;

        return { x, y };
      });

      // ─── SMOOTH CURVE ───
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;

        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }

      // ─── STROKE ───
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(99,102,241,0.6)";
      ctx.shadowBlur = 10;
      ctx.stroke();

      // ─── FILL GRADIENT ───
      ctx.shadowBlur = 0;

      const gradient = ctx.createLinearGradient(
        0,
        paddingTop,
        0,
        canvas.height
      );

      gradient.addColorStop(0, "rgba(99,102,241,0.35)");
      gradient.addColorStop(1, "rgba(99,102,241,0.05)");

      ctx.lineTo(points[points.length - 1].x, canvas.height - paddingBottom);
      ctx.lineTo(points[0].x, canvas.height - paddingBottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const interval = setInterval(draw, 400);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
