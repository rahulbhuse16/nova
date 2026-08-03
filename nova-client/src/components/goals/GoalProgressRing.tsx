"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface GoalProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

export function GoalProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  color = "url(#gradient)",
  backgroundColor = "rgba(71, 85, 105, 0.3)",
}: GoalProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getGradientColor = (progress: number) => {
    if (progress >= 75) return ["#10b981", "#34d399"];
    if (progress >= 50) return ["#6366f1", "#818cf8"];
    if (progress >= 25) return ["#f59e0b", "#fbbf24"];
    return ["#ef4444", "#f87171"];
  };

  const gradientColors = getGradientColor(progress);
  const gradientId = `gradient-${progress}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-white">{progress}%</span>
      </div>
    </div>
  );
}
