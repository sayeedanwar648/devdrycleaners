import type { ReactNode } from "react";
import type { IconId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function Svg({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-7 text-rose", className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function GarmentIcon({
  icon,
  className,
}: {
  icon: IconId;
  className?: string;
}) {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "saree":
      return (
        <Svg className={className}>
          <path d="M10 6c4 3 4 8 0 12 5-1 10 2 12 8" {...stroke} />
          <path d="M10 6c2 1 5 1 8-1" {...stroke} />
          <path d="M8 26h14" {...stroke} />
        </Svg>
      );
    case "lehenga":
      return (
        <Svg className={className}>
          <path d="M16 5v6" {...stroke} />
          <path d="M12 11h8l4 14H8l4-14Z" {...stroke} />
          <path d="M12 11c1.4-3 6.6-3 8 0" {...stroke} />
        </Svg>
      );
    case "dupatta":
      return (
        <Svg className={className}>
          <path d="M6 10c6-6 14-6 20 0" {...stroke} />
          <path d="M8 12c5 8 11 8 16 0" {...stroke} />
        </Svg>
      );
    case "suit":
      return (
        <Svg className={className}>
          <path d="M10 8 16 12l6-4 3 5v13H7V13l3-5Z" {...stroke} />
          <path d="M16 12v14" {...stroke} />
        </Svg>
      );
    case "pant":
      return (
        <Svg className={className}>
          <path d="M11 6h10l-1 4-3 16h-2L13 10 11 6Z" {...stroke} />
          <path d="M15 10h2" {...stroke} />
        </Svg>
      );
    case "blanket":
      return (
        <Svg className={className}>
          <rect x="6" y="8" width="20" height="16" rx="2" {...stroke} />
          <path d="M6 14h20" {...stroke} />
          <path d="M12 8v16" {...stroke} />
        </Svg>
      );
    case "curtain":
      return (
        <Svg className={className}>
          <path d="M6 6h20" {...stroke} />
          <path d="M8 6c0 6 4 6 4 20" {...stroke} />
          <path d="M20 6c0 6 4 6 4 20" {...stroke} />
          <path d="M14 6c0 8 4 8 4 20" {...stroke} />
        </Svg>
      );
    case "sofa":
      return (
        <Svg className={className}>
          <path d="M6 18v-4a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v4" {...stroke} />
          <path d="M4 18h24v5H4z" {...stroke} />
          <path d="M8 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" {...stroke} />
        </Svg>
      );
    case "iron":
      return (
        <Svg className={className}>
          <path d="M7 20h16a4 4 0 0 0 0-8H14c-4 0-7 3-7 8Z" {...stroke} />
          <path d="M10 12V8h8" {...stroke} />
        </Svg>
      );
    default:
      return (
        <Svg className={className}>
          <path d="M10 10h12v14H10z" {...stroke} />
          <path d="M10 10c0-3 12-3 12 0" {...stroke} />
          <path d="M16 7v3" {...stroke} />
        </Svg>
      );
  }
}
