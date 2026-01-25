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
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
