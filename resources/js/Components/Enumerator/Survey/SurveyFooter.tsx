import MaterialIcon from '../Icons/MaterialIcon';

interface SurveyFooterProps {
    onBack?: () => void;
    onSubmit?: () => void;
    backLabel?: string;
    submitLabel?: string;
    submitIcon?: string;
    isSubmitDisabled?: boolean;
}

export default function SurveyFooter({
    onBack,
    onSubmit,
    backLabel = 'Kembali',
    submitLabel = 'Submit Review',
    submitIcon = 'check',
    isSubmitDisabled = false,
}: SurveyFooterProps) {
    return (
        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex gap-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        {backLabel}
                    </button>
                )}
                <button
                    onClick={onSubmit}
                    disabled={isSubmitDisabled}
                    className={`flex h-12 flex-[2] items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all active:scale-[0.98] ${
                        isSubmitDisabled
                            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                            : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90'
                    }`}
                >
                    {submitIcon && (
                        <MaterialIcon
                            name={submitIcon}
                            className="text-[20px]"
                        />
                    )}
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}
