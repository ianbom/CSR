interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

export default function ProgressBar({
    currentStep,
    totalSteps,
    className = '',
}: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className={`w-full ${className}`}>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
