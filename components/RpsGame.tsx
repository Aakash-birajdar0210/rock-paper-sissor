"use client";

import { MOVES, ROUNDS_TO_WIN } from "@/lib/rps";
import { useRpsGame } from "@/hooks/useRpsGame";
import HandSlot from "@/components/HandSlot";
import MoveButton from "@/components/MoveButton";
import ResultBanner from "@/components/ResultBanner";
import RoundHistory from "@/components/RoundHistory";
import Scoreboard from "@/components/Scoreboard";

export default function RpsGame() {
  const {
    scores,
    round,
    playerMove,
    aiMove,
    outcome,
    phase,
    matchWinner,
    streak,
    bestStreak,
    history,
    soundOn,
    isBusy,
    playRound,
    resetMatch,
    toggleSound,
  } = useRpsGame();

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">Rock Paper Scissors</h1>
          <p className="mt-1 text-sm text-zinc-400">
            You vs the computer. First to {ROUNDS_TO_WIN} takes the match.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            {soundOn ? "🔊 Sound on" : "🔇 Sound off"}
          </button>
          <button
            type="button"
            onClick={resetMatch}
            className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-2 text-xs font-medium text-emerald-200 transition hover:border-emerald-400/70 hover:bg-emerald-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            New match
          </button>
        </div>
      </div>

      <Scoreboard scores={scores} round={round} streak={streak} bestStreak={bestStreak} />

      <div className="flex items-center justify-center gap-4 sm:gap-10">
        <HandSlot
          side="you"
          label="You"
          move={playerMove}
          phase={phase}
          outcome={outcome}
          isWinner={outcome === "win"}
        />
        <span className="pb-6 text-2xl font-black text-zinc-600" aria-hidden="true">
          VS
        </span>
        <HandSlot
          side="ai"
          label="Computer"
          move={aiMove}
          phase={phase}
          outcome={outcome}
          isWinner={outcome === "lose"}
        />
      </div>

      <ResultBanner outcome={outcome} matchWinner={matchWinner} scores={scores} phase={phase} replayKey={round} />

      <div className="flex gap-3">
        {MOVES.map((move) => (
          <MoveButton key={move} move={move} disabled={isBusy} onSelect={playRound} />
        ))}
      </div>

      <RoundHistory history={history} />

      <p className="text-center text-xs text-zinc-500">
        ✊ beats ✌️ &nbsp;·&nbsp; ✌️ beats ✋ &nbsp;·&nbsp; ✋ beats ✊
      </p>
    </div>
  );
}
