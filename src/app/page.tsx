"use client";

import { Dashboard } from "@/components/dashboard";
import type { StepsData } from "@/types";
import rawStepsData from "../../data/steps.json";

const stepsData = rawStepsData as StepsData;

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getWeeklyEntries() {
  const today = new Date();
  const entryMap = new Map(
    stepsData.entries.map((e) => [e.date, e]),
  );
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;
    result.push(
      entryMap.get(dateStr) ?? { date: dateStr, completed: false },
    );
  }
  return result;
}

function formatTodayDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const weeklyEntries = getWeeklyEntries();

  const entries = weeklyEntries.map((entry) => ({
    date: entry.date,
    completed: entry.completed,
    dayLabel: DAY_LABELS[new Date(entry.date + "T00:00:00").getDay()],
  }));

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-lg font-semibold tracking-wide text-[#666666]">
          Steps Tracker
        </h1>
        <p className="mt-1 text-sm text-[#444444]">{formatTodayDate()}</p>
      </header>

      <Dashboard initialEntries={entries} goal={stepsData.goal} />
    </main>
  );
}
