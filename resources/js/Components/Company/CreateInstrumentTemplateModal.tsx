import { Icon } from '@/Components/Company';
import InstrumentTemplateForm, {
    type InstrumentTemplateFormData,
} from '@/Components/Company/InstrumentTemplateForm';
import { router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

interface CreateInstrumentTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialData: InstrumentTemplateFormData = {
    type: '',
    name: '',
    version: '',
    description: '',
    is_active: false,
};

export default function CreateInstrumentTemplateModal({
    isOpen,
    onClose,
}: CreateInstrumentTemplateModalProps): ReactNode {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [data, setDataState] = useState<InstrumentTemplateFormData>({ ...initialData });

    const setData = <K extends keyof InstrumentTemplateFormData>(
        key: K,
        value: InstrumentTemplateFormData[K],
    ) => {
        setDataState((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        setSubmitting(true);
        setErrors({});

        router.post('/templates', data as any, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                setDataState({ ...initialData });
                onClose();
            },
            onError: (errs) => {
                setErrors(errs as Record<string, string>);
                setSubmitting(false);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Tambah Template
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Buat template instrumen baru
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                    <InstrumentTemplateForm
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
                        className="rounded-lg px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 rounded-lg bg-primary-btn px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-btn/20 transition-all hover:bg-primary-btn-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? (
                            'Menyimpan...'
                        ) : (
                            <>
                                Simpan
                                <Icon name="save" className="text-sm" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
