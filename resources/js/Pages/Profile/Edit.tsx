import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Briefcase,
    Phone,
    ShieldAlert,
    User,
    UserCircle,
} from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
}>) {
    const user = usePage().props.auth.user as {
        name: string;
        email: string;
        role: string;
        phone?: string;
        position?: string;
    };

    const roleLabels: Record<string, { label: string; color: string }> = {
        superadmin: {
            label: 'Super Admin',
            color: 'bg-purple-100 text-purple-700',
        },
        admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700' },
        company: { label: 'Company', color: 'bg-green-100 text-green-700' },
        enumerator: {
            label: 'Enumerator',
            color: 'bg-orange-100 text-orange-700',
        },
        user: { label: 'User', color: 'bg-slate-100 text-slate-700' },
    };

    const roleInfo = roleLabels[user.role] ?? {
        label: user.role,
        color: 'bg-gray-100 text-gray-700',
    };

    const initials = user.name
        ? user.name
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase()
        : '?';

    return (
        <AppLayout breadcrumb={{ parent: 'Profile', current: 'Edit' }}>
            <Head title="Profile" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Hero Card */}
                    <div className="relative mb-8 overflow-hidden bg-primary rounded-2xl p-8 text-white shadow-xl">
                        {/* Dot pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }}
                        />
                        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                            {/* Avatar circle */}
                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-bold">{user.name}</h1>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${roleInfo.color}`}
                                    >
                                        {roleInfo.label}
                                    </span>
                                </div>
                                <p className="mt-1 text-blue-200 text-sm">{user.email}</p>
                                {user.position && (
                                    <p className="mt-1 flex items-center gap-1 text-blue-100 text-sm">
                                        <Briefcase className="h-3.5 w-3.5" />
                                        {user.position}
                                    </p>
                                )}
                                {user.phone && (
                                    <p className="mt-0.5 flex items-center gap-1 text-blue-100 text-sm">
                                        <Phone className="h-3.5 w-3.5" />
                                        {user.phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left - forms */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Profile Info */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-800">
                                            Informasi Profil
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Perbarui data pribadi Anda
                                        </p>
                                    </div>
                                </div>
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>

                            {/* Password */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                                        <ShieldAlert className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-800">
                                            Kata Sandi
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Gunakan kata sandi yang kuat dan unik
                                        </p>
                                    </div>
                                </div>
                                <UpdatePasswordForm />
                            </div>
                        </div>

                        {/* Right - info + danger */}
                        <div className="space-y-6">
                            {/* Account info card */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                        <UserCircle className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <h2 className="text-base font-semibold text-slate-800">
                                        Info Akun
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                        <span className="text-xs text-slate-500">
                                            Role
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleInfo.color}`}
                                        >
                                            {roleInfo.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                        <span className="text-xs text-slate-500">
                                            Status Email
                                        </span>
                                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                            Terverifikasi
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs text-slate-400">
                                    Role hanya dapat diubah oleh administrator.
                                </p>
                            </div>

                            {/* Delete Account */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-red-100">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                                        <ShieldAlert className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-800">
                                            Hapus Akun
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Tindakan ini tidak dapat dibatalkan
                                        </p>
                                    </div>
                                </div>
                                <DeleteUserForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
