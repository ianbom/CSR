interface LikertScaleQuestionProps {
    questionNumber: number;
    question: string;
    name: string;
    value?: number;
    onChange?: (value: number) => void;
    isActive?: boolean;
    isAnswered?: boolean;
    minLabel?: string;
    maxLabel?: string;
    scaleSize?: number;
}

export default function LikertScaleQuestion({
    questionNumber,
    question,
    name,
    value,
    onChange,
    isActive = false,
    isAnswered = false,
    minLabel = 'Sangat Tidak Setuju',
    maxLabel = 'Sangat Setuju',
    scaleSize = 5,
}: LikertScaleQuestionProps) {
    const scales = Array.from({ length: scaleSize }, (_, i) => i + 1);

    // Card styling - consistent for all states to prevent layout shifts
    const cardClasses =
        'bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4';

    // Number badge styling - consistent color for all states
    const numberBadgeClasses =
        'flex-shrink-0 flex items-center justify-center size-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold';

    return (
        <div className={cardClasses}>
            {/* Question header */}
            <div className="flex gap-3">
                <span className={numberBadgeClasses}>{questionNumber}</span>
                <h3 className="pt-0.5 text-base font-bold leading-snug text-gray-900">
                    {question}
                </h3>
            </div>

            {/* Scale options */}
            <div className="pl-10">
                {/* Scale labels */}
                <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        {minLabel}
                    </span>
                    <span className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        {maxLabel}
                    </span>
                </div>

                {/* Scale buttons */}
                <div className="flex items-center justify-between gap-2">
                    {scales.map((scaleValue) => (
                        <button
                            key={scaleValue}
                            type="button"
                            onClick={() => onChange?.(scaleValue)}
                            className={`flex size-9 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 md:size-11 ${
                                value === scaleValue
                                    ? 'border-2 border-primary bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'border-2 border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:text-primary'
                            }`}
                        >
                            {scaleValue}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
