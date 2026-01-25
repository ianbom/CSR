import { ReactNode } from 'react';
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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-2xl mx-auto flex gap-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-transparent text-gray-700 font-bold text-sm transition-colors hover:bg-gray-50"
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
