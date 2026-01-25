interface ReviewProgressBarProps {
    percentage: number;
    label?: string;
}

export default function ReviewProgressBar({
    percentage,
    label = 'Survey Completion',
}: ReviewProgressBarProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold leading-normal text-gray-900">
                    {label}
                </p>
                <span className="text-sm font-bold text-primary">
                    {percentage}%
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-green-100">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
