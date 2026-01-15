import { ReactNode } from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
    showPercentage?: boolean;
}

export default function ProgressBar({
    current,
    total,
    showPercentage = true,
}: ProgressBarProps): ReactNode {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const isCompleted = percentage >= 100;
    const isNotStarted = current === 0;

    return (
        <div className="w-full">
            <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                    {current.toLocaleString()} / {total.toLocaleString()}{' '}
                    Responses
                </span>
                {showPercentage && (
                    <span
                        className={`font-semibold ${
                            isNotStarted
                                ? 'text-slate-400'
                                : isCompleted
                                  ? 'text-primary'
                                  : 'text-slate-600'
                        }`}
                    >
                        {isNotStarted ? 'Not Started' : `${percentage}%`}
                    </span>
                )}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-primary' : 'bg-primary/70'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}
