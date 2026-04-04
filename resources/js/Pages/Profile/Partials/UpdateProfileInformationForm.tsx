import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Briefcase, CheckCircle, Mail, Phone, User } from 'lucide-react';
import { FormEventHandler } from 'react';

type UserProps = {
    name: string;
    email: string;
    email_verified_at?: string | null;
    phone?: string;
    position?: string;
};

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user as UserProps;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            position: user.position ?? '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const inputClass =
        'block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100';

    return (
        <form onSubmit={submit} className="space-y-5">
            {/* Name & Position */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Masukkan nama lengkap"
                            className={inputClass}
                        />
                    </div>
                    <InputError className="mt-1.5" message={errors.name} />
                </div>

                <div>
                    <label
                        htmlFor="position"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Jabatan / Posisi
                    </label>
                    <div className="relative mt-1">
                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="position"
                            type="text"
                            value={data.position}
                            onChange={(e) =>
                                setData('position', e.target.value)
                            }
                            autoComplete="organization-title"
                            placeholder="Contoh: Manager CSR"
                            className={inputClass}
                        />
                    </div>
                    <InputError className="mt-1.5" message={errors.position} />
                </div>
            </div>

            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                >
                    Alamat Email <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="contoh@email.com"
                        className={inputClass}
                    />
                </div>
                <InputError className="mt-1.5" message={errors.email} />
            </div>

            {/* Phone */}
            <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700"
                >
                    Nomor Telepon
                </label>
                <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        autoComplete="tel"
                        placeholder="+62 812 3456 7890"
                        className={inputClass}
                    />
                </div>
                <InputError className="mt-1.5" message={errors.phone} />
            </div>

            {/* Email verification notice */}
            {mustVerifyEmail && user.email_verified_at === null && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-amber-800">
                        Alamat email Anda belum diverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-medium underline hover:text-amber-900"
                        >
                            Kirim ulang email verifikasi.
                        </Link>
                    </p>
                    {status === 'verification-link-sent' && (
                        <p className="mt-2 text-sm font-medium text-green-700">
                            Link verifikasi baru telah dikirim ke email Anda.
                        </p>
                    )}
                </div>
            )}

            {/* Submit */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
                >
                    {processing && (
                        <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    )}
                    Simpan Perubahan
                </button>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out duration-300"
                    enterFrom="opacity-0 translate-y-1"
                    leave="transition ease-in-out duration-300"
                    leaveTo="opacity-0"
                >
                    <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Tersimpan!
                    </div>
                </Transition>
            </div>
        </form>
    );
}
