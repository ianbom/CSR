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
            <span className="text-primary font-bold text-sm underline">
                Langkah {currentStep} dari {totalSteps}
            </span>
            {stepLabel && (
                <span className="text-gray-500 text-xs">{stepLabel}</span>
            )}
        </div>
    );
}
