export interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl" role="img" aria-label="Fire">
          🔥
        </span>
        <span className="text-3xl font-extrabold text-white">{streak}</span>
      </div>
      <span className="text-xs text-[#666666]">day streak</span>
    </div>
  );
}
