export type Theme = 'light' | 'dark' | 'system';

export type SimState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: SimulateResponse }
  | { status: 'error'; message: string };

export interface Limit {
  name: string;
  bb_size: number;
  ev_per_100: number;
  std_dev_per_100: number;
  move_up_at?: number;
  move_down_at?: number;
}

export interface SimulateRequest {
  starting_bankroll: number;
  bust_bankroll: number;
  num_simulations: number;
  total_hands: number;
  limits: Limit[];
  cashout_rule?: CashoutRule;
  probability_queries?: ProbabilityQuery[];
}

export interface SimulateResponse {
  ci_70: Interval;
  ci_95: Interval;
  best: number;
  worst: number;
  probability_queries: QueryResult[];
  elapsed_seconds: number;
}

export type CashoutKind =
  | { type: 'fixed'; amount: number }
  | { type: 'profit_percentage'; percentage: number }
  | { type: 'bankroll_percentage'; percentage: number };

export interface CashoutRule {
  interval_hands: number;
  kind: CashoutKind;
}

export type ProbabilityQuery =
  | { type: 'bust' }
  | { type: 'reach_profit'; target: number }
  | { type: 'reach_bankroll'; target: number }
  | { type: 'at_limit_or_above'; limit: string };

export interface Interval {
  low: number;
  high: number;
}

export interface QueryResult {
  type: string;
  target?: number;
  limit?: string;
  probability: number;
}
