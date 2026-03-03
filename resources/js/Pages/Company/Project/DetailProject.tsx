import { TabNavigation } from '@/Components/Company';
import ProjectIKM from '@/Components/Company/ProjectIKM';
import ProjectOverview from '@/Components/Company/ProjectOverview';
import ProjectSLOI from '@/Components/Company/ProjectSLOI';
import ProjectSROI from '@/Components/Company/ProjectSROI';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { Head, router } from '@inertiajs/react';

// ─── Types ─────────────────────────────────────────────────

interface LocationItem {
    district: string | null;
    city: string | null;
    province: string | null;
}

interface EnumeratorItem {
    id: number;
    name: string;
    email: string;
}

interface ProjectData {
    id: number;
    name: string;
    description: string | null;
    projectCode: string;
    status: string;
    companyName: string | null;
    enableIkm: boolean;
    enableSloi: boolean;
    enableSroi: boolean;
    targetIkmCount: number;
    targetSloiCount: number;
    startDate: string | null;
    endDate: string | null;
    locations: LocationItem[];
    enumerators: EnumeratorItem[];
}

interface StatsData {
    totalResponses: number;
    targetResponses: number;
    progress: number;
    score: number;
    scoreLabel: string;
}

interface GenderItem {
    gender: string;
    count: number;
    percentage: number;
}

interface AgeRangeItem {
    range: string;
    count: number;
    height: number;
}

interface EducationItem {
    label: string;
    value: number;
    percentage: number;
}

interface DemographicsData {
    genderDistribution: GenderItem[];
    ageRange: AgeRangeItem[];
    educationLevel: EducationItem[];
}

interface QuestionScoreItem {
    id: string;
    question: string;
    score: number;
}

interface AuditLogItem {
    id: string;
    respondentName: string;
    enumerator: string;
    date: string;
    score: number;
    status: string;
    group: string;
}

interface TrendDataItem {
    month: string;
    score: number;
    height: number;
}

interface Props {
    project: ProjectData;
    detailType: string;
    stats: StatsData;
    demographics: DemographicsData;
    questionScores: QuestionScoreItem[];
    auditLog: AuditLogItem[];
    trendData: TrendDataItem[];
}

// ─── Tab Config ────────────────────────────────────────────

function buildTabs(project: ProjectData) {
    const tabs = [{ key: 'overview', label: 'Overview', icon: 'dashboard' }];
    if (project.enableIkm)
        tabs.push({ key: 'ikm', label: 'IKM', icon: 'sentiment_satisfied' });
    if (project.enableSloi)
        tabs.push({ key: 'sloi', label: 'SLOI', icon: 'handshake' });
    if (project.enableSroi)
        tabs.push({ key: 'sroi', label: 'SROI', icon: 'payments' });
    return tabs;
}

// ─── Component ─────────────────────────────────────────────

export default function DetailProject({
    project,
    detailType,
    stats,
    demographics,
    questionScores,
    auditLog,
    trendData,
}: Props) {
    const activeTab = detailType || 'overview';
    const tabs = buildTabs(project);
    const progress =
        stats.targetResponses > 0
            ? Math.round((stats.totalResponses / stats.targetResponses) * 100)
            : 0;

    // Berpindah tab → update URL params via Inertia
    const handleTabChange = (tab: string) => {
        router.get(
            route('company.projects.show', { id: project.id }),
            { detailType: tab },
            { preserveState: true, preserveScroll: true },
        );
    };

    // Render konten berdasarkan tab aktif
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <ProjectOverview
                        project={project}
                        stats={stats}
                        auditLog={auditLog}
                    />
                );
            case 'ikm':
                return (
                    <ProjectIKM
                        stats={stats}
                        demographics={demographics}
                        questionScores={questionScores}
                        auditLog={auditLog}
                        trendData={trendData}
                    />
                );
            case 'sloi':
                return (
                    <ProjectSLOI
                        stats={stats}
                        demographics={demographics}
                        questionScores={questionScores}
                        auditLog={auditLog}
                        trendData={trendData}
                    />
                );
            case 'sroi':
                return <ProjectSROI />;
            default:
                return (
                    <ProjectOverview
                        project={project}
                        stats={stats}
                        auditLog={auditLog}
                    />
                );
        }
    };

    return (
        <CompanyLayout breadcrumb={{ parent: 'Proyek', current: project.name }}>
            <Head title={`Detail Proyek - ${project.name}`} />

            <div className="p-8">
                {/* Header Halaman */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {project.name}
                            </h1>
                            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-white">
                                {project.status}
                            </span>
                        </div>
                        <p className="text-slate-500">{project.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        {/* Target Progress */}
                        <div className="text-right">
                            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                                Target Completion
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-2.5 w-48 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-primary shadow-[0_0_8px_rgba(22,162,73,0.3)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-lg font-black text-primary">
                                    {progress}%
                                </span>
                            </div>
                            <p className="mt-1 text-[10px] text-slate-500">
                                {stats.totalResponses.toLocaleString()} of{' '}
                                {stats.targetResponses.toLocaleString()}{' '}
                                respondents
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </CompanyLayout>
    );
}
