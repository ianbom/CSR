import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function LoginEnum({ status }: { status?: string }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.enum'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center p-4">
            <Head title="Enumerator Login" />
            
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white/10 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl border border-white/20 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)]">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-inner">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                        Enumerator
                    </h1>
                    <p className="mt-2 text-sm text-emerald-100">
                        Masuk untuk melanjutkan ke dashboard.
                    </p>
                </div>

                {status && (
                    <div className="mb-6 rounded-xl border border-emerald-400/50 bg-emerald-500/20 px-4 py-3 text-sm font-medium text-white backdrop-blur-md">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2 relative group">
                        <Label
                            htmlFor="email"
                            className="text-emerald-50 ml-1 text-sm font-medium transition-colors group-focus-within:text-white"
                        >
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                            autoComplete="email"
                            autoFocus
                            className="h-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50 focus:bg-white/20 focus:ring-0 focus:outline-none transition-all duration-300"
                        />
                        {errors.email && (
                            <p className="mt-1 ml-1 text-sm font-medium text-red-300 bg-red-900/30 px-2 py-1 rounded-md inline-block">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 relative group">
                        <Label
                            htmlFor="password"
                            className="text-emerald-50 ml-1 text-sm font-medium transition-colors group-focus-within:text-white"
                        >
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="h-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50 focus:bg-white/20 focus:ring-0 focus:outline-none transition-all duration-300 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex h-full w-12 items-center justify-center text-white/70 hover:text-white transition-colors outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 ml-1 text-sm font-medium text-red-300 bg-red-900/30 px-2 py-1 rounded-md inline-block">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="mt-8 h-12 w-full rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                    </Button>
                </form>
            </div>
            
            <div className="fixed bottom-6 text-center w-full pointer-events-none">
                <p className="text-white/60 text-sm drop-shadow-sm font-medium">Aplikasi Mobile Enumerator CSR</p>
            </div>
        </div>
    );
}
