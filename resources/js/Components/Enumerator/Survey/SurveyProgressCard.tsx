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
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <p className="text-sm font-bold text-primary">{title}</p>
                    <p className="text-sm font-bold text-primary">{percentage}%</p>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    );
}
