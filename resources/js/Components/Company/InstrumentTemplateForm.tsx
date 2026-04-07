import { FormInput, FormTextarea, Icon } from '@/Components/Company';
import { ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────

export interface InstrumentTemplateFormData {
    type: 'IKM' | 'SLOI' | '';
    name: string;
    version: number | '';
    description: string;
    is_active: boolean;
}

export interface InstrumentTemplateFormErrors {
    type?: string;
    name?: string;
    version?: string;
    description?: string;
    is_active?: string;
    [key: string]: string | undefined;
}

interface InstrumentTemplateFormProps {
    data: InstrumentTemplateFormData;
    setData: <K extends keyof InstrumentTemplateFormData>(
        key: K,
        value: InstrumentTemplateFormData[K],
    ) => void;
    errors: InstrumentTemplateFormErrors;
    isEditMode?: boolean;
}

// ─── Component ─────────────────────────────────────────────

export default function InstrumentTemplateForm({
    data,
    setData,
    errors,
    isEditMode = false,
}: InstrumentTemplateFormProps): ReactNode {
    return (
        <div className="space-y-6">
            {/* Tipe Template */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    Tipe Template
                    <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                    {(['IKM', 'SLOI'] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setData('type', type)}
                            className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${data.type === type
                                    ? type === 'IKM'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-violet-500 bg-violet-50 text-violet-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                {errors.type && (
                    <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                )}
            </div>

            {/* Nama Template */}
            <FormInput
                label="Nama Template"
                required
                placeholder="contoh: Template IKM Standar"
                value={data.name}
                onChange={(value) => setData('name', value)}
                error={errors.name}
            />

            {/* Versi */}
            <FormInput
                label="Versi"
                required
                type="number"
                placeholder="contoh: 1"
                value={data.version === '' ? '' : data.version}
                onChange={(value) =>
                    setData('version', value === '' ? '' : Number(value))
                }
                error={errors.version}
            />

            {/* Deskripsi */}
            <FormTextarea
                label="Deskripsi"
                placeholder="Deskripsi singkat tentang template ini..."
                value={data.description}
                onChange={(value) => setData('description', value)}
                rows={3}
                error={errors.description}
            />

            {/* Status Aktif (only in edit mode) */}
            {isEditMode && (
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">
                        Status
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-3">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                                className="peer sr-only"
                            />
                            <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-500 peer-focus:ring-4 peer-focus:ring-emerald-500/20" />
                            <div className="absolute left-[2px] top-[2px] size-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                            {data.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                    </label>
                    {data.is_active && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                            <Icon name="warning" className="text-sm" />
                            Mengaktifkan template ini akan menonaktifkan
                            template {data.type || ''} lain yang sedang aktif.
                        </p>
                    )}
                    {errors.is_active && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.is_active}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
