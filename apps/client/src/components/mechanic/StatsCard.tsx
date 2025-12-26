

interface StatsCardProps {
    title: string;
    icon: string;
    value: string;
    subText?: string;
    subIcon?: string;
    subColor?: string; // Tailwind class e.g. text-green-500
    iconColor?: string; // Tailwind class e.g. text-primary
    progressBarValue?: number;
    progressBarColor?: string; // Tailwind class e.g. bg-green-500
}

export function StatsCard({ title, icon, value, subText, subIcon, subColor, iconColor = 'text-primary', progressBarValue, progressBarColor }: StatsCardProps) {
    return (
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1c232b] border border-slate-200 dark:border-[#3b4754] shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium uppercase tracking-wider">{title}</p>
                <span className={`material-symbols-outlined ${iconColor}`} style={{ fontSize: '24px' }}>{icon}</span>
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">{value}</p>

            {subText && (
                <div className={`flex items-center gap-1 text-xs ${subColor}`}>
                    {subIcon && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{subIcon}</span>}
                    <span>{subText}</span>
                </div>
            )}

            {progressBarValue !== undefined && (
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                    <div className={`${progressBarColor} h-1.5 rounded-full`} style={{ width: `${progressBarValue}%` }}></div>
                </div>
            )}
        </div>
    );
}
