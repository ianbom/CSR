interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepLabel?: string;
}

export default function StepIndicator({
    currentStep,
    totalSteps,
    stepLabel,
}: StepIndicatorProps) {
    return (
        <div className="flex flex-col items-end text-right">
            <span className="text-sm font-bold text-primary underline">
                Langkah {currentStep} dari {totalSteps}
            </span>
            {stepLabel && (
                <span className="text-xs text-gray-500">{stepLabel}</span>
            )}
        </div>
    );
}
