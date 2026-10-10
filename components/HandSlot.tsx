import { MOVE_META, type Move, type Outcome, type Side } from "@/lib/rps";
import type { Phase } from "@/hooks/useRpsGame";

type HandSlotProps = {
  side: Side;
  label: string;
  move: Move | null;
  phase: Phase;
  outcome: Outcome | null;
  isWinner: boolean;
};

const RING: Record<Side, Record<Outcome | "none", string>> = {
  you: {
    win: "border-emerald-400/70 shadow-[0_0_50px_-10px_var(--color-emerald-400)]",
    lose: "border-rose-400/60 shadow-[0_0_50px_-14px_var(--color-rose-400)]",
    draw: "border-amber-300/60 shadow-[0_0_50px_-14px_var(--color-amber-300)]",
    none: "border-white/10",
  },
  ai: {
    win: "border-rose-400/60 shadow-[0_0_50px_-14px_var(--color-rose-400)]",
    lose: "border-emerald-400/60 shadow-[0_0_50px_-14px_var(--color-emerald-400)]",
    draw: "border-amber-300/60 shadow-[0_0_50px_-14px_var(--color-amber-300)]",
    none: "border-white/10",
  },
};

export default function HandSlot({ side, label, move, phase, outcome, isWinner }: HandSlotProps) {
  const isThinking = phase === "thinking" && side === "ai";
  const ring = RING[side][outcome ?? "none"];
  const animation =
    phase === "over"
      ? ""
      : phase === "thinking"
        ? side === "ai"
          ? "animate-think"
          : "animate-shake"
        : move
          ? "animate-pop-in"
          : "";

  return (
    <div className="flex w-32 flex-col items-center gap-3 sm:w-40">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">{label}</span>
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-3xl border bg-white/[0.03] transition duration-300 sm:h-32 sm:w-32 ${ring} ${animation}`}
      >
        {isThinking ? (
          <span className="text-5xl" aria-hidden="true">
            🤔
          </span>
        ) : move ? (
          <span className="text-6xl" aria-hidden="true">
            {MOVE_META[move].emoji}
          </span>
        ) : (
          <span className="text-4xl text-zinc-600" aria-hidden="true">
            ?
          </span>
        )}
      </div>
      <span className="text-xs text-zinc-500">
        {isThinking ? "choosing…" : move ? MOVE_META[move].label : "ready"}
      </span>
      {isWinner ? (
        <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
          round winner
        </span>
      ) : (
        <span className="h-[22px]" />
      )}
    </div>
  );
}
