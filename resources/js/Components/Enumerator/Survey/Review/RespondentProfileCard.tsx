interface RespondentProfileCardProps {
    name: string;
    id: string;
    location: string;
    interviewDate: string;
    imageUrl: string;
    onEdit?: () => void;
}

export default function RespondentProfileCard({
    name,
    id,
    location,
    interviewDate,
    imageUrl,
    onEdit,
}: RespondentProfileCardProps) {
    return (
        <section className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 h-full w-1 bg-primary" />

            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="flex w-full gap-5">
                    {/* Profile image */}
                    <div
                        className="h-20 w-20 shrink-0 rounded-lg bg-cover bg-center bg-no-repeat shadow-inner md:h-24 md:w-24"
                        style={{ backgroundImage: `url("${imageUrl}")` }}
                    />

                    {/* Profile info */}
                    <div className="flex flex-col justify-center gap-1">
                        <h3 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl">
                            {name}
                        </h3>
                        <div className="flex flex-col gap-1 text-sm text-green-600 sm:flex-row sm:items-center sm:gap-3">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">
                                    badge
                                </span>
                                ID: {id}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">
                                    location_on
                                </span>
                                {location}
                            </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-sm text-green-600">
                            <span className="material-symbols-outlined text-[16px]">
                                schedule
                            </span>
                            Interviewed: {interviewDate}
                        </p>
                    </div>
                </div>

                {/* Edit button */}
                {onEdit && (
                    <button
                        onClick={onEdit}
                        aria-label="Edit Profile"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-transparent text-primary transition-colors hover:border-primary/20 hover:bg-gray-50"
                    >
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                )}
            </div>
        </section>
    );
}
