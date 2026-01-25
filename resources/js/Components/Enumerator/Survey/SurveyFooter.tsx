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
        <div className="p-4 bg-white border border-gray-100 rounded-xl mt-4">
            <div className="flex gap-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-sm transition-colors hover:bg-gray-50"
                    >
                        {backLabel}
                    </button>
                )}
                <button
                    onClick={onSubmit}
                    disabled={isSubmitDisabled}
                    className={`flex-[2] h-12 flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all active:scale-[0.98] ${
                        isSubmitDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90'
                    }`}
                >
                    {submitIcon && (
                        <MaterialIcon name={submitIcon} className="text-[20px]" />
                    )}
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}
