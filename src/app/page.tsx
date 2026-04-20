import {
  getStepsData,
  getWeeklyEntries,
} from "@/lib/steps";
import { Dashboard } from "@/components/dashboard";

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
  const weeklyEntries = getWeeklyEntries(data);

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

      <Dashboard initialEntries={entries} goal={data.goal} />
    </main>
  );
}
