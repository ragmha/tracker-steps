import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { StepsData } from "@/types";
import {
  getTodayStatus,
  getWeeklyEntries,
  getStreak,
  getWeeklyCompletion,
  getStepsData,
} from "../steps";

// Helper to build ISO date strings relative to today
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function makeData(
  entries: { date: string; completed: boolean }[],
  goal = 20000
): StepsData {
  return { goal, entries };
}

// ─── getStepsData ────────────────────────────────────────────────
const mockJson = vi.hoisted(() =>
  JSON.stringify({
    goal: 15000,
    entries: [{ date: "2026-04-20", completed: true }],
  })
);

vi.mock("fs", () => ({
  default: { readFileSync: vi.fn(() => mockJson) },
}));

describe("getStepsData", () => {
  it("reads and parses data/steps.json", () => {
    const data = getStepsData();
    expect(data.goal).toBe(15000);
    expect(data.entries).toHaveLength(1);
    expect(data.entries[0].date).toBe("2026-04-20");
  });
});

// ─── getTodayStatus ──────────────────────────────────────────────
describe("getTodayStatus", () => {
  it("returns true when today is completed", () => {
    const data = makeData([{ date: daysAgo(0), completed: true }]);
    expect(getTodayStatus(data)).toBe(true);
  });

  it("returns false when today is not completed", () => {
    const data = makeData([{ date: daysAgo(0), completed: false }]);
    expect(getTodayStatus(data)).toBe(false);
  });

  it("returns false when today has no entry", () => {
    const data = makeData([{ date: daysAgo(1), completed: true }]);
    expect(getTodayStatus(data)).toBe(false);
  });

  it("returns false when entries are empty", () => {
    const data = makeData([]);
    expect(getTodayStatus(data)).toBe(false);
  });
});

// ─── getWeeklyEntries ────────────────────────────────────────────
describe("getWeeklyEntries", () => {
  it("returns exactly 7 entries", () => {
    const data = makeData([]);
    const entries = getWeeklyEntries(data);
    expect(entries).toHaveLength(7);
  });

  it("fills missing days with completed: false", () => {
    const data = makeData([{ date: daysAgo(0), completed: true }]);
    const entries = getWeeklyEntries(data);
    expect(entries).toHaveLength(7);
    // last entry (today) should be completed
    expect(entries[6].completed).toBe(true);
    // others should be false
    for (let i = 0; i < 6; i++) {
      expect(entries[i].completed).toBe(false);
    }
  });

  it("returns entries in chronological order (oldest first)", () => {
    const data = makeData([
      { date: daysAgo(6), completed: true },
      { date: daysAgo(0), completed: true },
    ]);
    const entries = getWeeklyEntries(data);
    expect(entries[0].date).toBe(daysAgo(6));
    expect(entries[6].date).toBe(daysAgo(0));
  });

  it("preserves existing entry data", () => {
    const data = makeData([
      { date: daysAgo(3), completed: true },
      { date: daysAgo(1), completed: false },
    ]);
    const entries = getWeeklyEntries(data);
    const day3 = entries.find((e) => e.date === daysAgo(3));
    const day1 = entries.find((e) => e.date === daysAgo(1));
    expect(day3?.completed).toBe(true);
    expect(day1?.completed).toBe(false);
  });
});

// ─── getStreak ───────────────────────────────────────────────────
describe("getStreak", () => {
  it("returns 0 when there are no entries", () => {
    expect(getStreak(makeData([]))).toBe(0);
  });

  it("returns 0 when no entries are completed", () => {
    const data = makeData([
      { date: daysAgo(0), completed: false },
      { date: daysAgo(1), completed: false },
    ]);
    expect(getStreak(data)).toBe(0);
  });

  it("returns 1 for a single completed day", () => {
    const data = makeData([{ date: daysAgo(0), completed: true }]);
    expect(getStreak(data)).toBe(1);
  });

  it("counts consecutive completed days from most recent", () => {
    const data = makeData([
      { date: daysAgo(0), completed: true },
      { date: daysAgo(1), completed: true },
      { date: daysAgo(2), completed: true },
    ]);
    expect(getStreak(data)).toBe(3);
  });

  it("breaks streak on a gap", () => {
    const data = makeData([
      { date: daysAgo(0), completed: true },
      { date: daysAgo(1), completed: true },
      // gap on daysAgo(2)
      { date: daysAgo(3), completed: true },
    ]);
    expect(getStreak(data)).toBe(2);
  });

  it("ignores non-completed entries in streak", () => {
    const data = makeData([
      { date: daysAgo(0), completed: true },
      { date: daysAgo(1), completed: false },
      { date: daysAgo(2), completed: true },
    ]);
    // Most recent completed is daysAgo(0), next completed is daysAgo(2) — gap of 2 days
    expect(getStreak(data)).toBe(1);
  });

  it("handles unsorted entries", () => {
    const data = makeData([
      { date: daysAgo(2), completed: true },
      { date: daysAgo(0), completed: true },
      { date: daysAgo(1), completed: true },
    ]);
    expect(getStreak(data)).toBe(3);
  });
});

// ─── getWeeklyCompletion ─────────────────────────────────────────
describe("getWeeklyCompletion", () => {
  it("returns 0 completed when no entries", () => {
    const result = getWeeklyCompletion(makeData([]));
    expect(result.completed).toBe(0);
    expect(result.total).toBe(7);
    expect(result.percentage).toBe(0);
  });

  it("calculates correct completion for partial week", () => {
    const data = makeData([
      { date: daysAgo(0), completed: true },
      { date: daysAgo(2), completed: true },
      { date: daysAgo(4), completed: true },
    ]);
    const result = getWeeklyCompletion(data);
    expect(result.completed).toBe(3);
    expect(result.total).toBe(7);
    expect(result.percentage).toBe(43); // Math.round(3/7*100)
  });

  it("calculates 100% for full week", () => {
    const entries = Array.from({ length: 7 }, (_, i) => ({
      date: daysAgo(i),
      completed: true,
    }));
    const result = getWeeklyCompletion(makeData(entries));
    expect(result.completed).toBe(7);
    expect(result.total).toBe(7);
    expect(result.percentage).toBe(100);
  });

  it("ignores entries outside the 7-day window", () => {
    const data = makeData([
      { date: daysAgo(0), completed: true },
      { date: daysAgo(10), completed: true }, // outside window
    ]);
    const result = getWeeklyCompletion(data);
    expect(result.completed).toBe(1);
    expect(result.total).toBe(7);
    expect(result.percentage).toBe(14); // Math.round(1/7*100)
  });
});
