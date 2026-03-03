import { FormInput, Icon } from '@/Components/Company';
import { ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────

export interface EnumeratorFormData {
    name: string;
    email: string;
    password: string;
    phone: string;
    is_active: boolean;
}

export interface EnumeratorFormErrors {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    is_active?: string;
    [key: string]: string | undefined;
}

interface EnumeratorFormProps {
    data: EnumeratorFormData;
    setData: <K extends keyof EnumeratorFormData>(
        key: K,
        value: EnumeratorFormData[K],
    ) => void;
    errors: EnumeratorFormErrors;
    isEditMode?: boolean;
}

// ─── Component ─────────────────────────────────────────────

export default function EnumeratorForm({
    data,
    setData,
    errors,
    isEditMode = false,
}: EnumeratorFormProps): ReactNode {
    return (
        <div className="space-y-6">
            {/* Nama */}
            <FormInput
                label="Nama Lengkap"
                required
                placeholder="contoh: John Doe"
                value={data.name}
                onChange={(value) => setData('name', value)}
                error={errors.name}
            />

            {/* Email */}
            <FormInput
                label="Email"
                required
                type="email"
                placeholder="contoh: john@example.com"
                value={data.email}
                onChange={(value) => setData('email', value)}
                error={errors.email}
            />

            {/* Password */}
            <FormInput
                label={isEditMode ? 'Password Baru' : 'Password'}
                required={!isEditMode}
                type="password"
                placeholder={
                    isEditMode
                        ? 'Kosongkan jika tidak ingin mengubah'
                        : 'Minimal 8 karakter'
                }
                value={data.password}
                onChange={(value) => setData('password', value)}
                error={errors.password}
                helpText={
                    isEditMode
                        ? 'Kosongkan jika tidak ingin mengubah password'
                        : 'Minimal 8 karakter'
                }
            />

            {/* Telepon */}
            <FormInput
                label="Nomor Telepon"
                placeholder="contoh: 08123456789"
                value={data.phone}
                onChange={(value) => setData('phone', value)}
                error={errors.phone}
            />

            {/* Status Aktif */}
            <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">
                    Status
                </label>
                <label className="inline-flex cursor-pointer items-center gap-3">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                        />
                        <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/30" />
                        <div className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-full" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                        {data.is_active ? (
                            <span className="flex items-center gap-1 text-green-600">
                                <Icon
                                    name="check_circle"
                                    className="text-base"
                                />
                                Aktif
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-slate-400">
                                <Icon name="cancel" className="text-base" />
                                Tidak Aktif
                            </span>
                        )}
                    </span>
                </label>
                {errors.is_active && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.is_active}
                    </p>
                )}
            </div>
        </div>
    );
}
