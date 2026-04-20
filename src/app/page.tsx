import {
  getStepsData,
  getTodayStatus,
  getWeeklyEntries,
  getStreak,
  getWeeklyCompletion,
} from "@/lib/steps";
import { TodayCard } from "@/components/today-card";
import { WeeklyView } from "@/components/weekly-view";
import { StreakCounter } from "@/components/streak-counter";
import { GoalCard } from "@/components/goal-card";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const data = getStepsData();
  const todayCompleted = getTodayStatus(data);
  const weeklyEntries = getWeeklyEntries(data);
  const streak = getStreak(data);
  const weeklyCompletion = getWeeklyCompletion(data);

  const entries = weeklyEntries.map((entry) => ({
    date: entry.date,
    completed: entry.completed,
    dayLabel: DAY_LABELS[new Date(entry.date + "T00:00:00").getDay()],
  }));

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Steps Tracker</h1>
        <p className="mt-1 text-sm text-zinc-400">{formatTodayDate()}</p>
      </header>

      <div className="space-y-4">
        <TodayCard completed={todayCompleted} goal={data.goal} />
        <WeeklyView
          entries={entries}
          completedCount={weeklyCompletion.completed}
          totalDays={weeklyCompletion.total}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StreakCounter streak={streak} />
          <GoalCard goal={data.goal} />
        </div>
      </div>
    </main>
  );
}
