"use client";

import { useState, useCallback } from "react";
import { ProgressRing } from "@/components/progress-ring";
import { WeeklyView } from "@/components/weekly-view";
import { StreakCounter } from "@/components/streak-counter";
import { GoalCard } from "@/components/goal-card";

export interface DashboardEntry {
  date: string;
  completed: boolean;
  dayLabel: string;
}

export interface DashboardProps {
  initialEntries: DashboardEntry[];
  goal: number;
}

const STORAGE_KEY = "tracker-steps-entries";

function computeStreak(
  entries: Array<{ date: string; completed: boolean }>,
): number {
  const sorted = [...entries]
    .filter((e) => e.completed)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (sorted.length === 0) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date + "T00:00:00");
    const curr = new Date(sorted[i].date + "T00:00:00");
    const diffDays = Math.round(
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

function getLocalToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function Dashboard({ initialEntries, goal }: DashboardProps) {
  const [entries, setEntries] = useState(() => {
    if (typeof window === "undefined") return initialEntries;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialEntries;
    const savedEntries: Record<string, boolean> = JSON.parse(saved);
    return initialEntries.map((e) => ({
      ...e,
      completed: savedEntries[e.date] ?? e.completed,
    }));
  });

  const toggleDay = useCallback((date: string) => {
    setEntries((prev) => {
      const updated = prev.map((e) =>
        e.date === date ? { ...e, completed: !e.completed } : e,
      );
      const toSave: Record<string, boolean> = {};
      updated.forEach((e) => {
        toSave[e.date] = e.completed;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      return updated;
    });
  }, []);

  // Find today's entry — use the LAST entry in the array (most recent day)
  // as a fallback if exact date match fails (build-time vs runtime date mismatch)
  const today = getLocalToday();
  const todayEntry = entries.find((e) => e.date === today) ?? entries[entries.length - 1];
  const todayDate = todayEntry?.date ?? today;
  const todayCompleted = todayEntry?.completed ?? false;
  const percentage = todayCompleted ? 100 : 0;
  const completedCount = entries.filter((e) => e.completed).length;
  const streak = computeStreak(entries);

  const toggleToday = useCallback(() => {
    toggleDay(todayDate);
  }, [toggleDay, todayDate]);

  return (
    <>
      {/* Progress Ring — clickable to toggle today */}
      <div className="mb-8">
        <button
          onClick={toggleToday}
          className="cursor-pointer rounded-full transition-transform active:scale-95"
          aria-label={todayCompleted ? "Mark today as incomplete" : "Mark today as complete"}
        >
          <ProgressRing
            completed={todayCompleted}
            goal={goal}
            percentage={percentage}
          />
        </button>
      </div>

      {/* Stats Row */}
      <div className="mb-8 flex w-full items-center justify-center gap-8">
        <StreakCounter streak={streak} />
        <div className="h-8 w-px bg-[#1a1a1a]" />
        <GoalCard goal={goal} />
      </div>

      {/* Completion summary */}
      <p className="mb-6 text-sm text-[#666666]">
        <span className="font-bold text-[#00d4ff]">
          {completedCount}/{entries.length}
        </span>{" "}
        this week
      </p>

      {/* Weekly Checklist */}
      <div className="w-full">
        <WeeklyView
          entries={entries}
          completedCount={completedCount}
          totalDays={entries.length}
          onToggle={toggleDay}
        />
      </div>
    </>
  );
}
