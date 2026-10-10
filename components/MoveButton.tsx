import { MOVE_META, type Move } from "@/lib/rps";

type MoveButtonProps = {
  move: Move;
  disabled: boolean;
  onSelect: (move: Move) => void;
};

export default function MoveButton({ move, disabled, onSelect }: MoveButtonProps) {
  const meta = MOVE_META[move];

  return (
    <button
      type="button"
      onClick={() => onSelect(move)}
      disabled={disabled}
      aria-label={`Play ${meta.label}, ${meta.hint}`}
      className="group flex flex-1 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 transition duration-200 ease-out hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-emerald-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-white/10 disabled:hover:bg-white/5 motion-reduce:hover:translate-y-0"
    >
      <span className="text-5xl transition-transform duration-200 ease-out group-hover:scale-110 group-disabled:scale-100 motion-reduce:group-hover:scale-100">
        {meta.emoji}
      </span>
      <span className="text-xs font-medium tracking-wide text-zinc-300 uppercase">{meta.label}</span>
    </button>
  );
}
