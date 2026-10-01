import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QtyStepperProps = {
  value: number;
  onAdd: () => void;
  onSub: () => void;
  label: string;
};

export function QtyStepper({ value, onAdd, onSub, label }: QtyStepperProps) {
  return (
    <div className="flex items-center gap-1">
      {value > 0 ? (
        <>
          <button
            type="button"
            onClick={onSub}
            aria-label={`${label} −`}
            className={cn(
              "grid size-11 place-items-center rounded-md border border-border bg-ivory text-ink",
              "transition-[transform,background-color] duration-150 ease-out",
              "hover:bg-soft active:scale-[0.96]",
            )}
          >
            <Minus className="size-4" strokeWidth={2} />
          </button>
          <span className="min-w-8 text-center text-sm font-medium tabular-nums text-ink">
            {value}
          </span>
        </>
      ) : null}
      <button
        type="button"
        onClick={onAdd}
        aria-label={`${label} +`}
        className={cn(
          "grid size-11 place-items-center rounded-md text-ink",
          value > 0
            ? "border border-border bg-ivory hover:bg-soft"
            : "bg-rose text-rose-fg hover:bg-rose/90",
          "transition-[transform,background-color] duration-150 ease-out",
          "active:scale-[0.96]",
        )}
      >
        <Plus className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}
