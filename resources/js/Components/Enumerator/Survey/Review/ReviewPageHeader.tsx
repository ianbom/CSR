interface ReviewPageHeaderProps {
    title: string;
    subtitle: string;
    statusLabel?: string;
    statusIcon?: string;
}

export default function ReviewPageHeader({
    title,
    subtitle,
    statusLabel = 'Ready for Submission',
    statusIcon = 'verified',
}: ReviewPageHeaderProps) {
    return (
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 md:text-4xl">
                    {title}
                </h1>
                <p className="text-sm font-medium text-green-600 md:text-base">
                    {subtitle}
                </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                <span className="material-symbols-outlined text-[20px]">
                    {statusIcon}
                </span>
                <span>{statusLabel}</span>
            </div>
        </div>
    );
}
