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

    // Determine card styling based on state
    const getCardClasses = () => {
        if (isActive) {
            return 'bg-white rounded-xl shadow-md shadow-primary/5 border border-primary/20 p-5 flex flex-col gap-4 relative overflow-hidden';
        }
        if (!isAnswered && !isActive) {
            return 'bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 opacity-75 hover:opacity-100 transition-opacity';
        }
        return 'bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4';
    };

    // Determine number badge styling
    const getNumberBadgeClasses = () => {
        if (isActive) {
            return 'flex-shrink-0 flex items-center justify-center size-7 rounded-full bg-primary text-white text-sm font-bold';
        }
        if (isAnswered) {
            return 'flex-shrink-0 flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary text-sm font-bold';
        }
        return 'flex-shrink-0 flex items-center justify-center size-7 rounded-full bg-gray-100 text-gray-500 text-sm font-bold';
    };

    return (
        <div className={getCardClasses()}>
            {/* Active indicator bar */}
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            )}

            {/* Question header */}
            <div className="flex gap-3">
                <span className={getNumberBadgeClasses()}>{questionNumber}</span>
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
                        <label
                            key={scaleValue}
                            className="group cursor-pointer flex flex-col items-center gap-1"
                        >
                            <input
                                type="radio"
                                name={name}
                                value={scaleValue}
                                checked={value === scaleValue}
                                onChange={() => onChange?.(scaleValue)}
                                className="peer sr-only"
                            />
                            <div
                                className={`size-9 md:size-11 rounded-full bg-white border flex items-center justify-center text-sm font-medium transition-all hover:border-primary/50 ${
                                    value === scaleValue
                                        ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                                        : 'border-gray-300 text-gray-500'
                                }`}
                            >
                                {scaleValue}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
