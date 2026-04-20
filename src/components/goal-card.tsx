export interface GoalCardProps {
  goal: number;
}

export function GoalCard({ goal }: GoalCardProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl" role="img" aria-label="Target">
          🎯
        </span>
        <span className="text-3xl font-extrabold text-white">
          {goal.toLocaleString()}
        </span>
      </div>
      <span className="text-xs text-[#666666]">daily goal</span>
    </div>
  );
}
