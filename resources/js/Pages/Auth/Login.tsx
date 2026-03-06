import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
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

            <Card className="mx-auto w-full max-w-sm border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm dark:sm:bg-zinc-950">
                <CardHeader className="space-y-2 px-0 pb-6 sm:px-6">
                    <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Selamat Datang Kembali
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                        Masukkan email pengguna dan password untuk masuk ke akun
                        Anda.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-0 sm:px-6">
                    {/* Status */}
                    {status && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="text-gray-900 dark:text-gray-100"
                            >
                                Alamat Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="nama@perusahaan.com"
                                autoComplete="email"
                                autoFocus
                                className="h-11 dark:bg-zinc-900"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-gray-900 dark:text-gray-100"
                                >
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    autoComplete="current-password"
                                    className="h-11 pr-10 dark:bg-zinc-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 outline-none hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm font-medium text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                            <input
                                id="remember-me"
                                name="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                                className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                            />
                            <Label
                                htmlFor="remember-me"
                                className="cursor-pointer text-sm font-normal text-gray-600 dark:text-gray-400"
                            >
                                Ingat saya di perangkat ini
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-6 h-11 w-full bg-green-600 font-semibold text-white hover:bg-green-700"
                        >
                            {processing ? 'Memproses...' : 'Masuk ke Dashboard'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="mt-6 flex flex-col space-y-4 px-0 pb-0 sm:mt-0 sm:px-6 sm:pb-6">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Belum punya akun?{' '}
                        <Link
                            href={route('register')}
                            className="font-semibold text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
                        >
                            Daftar Gratis
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </GuestLayout>
    );
}
