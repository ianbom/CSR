import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f0f0] px-4 py-10 font-sans">
            <Head title="Masuk" />

            {/* Logo + App name */}
            <div className="mb-6 flex flex-col items-center gap-2">
                {/* <div className="flex size-14 items-center justify-center rounded-xl bg-[#1a6b35] shadow-md">
                    <svg
                        viewBox="0 0 32 32"
                        fill="none"
                        className="size-8"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8 6h4v16h10v4H8V6z"
                            fill="white"
                        />
                    </svg>
                </div> */}
                <span className="text-lg font-bold tracking-wide text-[#1a6b35]">
                    SaaS Survey Platform
                </span>
            </div>

            {/* Card */}
            <div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-sm">
                {/* Status */}
                {status && (
                    <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                        {status}
                    </div>
                )}

                {/* Heading */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Masuk ke Akun Anda
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        Silakan masukkan detail akun Anda untuk melanjutkan
                        <br />
                        akses dashboard survey.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Email atau Username
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </span>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="nama@email.com"
                                autoComplete="username"
                                autoFocus
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1a6b35] focus:outline-none focus:ring-2 focus:ring-[#1a6b35]/20"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-slate-700"
                            >
                                Password
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-semibold text-[#1a6b35] hover:underline"
                                >
                                    Lupa Password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </span>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                autoComplete="current-password"
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1a6b35] focus:outline-none focus:ring-2 focus:ring-[#1a6b35]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 transition-colors hover:text-slate-600"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="size-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="size-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember me */}
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                            className="size-4 rounded border-slate-300 text-[#1a6b35] focus:ring-[#1a6b35]/30"
                        />
                        <span className="text-sm text-slate-600">
                            Ingat saya di perangkat ini
                        </span>
                    </label>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a6b35] py-3 text-sm font-bold text-white shadow-md shadow-[#1a6b35]/30 transition-all hover:bg-[#155c2c] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Masuk ke Dashboard
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                        </svg>
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 border-t border-slate-100" />

                {/* Register link */}
                <p className="text-center text-sm text-slate-500">
                    Belum punya akun?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-[#1a6b35] hover:underline"
                    >
                        Daftar Sekarang
                    </Link>
                </p>
            </div>

            {/* Footer links */}
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
                <a href="#" className="hover:text-slate-600">
                    Pusat Bantuan
                </a>
                <span>•</span>
                <a href="#" className="hover:text-slate-600">
                    Kebijakan Privasi
                </a>
                <span>•</span>
                <a href="#" className="hover:text-slate-600">
                    Syarat &amp; Ketentuan
                </a>
            </div>

            {/* Copyright */}
            <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-slate-400">
                © 2024 SaaS Survey Platform. Produk Layanan Pemerintah Digital.
            </p>
        </div>
    );
}
