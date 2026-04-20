import {
  getStepsData,
  getTodayStatus,
  getWeeklyEntries,
  getStreak,
  getWeeklyCompletion,
} from "@/lib/steps";
import { ProgressRing } from "@/components/progress-ring";
import { WeeklyView } from "@/components/weekly-view";
import { StreakCounter } from "@/components/streak-counter";
import { GoalCard } from "@/components/goal-card";

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const data = getStepsData();
  const todayCompleted = getTodayStatus(data);
  const weeklyEntries = getWeeklyEntries(data);
  const streak = getStreak(data);
  const weeklyCompletion = getWeeklyCompletion(data);

  const percentage = todayCompleted ? 100 : 0;

  const entries = weeklyEntries.map((entry) => ({
    date: entry.date,
    completed: entry.completed,
    dayLabel: DAY_LABELS[new Date(entry.date + "T00:00:00").getDay()],
  }));

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-lg font-semibold tracking-wide text-[#666666]">
          Steps Tracker
        </h1>
        <p className="mt-1 text-sm text-[#444444]">{formatTodayDate()}</p>
      </header>

      {/* Progress Ring */}
      <div className="mb-8">
        <ProgressRing
          completed={todayCompleted}
          goal={data.goal}
          percentage={percentage}
        />
      </div>

      {/* Stats Row */}
      <div className="mb-8 flex w-full items-center justify-center gap-8">
        <StreakCounter streak={streak} />
        <div className="h-8 w-px bg-[#1a1a1a]" />
        <GoalCard goal={data.goal} />
      </div>

      {/* Completion summary */}
      <p className="mb-6 text-sm text-[#666666]">
        <span className="font-bold text-[#00d4ff]">
          {weeklyCompletion.completed}/{weeklyCompletion.total}
        </span>{" "}
        this week
      </p>

      {/* Weekly Checklist */}
      <div className="w-full">
        <WeeklyView
          entries={entries}
          completedCount={weeklyCompletion.completed}
          totalDays={weeklyCompletion.total}
        />
      </div>
    </main>
  );
}
