import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-9 shrink-0 text-rose", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M9 13.2c0-2.4 1.8-4.4 7-4.4s7 2 7 4.4"
        fill="none"
        stroke="var(--color-ivory)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 8.8V11"
        fill="none"
        stroke="var(--color-ivory)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.2 14.2 16 22.6l5.8-8.4"
        fill="none"
        stroke="var(--color-ivory)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
