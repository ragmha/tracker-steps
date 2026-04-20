import { Card, CardContent } from "@/components/ui/card";

export interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <Card className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
      <CardContent className="flex items-center gap-3">
        <span className="text-3xl" role="img" aria-label="Fire">
          🔥
        </span>
        <div>
          <span className="text-4xl font-bold">{streak}</span>
          <span className="text-sm text-zinc-400 ml-2">day streak</span>
        </div>
      </CardContent>
    </Card>
  );
}
