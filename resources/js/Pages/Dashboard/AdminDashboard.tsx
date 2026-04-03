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
    submissionTrends: SubmissionTrend[];
    projectsByStatus: ChartDataItem[];
    submissionsByType: SubmissionTypeData[];
    recentActivities: RecentActivity[];
    topProvinces: ProvinceData[];
}

export default function AdminDashboard({
    stats = {
        totalCompanies: 0,
        activeCompanies: 0,
        totalUsers: 0,
        totalEnumerators: 0,
        totalProjects: 0,
        activeProjects: 0,
        totalSubmissions: 0,
        totalRespondents: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
        rejectedSubmissions: 0,
        trends: {
            companiesGrowth: 0,
            usersGrowth: 0,
            projectsGrowth: 0,
            submissionsGrowth: 0,
        },
    },
    recentCompanies = [],
    recentProjects = [],
    submissionTrends = [],
    projectsByStatus = [],
    submissionsByType = [],
    recentActivities = [],
    topProvinces = [],
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
