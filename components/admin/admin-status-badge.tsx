import { cn } from "@/lib/utils";

export function AdminStatusBadge({ status }: { status: string }) {
  const published = status === "PUBLISHED";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        published ? "bg-[#dff7ea] text-[#176b3b]" : "bg-[#eef2f6] text-[#5b6b7a]",
      )}
    >
      {status}
    </span>
  );
}
