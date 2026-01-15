import { TabNavigation } from '@/Components/Company';
import ProjectIKM from '@/Components/Company/ProjectIKM';
import ProjectOverview from '@/Components/Company/ProjectOverview';
import ProjectSLOI from '@/Components/Company/ProjectSLOI';
import ProjectSROI from '@/Components/Company/ProjectSROI';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

// Data dummy - ganti dengan props dari backend
const mockProject = {
    id: '1',
    name: 'Survei Surabaya 2026',
    description:
        'Analitik detail proyek dan tinjauan penilaian dampak untuk inisiatif keberlanjutan regional.',
    status: 'in_progress',
    currentResponses: 2220,
    targetResponses: 3000,
    ikmScore: 84.5,
    ikmTrend: '+2.4%',
    sloiLevel: 'High Approval',
    sloiProgress: 3,
    sroiRatio: '1 : 3.2',
};

const tabs = [
    { key: 'overview', label: 'Overview', icon: 'grid_view' },
    { key: 'ikm', label: 'IKM', icon: 'groups' },
    { key: 'sloi', label: 'SLOI', icon: 'verified_user' },
    { key: 'sroi', label: 'SROI', icon: 'account_balance_wallet' },
];

export default function DetailProject() {
    const [activeTab, setActiveTab] = useState('overview');
    const progress =
        (mockProject.currentResponses / mockProject.targetResponses) * 100;

    // Render konten berdasarkan tab aktif
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <ProjectOverview project={mockProject} />;
            case 'ikm':
                return <ProjectIKM />;
            case 'sloi':
                return <ProjectSLOI />;
            case 'sroi':
                return <ProjectSROI />;
            default:
                return <ProjectOverview project={mockProject} />;
        }
    };

    return (
        <CompanyLayout
            breadcrumb={{ parent: 'Proyek', current: mockProject.name }}
        >
            <Head title={`Detail Proyek - ${mockProject.name}`} />

            <div className="p-8">
                {/* Header Halaman */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {mockProject.name}
                            </h1>
                            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                                IN PROGRESS
                            </span>
                        </div>
                        <p className="text-slate-500">
                            {mockProject.description}
                        </p>
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
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <p className="mt-1 text-[10px] text-slate-500">
                                {mockProject.currentResponses.toLocaleString()}{' '}
                                of{' '}
                                {mockProject.targetResponses.toLocaleString()}{' '}
                                respondents
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </CompanyLayout>
    );
}
