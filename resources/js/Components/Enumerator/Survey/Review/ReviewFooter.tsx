interface ReviewFooterProps {
    onBack: () => void;
    onSaveDraft?: () => void;
    onSubmit: () => void;
    onSubmitAndContinue?: () => void;
    backLabel?: string;
    saveDraftLabel?: string;
    submitLabel?: string;
    submitAndContinueLabel?: string;
    isSubmitting?: boolean;
}

export default function ReviewFooter({
    onBack,
    onSaveDraft,
    onSubmit,
    onSubmitAndContinue,
    backLabel = 'Back to Edit',
    saveDraftLabel = 'Save Draft',
    submitLabel = 'Submit Final',
    submitAndContinueLabel = 'Submit & Isi Lagi',
    isSubmitting = false,
}: ReviewFooterProps) {
    return (
        <div className="w-full border-t border-gray-100 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:p-5">
            <div className="mx-auto flex max-w-[960px] flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                {/* Back button */}
                <button
                    onClick={onBack}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-6 text-base font-bold text-green-600 transition-colors hover:bg-gray-50 sm:w-auto"
                >
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                    {backLabel}
                </button>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                    {/* Save draft button */}
                    {onSaveDraft && (
                        <button
                            onClick={onSaveDraft}
                            className="hidden h-12 w-full items-center justify-center rounded-lg border border-gray-200 px-4 text-base font-bold text-gray-900 transition-colors hover:bg-gray-50 sm:flex sm:w-auto"
                        >
                            {saveDraftLabel}
                        </button>
                    )}

                    {/* Submit & Continue button */}
                    {onSubmitAndContinue && (
                        <button
                            onClick={onSubmitAndContinue}
                            disabled={isSubmitting}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-primary px-6 text-base font-bold text-primary transition-all hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            <span>{submitAndContinueLabel}</span>
                            <span className="material-symbols-outlined">
                                refresh
                            </span>
                        </button>
                    )}

                    {/* Submit Final button */}
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        <span>{submitLabel}</span>
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
