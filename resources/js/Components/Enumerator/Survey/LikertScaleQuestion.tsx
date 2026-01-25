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
    const cardClasses = 'bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4';

    // Number badge styling - consistent color for all states
    const numberBadgeClasses = 'flex-shrink-0 flex items-center justify-center size-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold';

    return (
        <div className={cardClasses}>
            {/* Question header */}
            <div className="flex gap-3">
                <span className={numberBadgeClasses}>{questionNumber}</span>
                <h3 className="text-base font-bold text-gray-900 leading-snug pt-0.5">
                    {question}
                </h3>
            </div>

            {/* Scale options */}
            <div className="pl-10">
                {/* Scale labels */}
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {minLabel}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
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
                            className={`size-9 md:size-11 rounded-full flex items-center justify-center text-sm font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 ${value === scaleValue
                                    ? 'bg-primary border-2 border-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary'
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
