import { TabNavigation } from '@/Components/Company';
import ProjectEnumeratorList from '@/Components/Company/ProjectEnumeratorList';
import ProjectIKM from '@/Components/Company/ProjectIKM';
import ProjectIKMRespondent from '@/Components/Company/ProjectIKMRespondent';
import ProjectOverview from '@/Components/Company/ProjectOverview';
import ProjectSLOI from '@/Components/Company/ProjectSLOI';
import ProjectSLOIRespondent from '@/Components/Company/ProjectSLOIRespondent';
import ProjectSROI from '@/Components/Company/ProjectSROI';
import CompanyLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, PauseCircle, X } from 'lucide-react';
import { useState } from 'react';

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
    descriptiveQuestions: {
        id: number;
        title: string;
    }[];
}

interface StatsData {
    totalResponses: number;
    targetResponses: number;
    progress: number;
    score: number;
    scoreLabel: string;
}

interface IkmStatsData {
    totalResponses: number;
    targetResponses: number;
    progress: number;
    scoreKepentingan: number;
    scoreKinerja: number;
    scoreLabelKepentingan: string;
    scoreLabelKinerja: string;
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
    importance: number;
    performance: number;
}

interface AllQuestionItem {
    id: string;
    code: string;
    category: string;
    question: string;
    order_no: number;
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

interface RespondentsData {
    questions: { code: string; question: string }[];
    rows: {
        submissionId: number;
        submittedAt: string | null;
        status: string;
        enumerator: string;
        latitude: number | null;
        longitude: number | null;
        photoPath: string | null;
        avgScore: number;
        avgKepentingan: number | null;
        avgKinerja: number | null;
        respondent: {
            id: number;
            name: string;
            address: string | null;
            phone: string | null;
            age: number | null;
            gender: string | null;
            status: string | null;
            educationLevel: string | null;
            occupation: string | null;
            monthlyIncome: number | null;
        } | null;
        answers: Record<
            string,
            { kepentingan: number | null; kinerja: number | null }
        >;
        timelines: {
            id: number;
            action: string;
            decidedAt: string | null;
            decidedBy: string;
            notes: string | null;
        }[];
        descriptiveAnswers?: { question: string; answer: string | null }[];
    }[];
    pagination: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
    filterOptions: {
        enumerators: string[];
        statuses: string[];
        educations: string[];
        genders: string[];
    };
}

interface RespondentFilters {
    enumerator: string;
    resp_status: string;
    education: string;
    gender: string;
    sort_by: string;
    sort_order: string;
    per_page: number;
}

interface EnumeratorListItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    totalSubmissions: number;
    avgScore: number;
    lastSubmittedAt: string | null;
    submissions: {
        id: number;
        respondentName: string;
        assessmentType: string;
        status: string;
        submittedAt: string | null;
    }[];
}

interface SloiReliabilityItem {
    code: string;
    question: string;
    raw_question: string;
    mean: number;
    variance: number;
    pearson: number;
    isValid: boolean;
    validityLabel: string;
}

interface SloiReliabilityData {
    n: number;
    k: number;
    items: SloiReliabilityItem[];
    sumItemVariances: number;
    varTotal: number;
    alpha: number;
    alphaStatus: string;
    insufficientData: boolean;
}

interface Props {
    project: ProjectData;
    detailType: string;
    stats: StatsData;
    ikmStats: IkmStatsData | null;
    sloiStats: StatsData | null;
    demographics: DemographicsData;
    questionScores: QuestionScoreItem[];
    allQuestions: AllQuestionItem[];
    auditLog: AuditLogItem[];
    trendData: TrendDataItem[];
    respondents: RespondentsData;
    enumeratorList: EnumeratorListItem[];
    sloiReliability: SloiReliabilityData | null;
    respondentFilters: RespondentFilters;
    canEdit?: boolean;
}

// ─── Tab Config ────────────────────────────────────────────

function buildTabs(project: ProjectData) {
    const tabs = [{ key: 'overview', label: 'Overview', icon: 'dashboard' }];
    if (project.enableIkm) {
        tabs.push({ key: 'ikm', label: 'IKM', icon: 'sentiment_satisfied' });
        tabs.push({
            key: 'ikm_respondent',
            label: 'IKM Respondent',
            icon: 'group',
        });
    }
    if (project.enableSloi) {
        tabs.push({ key: 'sloi', label: 'SLOI', icon: 'handshake' });
        tabs.push({
            key: 'sloi_respondent',
            label: 'SLOI Respondent',
            icon: 'group',
        });
    }
    if (project.enableSroi)
        tabs.push({ key: 'sroi', label: 'SROI', icon: 'payments' });
    tabs.push({
        key: 'enumerator',
        label: 'Enumerator',
        icon: 'badge',
    });
    return tabs;
}

// ─── Component ─────────────────────────────────────────────

export default function DetailProject({
    project,
    detailType,
    stats,
    ikmStats,
    sloiStats,
    demographics,
    questionScores,
    allQuestions,
    auditLog,
    trendData,
    respondents,
    enumeratorList,
    sloiReliability,
    respondentFilters,
    canEdit = true,
}: Props) {
    const activeTab = detailType || 'overview';
    const tabs = buildTabs(project);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const pendingStatus = project.status === 'active' ? 'draft' : 'active';
    const progress =
        stats.targetResponses > 0
            ? Math.round((stats.totalResponses / stats.targetResponses) * 100)
            : 0;

    // Berpindah tab → update URL params via Inertia
    const handleTabChange = (tab: string) => {
        router.get(
            route('projects.show', { id: project.id }),
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
                        ikmStats={ikmStats}
                        sloiStats={sloiStats}
                        auditLog={auditLog}
                    />
                );
            case 'ikm':
                return (
                    <ProjectIKM
                        stats={stats}
                        ikmStats={ikmStats}
                        demographics={demographics}
                        questionScores={questionScores}
                        allQuestions={allQuestions}
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
                        sloiReliability={sloiReliability}
                    />
                );
            case 'ikm_respondent':
                return (
                    <ProjectIKMRespondent
                        respondents={respondents}
                        projectId={project.id}
                        filters={respondentFilters}
                        canEdit={canEdit}
                    />
                );
            case 'sloi_respondent':
                return (
                    <ProjectSLOIRespondent
                        respondents={respondents}
                        projectId={project.id}
                        filters={respondentFilters}
                        canEdit={canEdit}
                    />
                );
            case 'sroi':
                return <ProjectSROI />;
            case 'enumerator':
                return (
                    <ProjectEnumeratorList
                        enumeratorList={enumeratorList}
                        project={{
                            id: project.id,
                            name: project.name,
                            code: project.projectCode,
                        }}
                        canEdit={canEdit}
                    />
                );
            default:
                return (
                    <ProjectOverview
                        project={project}
                        stats={stats}
                        ikmStats={ikmStats}
                        sloiStats={sloiStats}
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
                    actions={
                        canEdit ? (
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                                    project.status === 'active'
                                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                            >
                                {project.status === 'active' ? (
                                    <>
                                        <PauseCircle className="size-3.5" />
                                        Jadikan Draft
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="size-3.5" />
                                        Aktifkan Proyek
                                    </>
                                )}
                            </button>
                        ) : undefined
                    }
                />

                {/* Konfirmasi Status Modal */}
                {canEdit && showStatusModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowStatusModal(false)}
                        />
                        {/* Dialog */}
                        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                            {/* Close */}
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                            >
                                <X className="size-4" />
                            </button>

                            {/* Icon */}
                            <div
                                className={`mb-4 flex size-12 items-center justify-center rounded-full ${
                                    pendingStatus === 'draft'
                                        ? 'bg-amber-100'
                                        : 'bg-green-100'
                                }`}
                            >
                                {pendingStatus === 'draft' ? (
                                    <AlertTriangle className="size-6 text-amber-500" />
                                ) : (
                                    <CheckCircle className="size-6 text-green-500" />
                                )}
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {pendingStatus === 'active'
                                    ? 'Aktifkan Proyek?'
                                    : 'Jadikan Draft?'}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Apakah kamu yakin ingin mengubah status proyek{' '}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    &ldquo;{project.name}&rdquo;
                                </span>{' '}
                                {pendingStatus === 'active'
                                    ? 'dari Draft menjadi Aktif? Proyek akan dapat diakses oleh enumerator.'
                                    : 'dari Aktif menjadi Draft? Enumerator tidak dapat mengakses proyek ini sementara.'}
                            </p>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        router.patch(
                                            route('projects.update-status', {
                                                id: project.id,
                                            }),
                                            { status: pendingStatus },
                                            { preserveScroll: true },
                                        );
                                    }}
                                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white transition ${
                                        pendingStatus === 'active'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-amber-500 hover:bg-amber-600'
                                    }`}
                                >
                                    {pendingStatus === 'active' ? (
                                        <>
                                            <CheckCircle className="size-4" />
                                            Ya, Aktifkan
                                        </>
                                    ) : (
                                        <>
                                            <PauseCircle className="size-4" />
                                            Ya, Jadikan Draft
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </CompanyLayout>
    );
}
