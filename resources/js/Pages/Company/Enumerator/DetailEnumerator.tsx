import { Icon, TabNavigation } from '@/Components/Company';
import type {
    IKMRespondentsData,
    RespondentFilters,
} from '@/Components/Company/IKMRespondentTable';
import IKMRespondentTable from '@/Components/Company/IKMRespondentTable';
import type { SLOIRespondentsData } from '@/Components/Company/SLOIRespondentTable';
import SLOIRespondentTable from '@/Components/Company/SLOIRespondentTable';
import CompanyLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';

// ─── Types ─────────────────────────────────────────────────

interface ProfileData {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    createdAt: string | null;
}

interface StatsData {
    totalSubmissions: number;
    ikmSubmissions: number;
    sloiSubmissions: number;
    approvedSubmissions: number;
    rejectedSubmissions: number;
    pendingSubmissions: number;
    totalProjects: number;
    activeProjects: number;
    avgScoreIkm: number;
    avgScoreSloi: number;
}

interface AssignedProject {
    id: number;
    name: string;
    projectCode: string;
    status: string;
}

interface Props {
    profile: ProfileData;
    stats: StatsData;
    assignedProjects: AssignedProject[];
    tab: string;
    respondents: IKMRespondentsData | SLOIRespondentsData | null;
    respondentFilters: RespondentFilters;
}

// ─── Component ─────────────────────────────────────────────

export default function DetailEnumerator({
    profile,
    stats,
    assignedProjects,
    tab,
    respondents,
    respondentFilters,
}: Props) {
    const tabs = [
        { key: 'profile', label: 'Profil', icon: 'person' },
        { key: 'ikm', label: 'Data IKM', icon: 'sentiment_satisfied' },
        { key: 'sloi', label: 'Data SLOI', icon: 'assessment' },
    ];

    const handleTabChange = (key: string) => {
        router.get(
            route('enumerators.show', { id: profile.id }),
            { tab: key },
            { preserveState: false },
        );
    };

    const handleRespondentNavigate = (
        params: Record<string, string | number>,
    ) => {
        router.get(
            route('enumerators.show', { id: profile.id }),
            { tab, ...params },
            { preserveState: true, preserveScroll: true },
        );
    };

    const initials = profile.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <CompanyLayout
            breadcrumb={{ parent: 'Enumerator', current: profile.name }}
        >
            <Head title={`Detail Enumerator - ${profile.name}`} />

            <div className="p-8">
                {/* Back Button */}
                <Link
                    href={route('enumerators.index')}
                    className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                >
                    <Icon name="arrow_back" className="text-lg" />
                    Kembali ke Daftar
                </Link>

                {/* Profile Header Card */}
                <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="flex size-20 items-center justify-center rounded-full border-4 border-slate-50 bg-primary/10 text-xl font-bold text-primary">
                                {initials}
                            </div>
                            <div
                                className={`absolute bottom-1 right-1 size-4 rounded-full border-2 border-white ${
                                    profile.isActive
                                        ? 'bg-green-500'
                                        : 'bg-slate-300'
                                }`}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                                    {profile.name}
                                </h1>
                                <span
                                    className={`inline-flex rounded-full px-3 py-0.5 text-[10px] font-bold uppercase ${
                                        profile.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {profile.isActive ? 'Aktif' : 'Tidak Aktif'}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Icon name="mail" className="text-base" />
                                    {profile.email}
                                </span>
                                {profile.phone && (
                                    <span className="flex items-center gap-1">
                                        <Icon
                                            name="phone"
                                            className="text-base"
                                        />
                                        {profile.phone}
                                    </span>
                                )}
                                {profile.createdAt && (
                                    <span className="flex items-center gap-1">
                                        <Icon
                                            name="calendar_today"
                                            className="text-base"
                                        />
                                        Bergabung {profile.createdAt}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                    <StatCard
                        label="Total Pengiriman"
                        value={stats.totalSubmissions}
                        icon="send"
                        color="primary"
                    />
                    <StatCard
                        label="IKM"
                        value={stats.ikmSubmissions}
                        icon="sentiment_satisfied"
                        color="blue"
                    />
                    <StatCard
                        label="SLOI"
                        value={stats.sloiSubmissions}
                        icon="assessment"
                        color="indigo"
                    />
                    <StatCard
                        label="Disetujui"
                        value={stats.approvedSubmissions}
                        icon="check_circle"
                        color="green"
                    />
                    <StatCard
                        label="Ditolak"
                        value={stats.rejectedSubmissions}
                        icon="cancel"
                        color="red"
                    />
                    <StatCard
                        label="Menunggu"
                        value={stats.pendingSubmissions}
                        icon="pending"
                        color="amber"
                    />
                    <StatCard
                        label="Total Proyek"
                        value={stats.totalProjects}
                        icon="folder"
                        color="slate"
                    />
                    <StatCard
                        label="Proyek Aktif"
                        value={stats.activeProjects}
                        icon="folder_open"
                        color="emerald"
                    />
                    <StatCard
                        label="Rerata IKM"
                        value={stats.avgScoreIkm}
                        icon="sentiment_satisfied"
                        color="yellow"
                    />
                    <StatCard
                        label="Rerata SLOI"
                        value={stats.avgScoreSloi}
                        icon="assessment"
                        color="purple"
                    />
                </div>

                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={tab}
                    onTabChange={handleTabChange}
                />

                {/* Tab Content */}
                {tab === 'profile' && (
                    <ProfileTab
                        profile={profile}
                        stats={stats}
                        assignedProjects={assignedProjects}
                    />
                )}

                {tab === 'ikm' && respondents && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Data Responden IKM
                            </h2>
                            <p className="text-sm text-slate-500">
                                Total {respondents.pagination.total} responden
                            </p>
                            <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="size-2.5 rounded-full bg-blue-500" />
                                    Kepentingan
                                </span>
                                <span>/</span>
                                <span className="flex items-center gap-1">
                                    <span className="size-2.5 rounded-full bg-emerald-500" />
                                    Kinerja
                                </span>
                            </div>
                        </div>
                        <IKMRespondentTable
                            respondents={respondents as IKMRespondentsData}
                            filters={respondentFilters}
                            onNavigate={handleRespondentNavigate}
                        />
                    </div>
                )}

                {tab === 'sloi' && respondents && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Data Responden SLOI
                            </h2>
                            <p className="text-sm text-slate-500">
                                Total {respondents.pagination.total} responden
                            </p>
                        </div>
                        <SLOIRespondentTable
                            respondents={respondents as SLOIRespondentsData}
                            filters={respondentFilters}
                            onNavigate={handleRespondentNavigate}
                        />
                    </div>
                )}
            </div>
        </CompanyLayout>
    );
}

// ─── Stat Card ─────────────────────────────────────────────

const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-50 text-slate-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
};

function StatCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number;
    icon: string;
    color: string;
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div
                    className={`flex size-10 items-center justify-center rounded-lg ${colorMap[color] ?? colorMap.primary}`}
                >
                    <Icon name={icon} className="text-xl" />
                </div>
                <div>
                    <p className="text-2xl font-black text-slate-900">
                        {value}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Profile Tab ───────────────────────────────────────────

function ProfileTab({
    profile,
    stats,
    assignedProjects,
}: {
    profile: ProfileData;
    stats: StatsData;
    assignedProjects: AssignedProject[];
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Profile Info */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Informasi Profil
                </h3>
                <dl className="space-y-3">
                    <InfoRow label="Nama Lengkap" value={profile.name} />
                    <InfoRow label="Email" value={profile.email} />
                    <InfoRow label="Telepon" value={profile.phone ?? '-'} />
                    <InfoRow
                        label="Status"
                        value={profile.isActive ? 'Aktif' : 'Tidak Aktif'}
                    />
                    <InfoRow
                        label="Bergabung Sejak"
                        value={profile.createdAt ?? '-'}
                    />
                </dl>
            </div>

            {/* Performance Summary */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Ringkasan Kinerja
                </h3>
                <dl className="space-y-3">
                    <InfoRow
                        label="Total Pengiriman"
                        value={String(stats.totalSubmissions)}
                    />
                    <InfoRow
                        label="Pengiriman IKM"
                        value={String(stats.ikmSubmissions)}
                    />
                    <InfoRow
                        label="Pengiriman SLOI"
                        value={String(stats.sloiSubmissions)}
                    />
                    <InfoRow
                        label="Disetujui"
                        value={String(stats.approvedSubmissions)}
                    />
                    <InfoRow
                        label="Ditolak"
                        value={String(stats.rejectedSubmissions)}
                    />
                    <InfoRow
                        label="Menunggu"
                        value={String(stats.pendingSubmissions)}
                    />
                    <InfoRow
                        label="Rerata Skor IKM"
                        value={String(stats.avgScoreIkm)}
                    />
                    <InfoRow
                        label="Rerata Skor SLOI"
                        value={String(stats.avgScoreSloi)}
                    />
                </dl>
            </div>

            {/* Assigned Projects */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Proyek Ditugaskan ({assignedProjects.length})
                </h3>
                {assignedProjects.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        Belum ada proyek yang ditugaskan
                    </p>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-slate-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80">
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Kode
                                    </th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Nama Proyek
                                    </th>
                                    <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {assignedProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        <td className="px-4 py-3 font-mono text-xs font-medium text-slate-600">
                                            {project.projectCode}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            <Link
                                                href={route('projects.show', {
                                                    id: project.id,
                                                })}
                                                className="transition-colors hover:text-primary"
                                            >
                                                {project.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                                    project.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : project.status ===
                                                            'draft'
                                                          ? 'bg-amber-100 text-amber-700'
                                                          : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {project.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="text-sm font-semibold text-slate-900">{value}</dd>
        </div>
    );
}
