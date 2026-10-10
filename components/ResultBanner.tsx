import { ROUNDS_TO_WIN, getResultMessage, type MatchWinner, type Outcome, type Scores } from "@/lib/rps";

type ResultBannerProps = {
  outcome: Outcome | null;
  matchWinner: MatchWinner;
  scores: Scores;
  phase: "idle" | "thinking" | "revealed" | "over";
  replayKey: number;
};

const TONE = {
  win: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200 animate-flash-win",
  lose: "border-rose-400/40 bg-rose-400/10 text-rose-200 animate-flash-lose",
  draw: "border-amber-300/40 bg-amber-300/10 text-amber-100 animate-flash-draw",
  idle: "border-white/10 bg-white/[0.03] text-zinc-400",
} as const;

function getText(outcome: Outcome | null, matchWinner: MatchWinner, scores: Scores, phase: ResultBannerProps["phase"]) {
  if (phase === "over" && matchWinner) {
    const finalScore = `${scores.you} – ${scores.ai}`;
    if (matchWinner === "you") return `You win the match ${finalScore}`;
    if (matchWinner === "ai") return `Computer wins the match ${finalScore}`;
    return `Match drawn ${finalScore}`;
  }

  if (phase === "thinking") return "Computer is choosing…";
  if (phase === "idle") return `First to ${ROUNDS_TO_WIN} wins`;
  if (outcome) return getResultMessage(outcome);
  return null;
}

export default function ResultBanner({ outcome, matchWinner, scores, phase, replayKey }: ResultBannerProps) {
  const tone = phase === "over" ? TONE.idle : outcome ? TONE[outcome] : TONE.idle;
  const text = getText(outcome, matchWinner, scores, phase);

  return (
    <div
      key={`${phase}-${replayKey}`}
      className={`flex min-h-14 w-full items-center justify-center rounded-2xl border px-4 py-3 text-center text-base font-semibold tracking-tight transition-colors sm:text-lg ${tone}`}
      aria-live="polite"
    >
      {text}
    </div>
  );
}
