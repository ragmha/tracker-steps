import fs from "fs";
import path from "path";
import type { StepEntry, StepsData, WeeklyCompletion } from "@/types";

/**
 * Reads steps data from data/steps.json at build time.
 */
export function getStepsData(): StepsData {
  const filePath = path.resolve(process.cwd(), "data", "steps.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as StepsData;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Returns true if today's entry exists and is completed.
 */
export function getTodayStatus(data: StepsData): boolean {
  const today = formatDate(new Date());
  const entry = data.entries.find((e) => e.date === today);
  return entry?.completed ?? false;
}

/**
 * Returns the last 7 days of entries, filling in missing days with completed: false.
 */
export function getWeeklyEntries(data: StepsData): StepEntry[] {
  const today = new Date();
  const entryMap = new Map(data.entries.map((e) => [e.date, e]));

  const result: StepEntry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    result.push(entryMap.get(dateStr) ?? { date: dateStr, completed: false });
  }
  return result;
}

/**
 * Counts consecutive completed days backwards from the most recent completed day.
 */
export function getStreak(data: StepsData): number {
  const sorted = [...data.entries]
    .filter((e) => e.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diffMs = prev.getTime() - curr.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Returns weekly completion stats for the last 7 days.
 */
export function getWeeklyCompletion(data: StepsData): WeeklyCompletion {
  const weekly = getWeeklyEntries(data);
  const completed = weekly.filter((e) => e.completed).length;
  const total = 7;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}
