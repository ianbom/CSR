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

// Mock data - replace with actual props from backend
const mockStats: DashboardStats = {
    totalProjects: 12,
    activeProjects: 8,
    enumerators: 45,
    monthlyResponses: 1240,
};

const mockProjects: ProjectData[] = [
    {
        name: 'Eco-Village',
        ikmHeight: '85%',
        sloiHeight: '70%',
        sroiHeight: '45%',
    },
    {
        name: 'Waste Red.',
        ikmHeight: '60%',
        sloiHeight: '90%',
        sroiHeight: '75%',
    },
    {
        name: 'EduReach',
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
        title: 'New report submitted',
        description: 'Project Solar Hub: Environmental Impact Q2',
        time: '2 mins ago',
    },
    {
        icon: 'person_add',
        iconBgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-500',
        title: 'New enumerator joined',
        description: 'Sarah Jenkins assigned to Eco-Village',
        time: '45 mins ago',
    },
    {
        icon: 'priority_high',
        iconBgColor: 'bg-orange-500/10',
        iconColor: 'text-orange-500',
        title: 'High IKM score alert',
        description: 'Waste Reduction Project reached 92/100',
        time: '3 hours ago',
    },
];

const chartLegend = [
    { label: 'IKM', color: 'bg-primary' },
    { label: 'SLOI', color: 'bg-primary/50' },
    { label: 'SROI', color: 'bg-slate-200' },
];

const scoreData = [
    { label: 'Excellent', value: '42%' },
    { label: 'Good', value: '38%' },
    { label: 'Average', value: '15%' },
    { label: 'Poor', value: '5%' },
];

const dateLabels = ['01 May', '07 May', '14 May', '21 May', '28 May', '31 May'];

export default function Dashboard() {
    return (
        <CompanyLayout
            breadcrumb={{ parent: 'Dashboard', current: 'Overview' }}
        >
            <Head title="Dashboard" />

            <div className="space-y-8 p-8">
                {/* Stats Grid */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon="folder"
                        iconBgColor="bg-blue-50"
                        iconColor="text-blue-600"
                        label="Total Projects"
                        badge="TOTAL"
                        value={mockStats.totalProjects}
                        trend={{ text: '+2 this month', isPositive: true }}
                    />
                    <StatCard
                        icon="play_circle"
                        iconBgColor="bg-green-50"
                        iconColor="text-primary"
                        label="Active Projects"
                        badge="LIVE"
                        value={mockStats.activeProjects}
                        trend={{
                            text: '66.7% operational rate',
                            isPositive: false,
                        }}
                    />
                    <StatCard
                        icon="badge"
                        iconBgColor="bg-purple-50"
                        iconColor="text-purple-600"
                        label="Enumerators"
                        badge="STAFF"
                        value={mockStats.enumerators}
                        trend={{ text: '+12% vs LY', isPositive: true }}
                    />
                    <StatCard
                        icon="forum"
                        iconBgColor="bg-orange-50"
                        iconColor="text-orange-600"
                        label="Monthly Responses"
                        badge="ACTIVITY"
                        value={mockStats.monthlyResponses.toLocaleString()}
                        trend={{ text: '+8% engagement', isPositive: true }}
                    />
                </section>

                {/* Main Charts Row */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <BarChart
                        title="Project Performance Overview"
                        description="Benchmark comparison of IKM, SLOI, and SROI scores per active project."
                        legend={chartLegend}
                        projects={mockProjects}
                    />
                    <ScoreDistribution
                        title="Score Distribution"
                        description="Aggregate sentiment across all projects."
                        percentage={82}
                        percentageLabel="Positive"
                        scores={scoreData}
                    />
                </section>

                {/* Bottom Row */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <LineChart
                        title="Response Trends"
                        description="Submission volume over the last 30 days."
                        dateLabels={dateLabels}
                    />
                    <ActivityFeed
                        title="Recent Activity"
                        activities={mockActivities}
                        viewAllLink="/company/activities"
                    />
                </section>
            </div>
        </CompanyLayout>
    );
}
