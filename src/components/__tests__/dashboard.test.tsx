import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProgressRing } from "../progress-ring";
import { WeeklyView } from "../weekly-view";
import { StreakCounter } from "../streak-counter";
import { GoalCard } from "../goal-card";
import { Dashboard } from "../dashboard";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("ProgressRing", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('shows "Complete" when completed is true', () => {
    render(<ProgressRing completed={true} goal={20000} percentage={100} />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it('shows "Not yet" when completed is false', () => {
    render(<ProgressRing completed={false} goal={20000} percentage={0} />);
    expect(screen.getByText("Not yet")).toBeInTheDocument();
  });

  it("shows the goal number", () => {
    render(<ProgressRing completed={false} goal={20000} percentage={0} />);
    expect(screen.getByText("GOAL: 20,000")).toBeInTheDocument();
  });

  it("shows check mark when completed", () => {
    render(<ProgressRing completed={true} goal={20000} percentage={100} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("shows cross mark when not completed", () => {
    render(<ProgressRing completed={false} goal={20000} percentage={0} />);
    expect(screen.getByText("✗")).toBeInTheDocument();
  });
});

describe("WeeklyView", () => {
  const entries = [
    { date: "2024-01-01", completed: true, dayLabel: "Monday" },
    { date: "2024-01-02", completed: false, dayLabel: "Tuesday" },
    { date: "2024-01-03", completed: true, dayLabel: "Wednesday" },
    { date: "2024-01-04", completed: false, dayLabel: "Thursday" },
    { date: "2024-01-05", completed: true, dayLabel: "Friday" },
    { date: "2024-01-06", completed: false, dayLabel: "Saturday" },
    { date: "2024-01-07", completed: true, dayLabel: "Sunday" },
  ];

  it("renders 7 day rows", () => {
    render(
      <WeeklyView entries={entries} completedCount={4} totalDays={7} />
    );
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
    expect(screen.getByText("Thursday")).toBeInTheDocument();
    expect(screen.getByText("Friday")).toBeInTheDocument();
    expect(screen.getByText("Saturday")).toBeInTheDocument();
    expect(screen.getByText("Sunday")).toBeInTheDocument();
  });

  it("renders checkboxes for each day", () => {
    render(
      <WeeklyView entries={entries} completedCount={4} totalDays={7} />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(7);
  });

  it("shows completed count", () => {
    render(
      <WeeklyView entries={entries} completedCount={4} totalDays={7} />
    );
    const matches = screen.getAllByText("4/7");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "Done" status for completed days', () => {
    render(
      <WeeklyView entries={entries} completedCount={4} totalDays={7} />
    );
    const doneLabels = screen.getAllByText("Done");
    expect(doneLabels).toHaveLength(4);
  });

  it('shows "Pending" status for incomplete days', () => {
    render(
      <WeeklyView entries={entries} completedCount={4} totalDays={7} />
    );
    const pendingLabels = screen.getAllByText("Pending");
    expect(pendingLabels).toHaveLength(3);
  });
});

describe("StreakCounter", () => {
  it("displays the streak number", () => {
    render(<StreakCounter streak={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows the fire emoji", () => {
    render(<StreakCounter streak={3} />);
    const matches = screen.getAllByText("🔥");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("shows day streak label", () => {
    render(<StreakCounter streak={10} />);
    const matches = screen.getAllByText("day streak");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GoalCard", () => {
  it("displays the goal number formatted", () => {
    render(<GoalCard goal={20000} />);
    const matches = screen.getAllByText("20,000");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("shows the target emoji", () => {
    render(<GoalCard goal={20000} />);
    const matches = screen.getAllByText("🎯");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("shows daily goal label", () => {
    render(<GoalCard goal={20000} />);
    const matches = screen.getAllByText("daily goal");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Dashboard", () => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const entries = [
    { date: yesterday, completed: true, dayLabel: "Monday" },
    { date: today, completed: false, dayLabel: "Tuesday" },
  ];

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it("renders progress ring, stats, and weekly view", () => {
    render(<Dashboard initialEntries={entries} goal={20000} />);
    expect(screen.getByText("Not yet")).toBeInTheDocument();
    expect(screen.getByText("GOAL: 20,000")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
  });

  it("toggles a pending day to done on click", async () => {
    const user = userEvent.setup();
    render(<Dashboard initialEntries={entries} goal={20000} />);

    const tuesdayCheckbox = screen.getByRole("checkbox", {
      name: /Tuesday not completed/,
    });
    await user.click(tuesdayCheckbox);

    expect(tuesdayCheckbox).toHaveAttribute("aria-checked", "true");
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it("toggles a completed day to pending on click", async () => {
    const user = userEvent.setup();
    render(<Dashboard initialEntries={entries} goal={20000} />);

    const mondayCheckbox = screen.getByRole("checkbox", {
      name: /Monday completed/,
    });
    await user.click(mondayCheckbox);

    expect(mondayCheckbox).toHaveAttribute("aria-checked", "false");
  });

  it("updates progress ring when today is toggled", async () => {
    const user = userEvent.setup();
    render(<Dashboard initialEntries={entries} goal={20000} />);

    expect(screen.getByText("Not yet")).toBeInTheDocument();

    const todayCheckbox = screen.getByRole("checkbox", {
      name: /Tuesday not completed/,
    });
    await user.click(todayCheckbox);

    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("loads saved state from localStorage on mount", () => {
    const saved: Record<string, boolean> = {};
    saved[today] = true;
    saved[yesterday] = false;
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(saved));

    render(<Dashboard initialEntries={entries} goal={20000} />);

    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("updates completion count when toggling", async () => {
    const user = userEvent.setup();
    render(<Dashboard initialEntries={entries} goal={20000} />);

    const initialCounts = screen.getAllByText("1/2");
    expect(initialCounts.length).toBeGreaterThanOrEqual(1);

    const todayCheckbox = screen.getByRole("checkbox", {
      name: /Tuesday not completed/,
    });
    await user.click(todayCheckbox);

    const updatedCounts = screen.getAllByText("2/2");
    expect(updatedCounts.length).toBeGreaterThanOrEqual(1);
  });
});
