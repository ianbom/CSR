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

        if (!data.name.trim()) {
            errs.name = 'Nama lengkap wajib diisi.';
        }
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
        if (validateStep1()) {
            setStep(2);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Buat Akun" />

            <Card className="mx-auto w-full max-w-md border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm dark:sm:bg-zinc-950">
                <CardHeader className="space-y-2 px-0 pb-6 sm:px-6">
                    <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {step === 1 ? 'Buat Akun Baru' : 'Data Perusahaan'}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                        {step === 1
                            ? 'Langkah 1 dari 2 — Isi data akun Anda.'
                            : 'Langkah 2 dari 2 — Isi data perusahaan Anda.'}
                    </CardDescription>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 pt-2">
                        <div
                            className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-green-600' : 'bg-gray-200 dark:bg-zinc-700'}`}
                        />
                        <div
                            className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200 dark:bg-zinc-700'}`}
                        />
                    </div>
                </CardHeader>

                <CardContent className="px-0 sm:px-6">
                    <form onSubmit={submit} className="space-y-5">
                        {/* ── Step 1: Data Akun ── */}
                        {step === 1 && (
                            <>
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
                                    {(stepErrors.name || errors.name) && (
                                        <p className="mt-1 text-sm font-medium text-red-500">
                                            {stepErrors.name || errors.name}
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
                                    {(stepErrors.email || errors.email) && (
                                        <p className="mt-1 text-sm font-medium text-red-500">
                                            {stepErrors.email || errors.email}
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
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            autoComplete="new-password"
                                            className="h-11 pr-10 dark:bg-zinc-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((v) => !v)
                                            }
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
                                    {(stepErrors.password ||
                                        errors.password) && (
                                        <p className="mt-1 text-sm font-medium text-red-500">
                                            {stepErrors.password ||
                                                errors.password}
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
                                                setShowPasswordConfirmation(
                                                    (v) => !v,
                                                )
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
                                    {(stepErrors.password_confirmation ||
                                        errors.password_confirmation) && (
                                        <p className="mt-1 text-sm font-medium text-red-500">
                                            {stepErrors.password_confirmation ||
                                                errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    onClick={goToStep2}
                                    className="mt-6 h-11 w-full bg-green-600 font-semibold text-white hover:bg-green-700"
                                >
                                    Selanjutnya
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </>
                        )}

                        {/* ── Step 2: Data Perusahaan ── */}
                        {step === 2 && (
                            <>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="company_name"
                                        className="text-gray-900 dark:text-gray-100"
                                    >
                                        Nama Perusahaan{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="company_name"
                                        type="text"
                                        name="company_name"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                'company_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="PT Contoh Sejahtera"
                                        autoFocus
                                        className="h-11 dark:bg-zinc-900"
                                    />
                                    {errors.company_name && (
                                        <p className="mt-1 text-sm font-medium text-red-500">
                                            {errors.company_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="company_email"
                                        className="text-gray-900 dark:text-gray-100"
                                    >
                                        Email Perusahaan
                                    </Label>
                                    <Input
                                        id="company_email"
                                        type="email"
                                        name="company_email"
                                        value={data.company_email}
                                        onChange={(e) =>
                                            setData(
                                                'company_email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="info@perusahaan.com"
                                        className="h-11 dark:bg-zinc-900"
                                    />
                                    {errors.company_email && (
                                        <p className="mt-1 text-sm font-medium text-red-500">
                                            {errors.company_email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="company_phone"
                                        className="text-gray-900 dark:text-gray-100"
                                    >
                                        Telepon Perusahaan
                                    </Label>
                                    <Input
                                        id="company_phone"
                                        type="text"
                                        name="company_phone"
                                        value={data.company_phone}
                                        onChange={(e) =>
                                            setData(
                                                'company_phone',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="021-12345678"
                                        className="h-11 dark:bg-zinc-900"
                                    />
                                    {errors.company_phone && (
                                        <p className="mt-1 text-sm font-medium text-red-500">
                                            {errors.company_phone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="company_address"
                                        className="text-gray-900 dark:text-gray-100"
                                    >
                                        Alamat Perusahaan
                                    </Label>
                                    <Input
                                        id="company_address"
                                        type="text"
                                        name="company_address"
                                        value={data.company_address}
                                        onChange={(e) =>
                                            setData(
                                                'company_address',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jl. Contoh No. 123, Jakarta"
                                        className="h-11 dark:bg-zinc-900"
                                    />
                                    {errors.company_address && (
                                        <p className="mt-1 text-sm font-medium text-red-500">
                                            {errors.company_address}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        variant="outline"
                                        className="h-11 flex-1 font-semibold"
                                    >
                                        <ArrowLeft className="mr-2 size-4" />
                                        Kembali
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 flex-1 bg-green-600 font-semibold text-white hover:bg-green-700"
                                    >
                                        {processing
                                            ? 'Memproses...'
                                            : 'Daftar Sekarang'}
                                    </Button>
                                </div>
                            </>
                        )}

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
