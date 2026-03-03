import { Icon } from '@/Components/Company';
import TemplateQuestionForm, {
    type QuestionFormData,
} from '@/Components/Company/TemplateQuestionForm';
import { router } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';

export interface QuestionData {
    id: number;
    category: string | null;
    code: string;
    questionText: string;
    orderNo: number;
    createdAt: string | null;
}

interface EditQuestionModalProps {
    isOpen: boolean;
    templateId: number;
    question: QuestionData | null;
    onClose: () => void;
}

export default function EditQuestionModal({
    isOpen,
    templateId,
    question,
    onClose,
}: EditQuestionModalProps): ReactNode {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [data, setDataState] = useState<QuestionFormData>({
        category: '',
        code: '',
        question_text: '',
        order_no: '',
    });

    useEffect(() => {
        if (isOpen && question) {
            setErrors({});
            setDataState({
                category: question.category || '',
                code: question.code,
                question_text: question.questionText,
                order_no: question.orderNo,
            });
        }
    }, [isOpen, question]);

    const setData = <K extends keyof QuestionFormData>(
        key: K,
        value: QuestionFormData[K],
    ) => {
        setDataState((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (!question) return;
        setSubmitting(true);
        setErrors({});

        router.put(
            `/templates/${templateId}/questions/${question.id}`,
            data as unknown as Record<string, unknown>,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSubmitting(false);
                    onClose();
                },
                onError: (errs) => {
                    setErrors(errs as Record<string, string>);
                    setSubmitting(false);
                },
            },
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Edit Pertanyaan
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Ubah detail pertanyaan
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <Icon name="close" className="text-lg" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <TemplateQuestionForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-lg px-5 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 rounded-lg bg-primary-btn px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primary-btn/20 transition-all hover:bg-primary-btn-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
