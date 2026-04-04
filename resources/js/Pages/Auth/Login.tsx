import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
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
        <GuestLayout>
            <Head title="Masuk" />

            {/* Heading */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Selamat Datang Kembali
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Masuk untuk mengelola program CSR Anda dengan mudah.
                </p>
            </div>

            {/* Status message */}
            {status && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
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
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Masukkan email Anda"
                        autoComplete="email"
                        autoFocus
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                            {errors.email}
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
                            placeholder="Masukkan password Anda"
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
                    {errors.password && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between pt-0.5">
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="size-4 rounded border-gray-300 text-gray-900 accent-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-600">
                            Ingat Saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-gray-900 hover:underline"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                {/* Login button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="mt-2 w-full rounded-full bg-gray-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>
            </form>

            {/* Sign up */}
            <p className="mt-8 text-center text-sm text-gray-500">
                Belum punya akun?{' '}
                <Link
                    href={route('register')}
                    className="font-bold text-gray-900 hover:underline"
                >
                    Daftar di sini
                </Link>
            </p>
        </GuestLayout>
    );
}
