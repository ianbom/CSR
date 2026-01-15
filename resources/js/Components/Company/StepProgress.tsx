import { ReactNode } from 'react';

interface StepProgressProps {
    currentStep: number;
    totalSteps: number;
    steps: { label: string }[];
}

export default function StepProgress({
    currentStep,
    totalSteps,
    steps,
}: StepProgressProps): ReactNode {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {currentStep}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                        {steps[currentStep - 1]?.label}
                    </span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                    LANGKAH {currentStep} DARI {totalSteps}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
            <div className="mt-3 flex justify-between">
                {steps.map((step, index) => (
                    <span
                        key={index}
                        className={`text-xs font-semibold ${
                            index + 1 <= currentStep
                                ? 'text-primary'
                                : 'text-slate-400'
                        }`}
                    >
                        {step.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
