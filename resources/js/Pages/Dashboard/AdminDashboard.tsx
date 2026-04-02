import {
    ActivityItem,
    CompanyCard,
    MiniStat,
    ProjectCard,
    ProjectStatusChart,
    ProvinceChart,
    StatCard,
    SubmissionTrendsChart,
    SubmissionTypeChart,
    type ChartDataItem,
    type Company,
    type DashboardStats,
    type Project,
    type ProvinceData,
    type RecentActivity,
    type SubmissionTrend,
    type SubmissionTypeData,
    type User,
} from '@/Components/Admin/Dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Building2,
    CheckCircle2,
    FileText,
    FolderKanban,
    UserCheck,
    Users,
    XCircle,
} from 'lucide-react';

interface Props {
    stats: DashboardStats;
    recentCompanies: Company[];
    recentProjects: Project[];
    recentUsers: User[];
    submissionTrends: SubmissionTrend[];
    projectsByStatus: ChartDataItem[];
    submissionsByType: SubmissionTypeData[];
    recentActivities: RecentActivity[];
    topProvinces: ProvinceData[];
}

export default function AdminDashboard({
    stats = {
        totalCompanies: 24,
        activeCompanies: 18,
        totalUsers: 156,
        totalEnumerators: 89,
        totalProjects: 67,
        activeProjects: 23,
        totalSubmissions: 4521,
        totalRespondents: 3847,
        pendingSubmissions: 127,
        approvedSubmissions: 4280,
        rejectedSubmissions: 114,
        trends: {
            companiesGrowth: 12,
            usersGrowth: 8,
            projectsGrowth: 15,
            submissionsGrowth: 23,
        },
    },
    recentCompanies = [
        {
            id: 1,
            name: 'PT Pertamina Persero',
            status: 'active' as const,
            projects_count: 8,
            users_count: 24,
        },
        {
            id: 2,
            name: 'PT PLN Indonesia',
            status: 'active' as const,
            projects_count: 5,
            users_count: 15,
        },
        {
            id: 3,
            name: 'PT Telkom Indonesia',
            status: 'pending' as const,
            projects_count: 3,
            users_count: 8,
        },
        {
            id: 4,
            name: 'PT Bank Mandiri',
            status: 'active' as const,
            projects_count: 6,
            users_count: 18,
        },
    ],
    recentProjects = [
        {
            id: 1,
            name: 'CSR Pendidikan Desa Makmur',
            project_code: 'PROJ-EDU001',
            status: 'active' as const,
            company: { name: 'PT Pertamina' },
            submissions_count: 145,
            target_ikm_count: 200,
            target_sloi_count: 100,
        },
        {
            id: 2,
            name: 'Program Kesehatan Masyarakat',
            project_code: 'PROJ-HLT002',
            status: 'active' as const,
            company: { name: 'PT PLN' },
            submissions_count: 89,
            target_ikm_count: 150,
            target_sloi_count: 50,
        },
        {
            id: 3,
            name: 'Pemberdayaan UMKM Lokal',
            project_code: 'PROJ-SME003',
            status: 'draft' as const,
            company: { name: 'PT Telkom' },
            submissions_count: 0,
            target_ikm_count: 100,
            target_sloi_count: 100,
        },
    ],
    submissionTrends = [
        { date: '1 Mar', ikm: 45, sloi: 30, sroi: 15 },
        { date: '5 Mar', ikm: 52, sloi: 38, sroi: 20 },
        { date: '10 Mar', ikm: 61, sloi: 42, sroi: 28 },
        { date: '15 Mar', ikm: 78, sloi: 55, sroi: 35 },
        { date: '20 Mar', ikm: 85, sloi: 62, sroi: 40 },
        { date: '25 Mar', ikm: 92, sloi: 70, sroi: 48 },
        { date: '30 Mar', ikm: 110, sloi: 85, sroi: 55 },
    ],
    projectsByStatus = [
        { status: 'Active', count: 23 },
        { status: 'Draft', count: 18 },
        { status: 'Closed', count: 15 },
        { status: 'Archived', count: 11 },
    ],
    submissionsByType = [
        { type: 'IKM', count: 2340 },
        { type: 'SLOI', count: 1520 },
        { type: 'SROI', count: 661 },
    ],
    recentActivities = [
        {
            id: 1,
            type: 'submission' as const,
            action: 'Submission baru disetujui',
            description: 'Survey IKM #4521 oleh Budi Santoso',
            time: '2 menit lalu',
        },
        {
            id: 2,
            type: 'project' as const,
            action: 'Proyek baru dibuat',
            description: 'CSR Lingkungan Hijau - PT Pertamina',
            time: '15 menit lalu',
        },
        {
            id: 3,
            type: 'company' as const,
            action: 'Perusahaan baru terdaftar',
            description: 'PT Astra International',
            time: '1 jam lalu',
        },
        {
            id: 4,
            type: 'user' as const,
            action: 'Enumerator baru ditambahkan',
            description: '5 enumerator baru untuk PT PLN',
            time: '2 jam lalu',
        },
        {
            id: 5,
            type: 'submission' as const,
            action: 'Submission ditolak',
            description: 'Survey SLOI #3892 - data tidak lengkap',
            time: '3 jam lalu',
        },
    ],
    topProvinces = [
        { name: 'Jawa Barat', count: 1245 },
        { name: 'Jawa Timur', count: 987 },
        { name: 'Jawa Tengah', count: 876 },
        { name: 'Sumatra Utara', count: 654 },
        { name: 'Kalimantan Timur', count: 432 },
    ],
}: Props) {
    return (
        <AppLayout breadcrumb={{ parent: 'Dashboard', current: 'Admin' }}>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                {/* Header Section */}
                <div className="border-b border-slate-200 bg-white px-8 py-6 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Admin Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Selamat datang kembali! Berikut ringkasan
                                aktivitas platform.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-700">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">
                                    Sistem berjalan normal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-8">
                    {/* Primary Stats Grid */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            icon={Building2}
                            label="Total Perusahaan"
                            value={stats.totalCompanies}
                            trend={{
                                value: stats.trends.companiesGrowth,
                                label: 'dari bulan lalu',
                            }}
                        />
                        <StatCard
                            icon={Users}
                            label="Total Pengguna"
                            value={stats.totalUsers}
                            trend={{
                                value: stats.trends.usersGrowth,
                                label: 'dari bulan lalu',
                            }}
                        />
                        <StatCard
                            icon={FolderKanban}
                            label="Total Proyek"
                            value={stats.totalProjects}
                            trend={{
                                value: stats.trends.projectsGrowth,
                                label: 'dari bulan lalu',
                            }}
                        />
                        <StatCard
                            icon={FileText}
                            label="Total Submissions"
                            value={stats.totalSubmissions}
                            trend={{
                                value: stats.trends.submissionsGrowth,
                                label: 'dari bulan lalu',
                            }}
                        />
                    </section>

                    {/* Secondary Stats Row */}
                    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        <MiniStat
                            icon={Building2}
                            label="Perusahaan Aktif"
                            value={stats.activeCompanies}
                        />
                        <MiniStat
                            icon={UserCheck}
                            label="Enumerator"
                            value={stats.totalEnumerators}
                        />
                        <MiniStat
                            icon={Activity}
                            label="Proyek Aktif"
                            value={stats.activeProjects}
                        />
                        <MiniStat
                            icon={Users}
                            label="Responden"
                            value={stats.totalRespondents}
                        />
                        <MiniStat
                            icon={CheckCircle2}
                            label="Approved"
                            value={stats.approvedSubmissions}
                        />
                        <MiniStat
                            icon={XCircle}
                            label="Rejected"
                            value={stats.rejectedSubmissions}
                        />
                    </section>

                    {/* Charts Row */}
                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <SubmissionTrendsChart data={submissionTrends} />

                        <div className="grid grid-cols-1 gap-6">
                            <ProjectStatusChart data={projectsByStatus} />
                            <SubmissionTypeChart data={submissionsByType} />
                        </div>
                    </section>

                    {/* Companies, Projects & Activities */}
                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Recent Companies */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        Perusahaan Terbaru
                                    </CardTitle>
                                    <Link
                                        href="/admin/companies"
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        Lihat semua
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentCompanies.map((company) => (
                                    <CompanyCard
                                        key={company.id}
                                        company={company}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Recent Projects */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FolderKanban className="h-5 w-5 text-primary" />
                                        Proyek Terbaru
                                    </CardTitle>
                                    <Link
                                        href="/admin/projects"
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        Lihat semua
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Recent Activities */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Activity className="h-5 w-5 text-primary" />
                                        Aktivitas Terbaru
                                    </CardTitle>
                                    <Link
                                        href="/admin/activities"
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        Lihat semua
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {recentActivities.map((activity) => (
                                        <ActivityItem
                                            key={activity.id}
                                            activity={activity}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Top Provinces Bar Chart */}
                    <section>
                        <ProvinceChart data={topProvinces} />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
