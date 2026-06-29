import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const [step, setStep] = useState<1 | 2>(1);
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        company_name: '',
        company_email: '',
        company_phone: '',
        company_address: '',
    });

    const validateStep1 = (): boolean => {
        const errs: Record<string, string> = {};

        if (!data.name.trim()) errs.name = 'Nama lengkap wajib diisi.';
        if (!data.email.trim()) {
            errs.email = 'Alamat email wajib diisi.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errs.email = 'Format email tidak valid.';
        }
        if (!data.password) {
            errs.password = 'Password wajib diisi.';
        } else if (data.password.length < 8) {
            errs.password = 'Password minimal 8 karakter.';
        }
        if (data.password !== data.password_confirmation) {
            errs.password_confirmation = 'Konfirmasi password tidak cocok.';
        }

        setStepErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const goToStep2 = () => {
        if (validateStep1()) setStep(2);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Shared input class — identical to Login page
    const inputClass =
        'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors';

    return (
        <GuestLayout>
            <Head title="Buat Akun" />

            {/* Heading */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    {step === 1 ? 'Buat Akun Baru' : 'Detail Perusahaan'}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    {step === 1
                        ? 'Langkah 1 dari 2 — Isi informasi akun pribadi Anda.'
                        : 'Langkah 2 dari 2 — Beritahu kami tentang perusahaan Anda.'}
                </p>
            </div>

            {/* Step Progress Bar */}
            <div className="mb-6 flex items-center gap-2">
                <div
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-gray-900' : 'bg-gray-200'}`}
                />
                <div
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`}
                />
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* ── Step 1: Account Data ── */}
                {step === 1 && (
                    <>
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Masukkan nama lengkap Anda"
                                autoComplete="name"
                                autoFocus
                                className={inputClass}
                            />
                            {(stepErrors.name || errors.name) && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {stepErrors.name || errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="Masukkan email Anda"
                                autoComplete="email"
                                className={inputClass}
                            />
                            {(stepErrors.email || errors.email) && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {stepErrors.email || errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Buat password baru"
                                    autoComplete="new-password"
                                    className={`${inputClass} pr-11`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 transition-colors hover:text-gray-600"
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {(stepErrors.password || errors.password) && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {stepErrors.password || errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type={
                                        showPasswordConfirmation
                                            ? 'text'
                                            : 'password'
                                    }
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ulangi password Anda"
                                    autoComplete="new-password"
                                    className={`${inputClass} pr-11`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswordConfirmation((v) => !v)
                                    }
                                    className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 transition-colors hover:text-gray-600"
                                    tabIndex={-1}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {(stepErrors.password_confirmation ||
                                errors.password_confirmation) && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {stepErrors.password_confirmation ||
                                        errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* Next button */}
                        <button
                            type="button"
                            onClick={goToStep2}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-700"
                        >
                            Selanjutnya
                            <ArrowRight className="size-4" />
                        </button>
                    </>
                )}

                {/* ── Step 2: Company Data ── */}
                {step === 2 && (
                    <>
                        {/* Company Name */}
                        <div>
                            <label
                                htmlFor="company_name"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Nama Perusahaan{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="company_name"
                                type="text"
                                name="company_name"
                                value={data.company_name}
                                onChange={(e) =>
                                    setData('company_name', e.target.value)
                                }
                                placeholder="PT Contoh Sejahtera"
                                autoFocus
                                className={inputClass}
                            />
                            {errors.company_name && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.company_name}
                                </p>
                            )}
                        </div>

                        {/* Company Email */}
                        <div>
                            <label
                                htmlFor="company_email"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Email Perusahaan
                            </label>
                            <input
                                id="company_email"
                                type="email"
                                name="company_email"
                                value={data.company_email}
                                onChange={(e) =>
                                    setData('company_email', e.target.value)
                                }
                                placeholder="info@perusahaan.com"
                                className={inputClass}
                            />
                            {errors.company_email && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.company_email}
                                </p>
                            )}
                        </div>

                        {/* Company Phone */}
                        <div>
                            <label
                                htmlFor="company_phone"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Nomor Telepon Perusahaan
                            </label>
                            <input
                                id="company_phone"
                                type="text"
                                name="company_phone"
                                value={data.company_phone}
                                onChange={(e) =>
                                    setData('company_phone', e.target.value)
                                }
                                placeholder="021-12345678"
                                className={inputClass}
                            />
                            {errors.company_phone && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.company_phone}
                                </p>
                            )}
                        </div>

                        {/* Company Address */}
                        <div>
                            <label
                                htmlFor="company_address"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Alamat Perusahaan
                            </label>
                            <input
                                id="company_address"
                                type="text"
                                name="company_address"
                                value={data.company_address}
                                onChange={(e) =>
                                    setData('company_address', e.target.value)
                                }
                                placeholder="Jl. Contoh No. 123, Jakarta"
                                className={inputClass}
                            />
                            {errors.company_address && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.company_address}
                                </p>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                            >
                                <ArrowLeft className="size-4" />
                                Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-full bg-gray-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Memproses...' : 'Daftar'}
                            </button>
                        </div>
                    </>
                )}

                {/* Terms notice */}
                <p className="pt-1 text-center text-xs text-gray-400">
                    Dengan mendaftar, Anda menyetujui Syarat & Ketentuan dan
                    Kebijakan Privasi kami.
                </p>
            </form>

            {/* Sign in link */}
            <p className="mt-6 text-center text-sm text-gray-500">
                Sudah punya akun?{' '}
                <Link
                    href={route('login')}
                    className="font-bold text-gray-900 hover:underline"
                >
                    Masuk di sini
                </Link>
            </p>
        </GuestLayout>
    );
}
