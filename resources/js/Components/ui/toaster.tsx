import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ToastItem {
    id: number;
    type: 'success' | 'error';
    message: string;
    exiting: boolean;
}

let toastId = 0;

export function Toaster() {
    const { flash } = usePage().props as {
        flash?: { success?: string | null; error?: string | null };
    };

    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismiss = (id: number) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
        );
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 350);
    };

    useEffect(() => {
        const messages: { type: 'success' | 'error'; message: string }[] = [];

        if (flash?.success) {
            messages.push({ type: 'success', message: flash.success });
        }
        if (flash?.error) {
            messages.push({ type: 'error', message: flash.error });
        }

        if (messages.length === 0) return;

        const newToasts: ToastItem[] = messages.map((m) => ({
            id: ++toastId,
            type: m.type,
            message: m.message,
            exiting: false,
        }));

        setToasts((prev) => [...prev, ...newToasts]);

        const timers = newToasts.map((t) =>
            setTimeout(() => dismiss(t.id), 4500),
        );

        return () => timers.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        'relative flex w-80 items-start gap-3 overflow-hidden rounded-xl border px-4 py-3.5 shadow-xl',
                        'backdrop-blur-md',
                        toast.exiting
                            ? 'animate-toast-out'
                            : 'animate-toast-in',
                        toast.type === 'success'
                            ? 'border-green-200 bg-white/95 dark:border-green-800 dark:bg-slate-900/95'
                            : 'border-red-200 bg-white/95 dark:border-red-800 dark:bg-slate-900/95',
                    )}
                >
                    {/* Accent bar */}
                    <div
                        className={cn(
                            'absolute inset-y-0 left-0 w-1 rounded-l-xl',
                            toast.type === 'success'
                                ? 'bg-green-500'
                                : 'bg-red-500',
                        )}
                    />

                    {/* Icon */}
                    <div
                        className={cn(
                            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
                            toast.type === 'success'
                                ? 'bg-green-100 dark:bg-green-900/40'
                                : 'bg-red-100 dark:bg-red-900/40',
                        )}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle2
                                className="size-4 text-green-600 dark:text-green-400"
                            />
                        ) : (
                            <AlertCircle
                                className="size-4 text-red-600 dark:text-red-400"
                            />
                        )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 pl-1">
                        <p
                            className={cn(
                                'text-[11px] font-bold uppercase tracking-widest',
                                toast.type === 'success'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400',
                            )}
                        >
                            {toast.type === 'success' ? 'Berhasil' : 'Gagal'}
                        </p>
                        <p className="mt-0.5 text-sm leading-snug text-slate-700 dark:text-slate-200">
                            {toast.message}
                        </p>
                    </div>

                    {/* Close */}
                    <button
                        onClick={() => dismiss(toast.id)}
                        className="mt-0.5 shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                    >
                        <X className="size-3.5" />
                    </button>

                    {/* Progress bar */}
                    <div
                        className={cn(
                            'absolute bottom-0 left-0 h-0.5',
                            !toast.exiting ? 'animate-toast-progress' : '',
                            toast.type === 'success'
                                ? 'bg-green-500/40'
                                : 'bg-red-500/40',
                        )}
                    />
                </div>
            ))}
        </div>
    );
}
