export const MOVES = ["rock", "paper", "scissors"] as const;

export type Move = (typeof MOVES)[number];
export type Outcome = "win" | "lose" | "draw";
export type Side = "you" | "ai";
export type MatchWinner = Side | "draw" | null;

export type MoveMeta = {
  emoji: string;
  label: string;
  hint: string;
  beats: Move;
};

export const MOVE_META: Record<Move, MoveMeta> = {
  rock: { emoji: "✊", label: "Rock", hint: "crushes scissors", beats: "scissors" },
  paper: { emoji: "✋", label: "Paper", hint: "covers rock", beats: "rock" },
  scissors: { emoji: "✌️", label: "Scissors", hint: "cuts paper", beats: "paper" },
};

export const ROUNDS_TO_WIN = 3;

export const THINKING_DELAY_MS = 650;

const BEATS: Record<Move, Move> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

export type Scores = Record<Side, number>;

export type RoundRecord = {
  round: number;
  player: Move;
  ai: Move;
  outcome: Outcome;
};

export const EMPTY_SCORES: Scores = { you: 0, ai: 0 };

export function getAiMove(): Move {
  const cryptoObj = globalThis.crypto;

  if (typeof cryptoObj?.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / MOVES.length) * MOVES.length;

    do {
      cryptoObj.getRandomValues(buffer);
    } while ((buffer[0] as number) >= limit);

    return MOVES[(buffer[0] as number) % MOVES.length];
  }

  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

export function judge(player: Move, ai: Move): Outcome {
  if (player === ai) return "draw";
  return BEATS[player] === ai ? "win" : "lose";
}

export function applyOutcome(scores: Scores, outcome: Outcome): Scores {
  if (outcome === "win") return { ...scores, you: scores.you + 1 };
  if (outcome === "lose") return { ...scores, ai: scores.ai + 1 };
  return scores;
}

export function getMatchWinner(scores: Scores): MatchWinner {
  if (scores.you >= ROUNDS_TO_WIN) return "you";
  if (scores.ai >= ROUNDS_TO_WIN) return "ai";
  return null;
}

export function getResultMessage(outcome: Outcome): string {
  if (outcome === "win") return "You take this round";
  if (outcome === "lose") return "Computer takes this round";
  return "Dead heat";
}
