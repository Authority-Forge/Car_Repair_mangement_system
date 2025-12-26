import React, { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "w-full rounded-lg py-3 text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    variant === "primary"
                        ? "bg-primary text-white hover:bg-blue-600 focus-visible:outline-primary"
                        : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
