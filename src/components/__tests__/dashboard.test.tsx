import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodayCard } from "../today-card";
import { WeeklyView } from "../weekly-view";
import { StreakCounter } from "../streak-counter";
import { GoalCard } from "../goal-card";

describe("TodayCard", () => {
  it("shows the goal number", () => {
    render(<TodayCard completed={false} goal={20000} />);
    expect(screen.getByText(/20,000 steps/)).toBeInTheDocument();
  });

  it('shows "Complete" badge when completed is true', () => {
    render(<TodayCard completed={true} goal={20000} />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it('shows "Incomplete" badge when completed is false', () => {
    render(<TodayCard completed={false} goal={20000} />);
    const badges = screen.getAllByText("Incomplete");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("shows step count as goal value when completed", () => {
    render(<TodayCard completed={true} goal={20000} />);
    const matches = screen.getAllByText("20,000");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("shows step count as 0 when not completed", () => {
    render(<TodayCard completed={false} goal={20000} />);
    const matches = screen.getAllByText("0");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});

describe("WeeklyView", () => {
  const entries = [
    { date: "2024-01-01", completed: true, dayLabel: "Mon" },
    { date: "2024-01-02", completed: false, dayLabel: "Tue" },
    { date: "2024-01-03", completed: true, dayLabel: "Wed" },
    { date: "2024-01-04", completed: false, dayLabel: "Thu" },
    { date: "2024-01-05", completed: true, dayLabel: "Fri" },
    { date: "2024-01-06", completed: false, dayLabel: "Sat" },
    { date: "2024-01-07", completed: true, dayLabel: "Sun" },
  ];

  it("renders 7 days", () => {
    render(
      <WeeklyView entries={entries} completedCount={4} totalDays={7} />
    );
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("Thu")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
    expect(screen.getByText("Sat")).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();
  });

  it("shows completed count", () => {
    render(
      <WeeklyView entries={entries} completedCount={4} totalDays={7} />
    );
    const matches = screen.getAllByText("4/7");
    expect(matches.length).toBeGreaterThanOrEqual(1);
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

  it("shows steps label", () => {
    render(<GoalCard goal={20000} />);
    const matches = screen.getAllByText("steps");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
