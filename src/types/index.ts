export interface StepEntry {
  date: string; // ISO date "YYYY-MM-DD"
  completed: boolean;
}

export interface StepsData {
  goal: number;
  entries: StepEntry[];
}

export interface WeeklyCompletion {
  completed: number;
  total: number;
  percentage: number;
}
