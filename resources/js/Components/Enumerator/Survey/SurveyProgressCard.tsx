interface SurveyProgressCardProps {
    percentage: number;
    title?: string;
    description?: string;
}

export default function SurveyProgressCard({
    percentage,
    title = 'Kelengkapan Survei',
    description = 'Mohon lengkapi semua pertanyaan untuk melanjutkan.',
}: SurveyProgressCardProps) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2">
                <div className="flex items-end justify-between">
                    <p className="text-sm font-bold text-primary">{title}</p>
                    <p className="text-sm font-bold text-primary">
                        {percentage}%
                    </p>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
        </div>
    );
}
