"use client";

export interface ProgressRingProps {
  completed: boolean;
  goal: number;
  percentage: number;
}

export function ProgressRing({ completed, goal, percentage }: ProgressRingProps) {
  const size = 240;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-[0_0_20px_rgba(0,212,255,0.3)]"
        style={
          {
            "--ring-circumference": circumference,
            "--ring-offset": offset,
          } as React.CSSProperties
        }
      >
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#0088ff" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter="url(#glow)"
          style={{
            transition: "stroke-dashoffset 0.6s ease-out",
          }}
        />

        {/* Center icon */}
        <text
          x="50%"
          y="42%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={completed ? "#00d4ff" : "#666666"}
          fontSize="48"
          fontWeight="800"
        >
          {completed ? "✓" : "✗"}
        </text>

        {/* Status text */}
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize="16"
          fontWeight="600"
        >
          {completed ? "Complete" : "Not yet"}
        </text>

        {/* Goal text */}
        <text
          x="50%"
          y="70%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#666666"
          fontSize="12"
          fontWeight="400"
        >
          GOAL: {goal.toLocaleString()}
        </text>
      </svg>
    </div>
  );
}
