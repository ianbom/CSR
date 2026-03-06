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

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Buat Akun" />

            <Card className="mx-auto w-full max-w-sm border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm dark:sm:bg-zinc-950">
                <CardHeader className="space-y-2 px-0 pb-6 sm:px-6">
                    <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Daftarkan Akun Baru
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                        Isi form di bawah ini untuk membuat akun
                        SocialImpact.id.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-0 sm:px-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="name"
                                className="text-gray-900 dark:text-gray-100"
                            >
                                Nama Lengkap
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="John Doe"
                                autoComplete="name"
                                autoFocus
                                className="h-11 dark:bg-zinc-900"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm font-medium text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                                className="h-11 dark:bg-zinc-900"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password"
                                className="text-gray-900 dark:text-gray-100"
                            >
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    autoComplete="new-password"
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

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-gray-900 dark:text-gray-100"
                            >
                                Konfirmasi Password
                            </Label>
                            <div className="relative">
                                <Input
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
                                    autoComplete="new-password"
                                    className="h-11 pr-10 dark:bg-zinc-900"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswordConfirmation((v) => !v)
                                    }
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 outline-none hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPasswordConfirmation ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm font-medium text-red-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-6 h-11 w-full bg-green-600 font-semibold text-white hover:bg-green-700"
                        >
                            {processing ? 'Memproses...' : 'Daftar Sekarang'}
                        </Button>

                        <p className="mt-4 text-center text-xs text-gray-500">
                            Dengan mendaftar, Anda menyetujui Syarat & Ketentuan
                            serta Kebijakan Privasi kami.
                        </p>
                    </form>
                </CardContent>

                <CardFooter className="mt-6 flex flex-col space-y-4 px-0 pb-0 sm:mt-0 sm:px-6 sm:pb-6">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Sudah punya akun?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
                        >
                            Masuk Sekarang
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </GuestLayout>
    );
}
