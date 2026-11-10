import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-none border border-line-strong bg-paper px-3.5 py-1 text-base transition-[border-color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
        "text-ink placeholder:text-ink-muted",
        // The global :focus-visible outline would double up with the field border.
        "focus-visible:border-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30",
        "aria-invalid:border-danger aria-invalid:ring-danger/25",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
