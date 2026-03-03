import { ReactNode } from 'react';

interface QuestionFormData {
    category: string;
    code: string;
    question_text: string;
    order_no: number | '';
}

interface TemplateQuestionFormProps {
    data: QuestionFormData;
    setData: <K extends keyof QuestionFormData>(
        key: K,
        value: QuestionFormData[K],
    ) => void;
    errors: Record<string, string>;
}

export type { QuestionFormData };

export default function TemplateQuestionForm({
    data,
    setData,
    errors,
}: TemplateQuestionFormProps): ReactNode {
    return (
        <div className="space-y-5">
            {/* Code */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Kode Pertanyaan <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="Contoh: U1, U2, P1"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.code && (
                    <p className="mt-1 text-xs text-red-500">{errors.code}</p>
                )}
            </div>

            {/* Category */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Kategori
                </label>
                <input
                    type="text"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    placeholder="Contoh: Unsur Pelayanan, Persepsi"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.category && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.category}
                    </p>
                )}
            </div>

            {/* Question Text */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Teks Pertanyaan <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={data.question_text}
                    onChange={(e) => setData('question_text', e.target.value)}
                    placeholder="Masukkan teks pertanyaan..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.question_text && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.question_text}
                    </p>
                )}
            </div>

            {/* Order No */}
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Urutan
                </label>
                <input
                    type="number"
                    value={data.order_no}
                    onChange={(e) =>
                        setData(
                            'order_no',
                            e.target.value ? Number(e.target.value) : '',
                        )
                    }
                    placeholder="Otomatis jika kosong"
                    min={1}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.order_no && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.order_no}
                    </p>
                )}
            </div>
        </div>
    );
}
