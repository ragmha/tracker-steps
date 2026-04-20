import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface WeeklyViewProps {
  entries: Array<{ date: string; completed: boolean; dayLabel: string }>;
  completedCount: number;
  totalDays: number;
}

export function WeeklyView({
  entries,
  completedCount,
  totalDays,
}: WeeklyViewProps) {
  return (
    <Card className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
      <CardHeader>
        <CardTitle className="text-zinc-400 text-sm font-normal">
          This Week{" "}
          <span className="text-white font-semibold">
            {completedCount}/{totalDays}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {entries.map((entry) => (
            <div
              key={entry.date}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-full h-16 rounded-md flex items-center justify-center ${
                  entry.completed
                    ? "bg-gradient-to-t from-green-500 to-yellow-500"
                    : "bg-[#2a2a2a]"
                }`}
              >
                {entry.completed && (
                  <span className="text-white text-lg" aria-label="Completed">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-400">{entry.dayLabel}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
