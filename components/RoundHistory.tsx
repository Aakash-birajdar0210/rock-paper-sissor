import { MOVE_META, type RoundRecord } from "@/lib/rps";

type RoundHistoryProps = {
  history: RoundRecord[];
};

const DOT: Record<RoundRecord["outcome"], string> = {
  win: "bg-emerald-400",
  lose: "bg-rose-400",
  draw: "bg-amber-300",
};

export default function RoundHistory({ history }: RoundHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">Recent rounds</h2>
      <ul className="flex flex-wrap gap-2">
        {history.map((entry) => (
          <li
            key={entry.round}
            title={`Round ${entry.round}: you played ${MOVE_META[entry.player].label}, computer played ${MOVE_META[entry.ai].label}`}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] py-1 pr-2.5 pl-2 text-xs text-zinc-300"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${DOT[entry.outcome]}`} />
            <span aria-hidden="true">{MOVE_META[entry.player].emoji}</span>
            <span className="text-zinc-600" aria-hidden="true">
              vs
            </span>
            <span aria-hidden="true">{MOVE_META[entry.ai].emoji}</span>
            <span className="text-zinc-500 tabular-nums">#{entry.round}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
