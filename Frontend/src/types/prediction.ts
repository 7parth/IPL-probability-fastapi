export interface PredictionRequest {
  batting_team: string;
  bowling_team: string;
  current_score: number;
  wickets_out: number;
  overs_completed: number;
  total_runs_x: number;
  city: string;
}

export interface PredictionResponse {
  batting_team: string;
  batting_win_prob: string;
  bowling_team: string;
  bowling_win_prob: string;
}

export interface ValidationErrors {
  batting_team?: string;
  bowling_team?: string;
  current_score?: string;
  wickets_out?: string;
  overs_completed?: string;
  total_runs_x?: string;
  city?: string;
  general?: string;
}