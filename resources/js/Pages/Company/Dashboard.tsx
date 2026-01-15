import {
    ActivityFeed,
    BarChart,
    LineChart,
    ScoreDistribution,
    StatCard,
} from '@/Components/Company';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { Head } from '@inertiajs/react';

// Types
interface DashboardStats {
    totalProjects: number;
    activeProjects: number;
    enumerators: number;
    monthlyResponses: number;
}

interface ProjectData {
    name: string;
    ikmHeight: string;
    sloiHeight: string;
    sroiHeight: string;
}

interface ActivityData {
    icon: string;
    iconBgColor: string;
    iconColor: string;
    title: string;
    description: string;
    time: string;
}

// Data dummy - ganti dengan props dari backend
const mockStats: DashboardStats = {
    totalProjects: 12,
    activeProjects: 8,
    enumerators: 45,
    monthlyResponses: 1240,
};

const mockProjects: ProjectData[] = [
    {
        name: 'Desa Hijau',
        ikmHeight: '85%',
        sloiHeight: '70%',
        sroiHeight: '45%',
    },
    {
        name: 'Daur Ulang',
        ikmHeight: '60%',
        sloiHeight: '90%',
        sroiHeight: '75%',
    },
    {
        name: 'EduCerdas',
        ikmHeight: '40%',
        sloiHeight: '35%',
        sroiHeight: '20%',
    },
    {
        name: 'Solar Hub',
        ikmHeight: '95%',
        sloiHeight: '80%',
        sroiHeight: '90%',
    },
    {
        name: 'AgriTech',
        ikmHeight: '70%',
        sloiHeight: '55%',
        sroiHeight: '40%',
    },
];

const mockActivities: ActivityData[] = [
    {
        icon: 'description',
        iconBgColor: 'bg-primary/10',
        iconColor: 'text-primary',
        title: 'Laporan baru dikirim',
        description: 'Proyek Solar Hub: Dampak Lingkungan Q2',
        time: '2 menit lalu',
    },
    {
        icon: 'person_add',
        iconBgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-500',
        title: 'Enumerator baru bergabung',
        description: 'Sarah Jenkins ditugaskan ke Desa Hijau',
        time: '45 menit lalu',
    },
    {
        icon: 'priority_high',
        iconBgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-500',
        title: 'Peringatan skor IKM tinggi',
        description: 'Proyek Daur Ulang mencapai 92/100',
        time: '3 jam lalu',
    },
];

const chartLegend = [
    { label: 'IKM', color: 'bg-primary' },
    { label: 'SLOI', color: 'bg-primary/50' },
    { label: 'SROI', color: 'bg-slate-200' },
];

const scoreData = [
    { label: 'Sangat Baik', value: '42%' },
    { label: 'Baik', value: '38%' },
    { label: 'Cukup', value: '15%' },
    { label: 'Kurang', value: '5%' },
];

const dateLabels = ['01 Mei', '07 Mei', '14 Mei', '21 Mei', '28 Mei', '31 Mei'];

export default function Dashboard() {
    return (
        <CompanyLayout
            breadcrumb={{ parent: 'Dashboard', current: 'Perusahaan' }}
        >
            <Head title="Dashboard" />

            <div className="space-y-8 p-8">
                {/* Grid Statistik */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon="folder"
                        iconBgColor="bg-blue-50"
                        iconColor="text-blue-600"
                        label="Total Proyek"
                        badge="TOTAL"
                        value={mockStats.totalProjects}
                        trend={{ text: '+2 bulan ini', isPositive: true }}
                    />
                    <StatCard
                        icon="play_circle"
                        iconBgColor="bg-green-50"
                        iconColor="text-primary"
                        label="Proyek Aktif"
                        badge="AKTIF"
                        value={mockStats.activeProjects}
                        trend={{
                            text: '66.7% tingkat operasional',
                            isPositive: false,
                        }}
                    />
                    <StatCard
                        icon="badge"
                        iconBgColor="bg-purple-50"
                        iconColor="text-purple-600"
                        label="Enumerator"
                        badge="STAF"
                        value={mockStats.enumerators}
                        trend={{
                            text: '+12% dari tahun lalu',
                            isPositive: true,
                        }}
                    />
                    <StatCard
                        icon="forum"
                        iconBgColor="bg-orange-50"
                        iconColor="text-orange-600"
                        label="Respons Bulanan"
                        badge="AKTIVITAS"
                        value={mockStats.monthlyResponses.toLocaleString()}
                        trend={{ text: '+8% keterlibatan', isPositive: true }}
                    />
                </section>

                {/* Baris Grafik Utama */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <BarChart
                        title="Ringkasan Performa Proyek"
                        description="Perbandingan skor IKM, SLOI, dan SROI per proyek aktif."
                        legend={chartLegend}
                        projects={mockProjects}
                    />
                    <ScoreDistribution
                        title="Distribusi Skor"
                        description="Sentimen agregat di seluruh proyek."
                        percentage={82}
                        percentageLabel="Positif"
                        scores={scoreData}
                    />
                </section>

                {/* Baris Bawah */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <LineChart
                        title="Tren Respons"
                        description="Volume pengiriman selama 30 hari terakhir."
                        dateLabels={dateLabels}
                    />
                    <ActivityFeed
                        title="Aktivitas Terbaru"
                        activities={mockActivities}
                        viewAllLink="/company/activities"
                    />
                </section>
            </div>
        </CompanyLayout>
    );
}
