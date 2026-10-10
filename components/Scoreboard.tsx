import { ROUNDS_TO_WIN, type Scores } from "@/lib/rps";

type ScoreboardProps = {
  scores: Scores;
  round: number;
  streak: number;
  bestStreak: number;
};

function SideScore({ label, value, tone }: { label: string; value: number; tone: "you" | "ai" }) {
  const valueTone = tone === "you" ? "text-emerald-300" : "text-rose-300";

  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">{label}</span>
      <span className={`text-5xl leading-none font-bold tabular-nums ${valueTone}`}>{value}</span>
    </div>
  );
}

export default function Scoreboard({ scores, round, streak, bestStreak }: ScoreboardProps) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-4">
        <SideScore label="You" value={scores.you} tone="you" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">Round</span>
          <span className="text-2xl font-semibold text-zinc-300 tabular-nums">{round}</span>
        </div>
        <SideScore label="Computer" value={scores.ai} tone="ai" />
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {Array.from({ length: ROUNDS_TO_WIN }, (_, index) => {
          const filledYou = index < scores.you;
          const filledAi = index < scores.ai;

          return (
            <span
              key={index}
              className={`h-2 w-10 rounded-full transition-colors duration-300 ${
                filledYou
                  ? "bg-emerald-400"
                  : filledAi
                    ? "bg-rose-400"
                    : "bg-white/10"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-6 border-t border-white/10 pt-4 text-xs text-zinc-400">
        <span>
          Streak <strong className="text-zinc-200 tabular-nums">{streak}</strong>
        </span>
        <span>
          Best{" "}
          <strong className="text-zinc-200 tabular-nums">
            {bestStreak} {bestStreak === 1 ? "win" : "wins"}
          </strong>
        </span>
      </div>
    </div>
  );
}
