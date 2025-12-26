import React, { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <span className="material-symbols-outlined text-[20px]">{icon}</span>
                        </span>
                    )}
                    <input
                        className={cn(
                            "w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors",
                            icon ? "pl-10 pr-3" : "px-3",
                            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
