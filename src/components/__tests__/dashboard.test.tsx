import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressRing } from "../progress-ring";
import { WeeklyView } from "../weekly-view";
import { StreakCounter } from "../streak-counter";
import { GoalCard } from "../goal-card";

describe("ProgressRing", () => {
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
