import AppLayout from '@/Layouts/AppLayout';
import EnumeratorLayout from '@/Layouts/EnumeratorLayout';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Briefcase,
    Building2,
    LogOut,
    Phone,
    ShieldAlert,
    User,
    UserCircle,
} from 'lucide-react';
import UpdateCompanyInformationForm from './Partials/UpdateCompanyInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

type CompanyProps = {
    id: number;
    name: string;
    legal_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    status: string;
};

export default function Edit({
    mustVerifyEmail,
    status,
    company,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    company?: CompanyProps;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Layout = (
        user.role === 'enumerator' ? EnumeratorLayout : AppLayout
    ) as any;

    return (
        <Layout
            {...(user.role === 'enumerator'
                ? { activeNav: 'profil' }
                : {
                      breadcrumb: { parent: 'Profile', current: 'Edit' },
                  })}
        >
            <Head title="Profile" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Hero Card */}
                    <div className="relative mb-8 overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl">
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
                                    <h1 className="text-2xl font-bold">
                                        {user.name}
                                    </h1>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${roleInfo.color}`}
                                    >
                                        {roleInfo.label}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-blue-200">
                                    {user.email}
                                </p>
                                {user.position && (
                                    <p className="mt-1 flex items-center gap-1 text-sm text-blue-100">
                                        <Briefcase className="h-3.5 w-3.5" />
                                        {user.position}
                                    </p>
                                )}
                                {user.phone && (
                                    <p className="mt-0.5 flex items-center gap-1 text-sm text-blue-100">
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
                            {/* Company Info - Only for company role users */}
                            {['company', 'enumerator'].includes(user.role) &&
                                company && (
                                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                        <div className="mb-6 flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                                <Building2 className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-semibold text-slate-800">
                                                    Informasi Perusahaan
                                                </h2>
                                                <p className="text-xs text-slate-500">
                                                    {user.role === 'company'
                                                        ? 'Perbarui data perusahaan Anda'
                                                        : 'Detail perusahaan Anda'}
                                                </p>
                                            </div>
                                        </div>

                                        {user.role === 'company' ? (
                                            <UpdateCompanyInformationForm
                                                company={company}
                                            />
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-sm font-medium text-slate-500">
                                                        Nama Perusahaan
                                                    </div>
                                                    <div className="mt-1 text-sm text-slate-900">
                                                        {company.name}
                                                    </div>
                                                </div>
                                                {(company.legal_name ||
                                                    company.phone ||
                                                    company.email ||
                                                    company.address) && (
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        {company.legal_name && (
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500">
                                                                    Nama Legal
                                                                    Perusahaan
                                                                </div>
                                                                <div className="mt-1 text-sm text-slate-900">
                                                                    {
                                                                        company.legal_name
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                        {company.phone && (
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500">
                                                                    Nomor
                                                                    Telepon
                                                                </div>
                                                                <div className="mt-1 text-sm text-slate-900">
                                                                    {
                                                                        company.phone
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                        {company.email && (
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-500">
                                                                    Email
                                                                </div>
                                                                <div className="mt-1 text-sm text-slate-900">
                                                                    {
                                                                        company.email
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                        {company.address && (
                                                            <div className="col-span-full">
                                                                <div className="text-sm font-medium text-slate-500">
                                                                    Alamat
                                                                </div>
                                                                <div className="mt-1 text-sm text-slate-900">
                                                                    {
                                                                        company.address
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

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
                                            Gunakan kata sandi yang kuat dan
                                            unik
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

                            {/* Logout Account */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                        <LogOut className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-800">
                                            Keluar
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Akhiri sesi Anda saat ini
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                                >
                                    Log Out
                                </Link>
                            </div>

                            {/* Delete Account */}
                            {/* <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-red-100">
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
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
