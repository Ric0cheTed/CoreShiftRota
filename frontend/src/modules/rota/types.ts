export type Reason = { kind: "hard_fail" | "constraint" | "score"; source: string; value: number; note?: string };
export type Suggestion = { employee_id: number; score: number; reason: string };
export type VisitInput = { date: string; start_time: string; end_time: string; client_id: number };