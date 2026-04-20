export interface WeeklyViewProps {
  entries: Array<{ date: string; completed: boolean; dayLabel: string }>;
  completedCount: number;
  totalDays: number;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WeeklyView({
  entries,
  completedCount,
  totalDays,
}: WeeklyViewProps) {
  return (
    <div className="rounded-2xl bg-[#111111] px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">This Week</h2>
        <span className="text-sm font-bold text-[#00d4ff]">
          {completedCount}/{totalDays}
        </span>
      </div>

      <div className="flex flex-col divide-y divide-[#1a1a1a]">
        {entries.map((entry) => (
          <div
            key={entry.date}
            className={`flex items-center gap-3 py-3 ${
              entry.completed ? "border-l-2 border-l-[#00d4ff] pl-3" : "pl-[calc(0.75rem+2px)]"
            }`}
          >
            {/* Checkbox */}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                entry.completed
                  ? "bg-[#00d4ff]"
                  : "border-2 border-[#333333] bg-transparent"
              }`}
              role="checkbox"
              aria-checked={entry.completed}
              aria-label={`${entry.dayLabel} ${entry.completed ? "completed" : "not completed"}`}
            >
              {entry.completed && (
                <span className="text-sm font-bold text-black">✓</span>
              )}
            </div>

            {/* Day info */}
            <div className="flex flex-1 flex-col">
              <span
                className={`text-sm font-semibold ${
                  entry.completed ? "text-white" : "text-[#666666]"
                }`}
              >
                {entry.dayLabel}
              </span>
              <span className="text-xs text-[#666666]">
                {formatShortDate(entry.date)}
              </span>
            </div>

            {/* Status badge */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                entry.completed
                  ? "bg-[#00d4ff]/15 text-[#00d4ff]"
                  : "bg-[#1a1a1a] text-[#666666]"
              }`}
            >
              {entry.completed ? "Done" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
