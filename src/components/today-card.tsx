import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface TodayCardProps {
  completed: boolean;
  goal: number;
}

export function TodayCard({ completed, goal }: TodayCardProps) {
  const steps = completed ? goal : 0;
  const percentage = goal > 0 ? Math.round((steps / goal) * 100) : 0;

  return (
    <Card className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
      <CardHeader>
        <CardTitle className="text-zinc-400 text-sm font-normal">
          Today&apos;s Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">
            {steps.toLocaleString()}
          </span>
          <span className="text-sm text-zinc-400">
            / {goal.toLocaleString()} steps
          </span>
        </div>

        <Progress
          value={percentage}
          className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-[#2a2a2a] [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-green-500 [&_[data-slot=progress-indicator]]:to-yellow-500"
          aria-label="Step progress"
        />

        <Badge
          className={
            completed
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-zinc-700/50 text-zinc-400 border-zinc-600/30"
          }
        >
          {completed ? "Complete" : "Incomplete"}
        </Badge>
      </CardContent>
    </Card>
  );
}
