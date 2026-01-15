import {
    FilterTabs,
    Icon,
    Pagination,
    Project,
    ProjectTable,
    SearchInput,
    SummaryCard,
} from '@/Components/Company';
import { projectsData } from '@/data';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Menggunakan data dari JSON
const mockProjects = projectsData.projects as Project[];
const filterTabs = projectsData.filterTabs;
const summaryStats = projectsData.summaryStats;
const paginationConfig = projectsData.pagination;

export default function ListProject() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(paginationConfig.currentPage);

    // Filter proyek berdasarkan pencarian dan status
    const filteredProjects = mockProjects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' || project.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const handleEdit = (project: Project) => {
        console.log('Edit proyek:', project);
    };

    const handleDelete = (project: Project) => {
        console.log('Hapus proyek:', project);
    };

    return (
        <CompanyLayout breadcrumb={{ parent: 'Halaman', current: 'Proyek' }}>
            <Head title="Proyek" />

            <div className="p-8">
                {/* Header Halaman */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Portofolio Proyek
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Pantau performa dampak sosial melalui survei IKM,
                            SLOI, dan SROI.
                        </p>
                    </div>
                    <Link
                        href="/company/projects/create"
                        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                        <Icon name="add" />
                        Buat Proyek
                    </Link>
                </div>

                {/* Kartu Ringkasan */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
                    <SummaryCard
                        icon="monitoring"
                        iconBgColor="bg-primary/10"
                        iconColor="text-primary"
                        title="Total ROI Terlacak"
                        value={summaryStats.totalROI}
                        subtitle={summaryStats.totalROITrend}
                    />
                    <SummaryCard
                        icon="groups"
                        iconBgColor="bg-primary/10"
                        iconColor="text-primary"
                        title="Total Responden"
                        value={summaryStats.totalRespondents}
                        subtitle={summaryStats.totalRespondentsSubtitle}
                    />
                    <SummaryCard
                        icon="draft"
                        iconBgColor="bg-amber-50"
                        iconColor="text-amber-600"
                        title="Proposal Draft"
                        value={summaryStats.draftProposals}
                        subtitle={summaryStats.draftProposalsSubtitle}
                    />
                </div>

                {/* Bagian Filter */}
                <div className="mb-6 flex items-center gap-4">
                    <SearchInput
                        placeholder="Cari berdasarkan nama proyek, kode, atau analis..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                    <FilterTabs
                        tabs={filterTabs}
                        activeTab={activeFilter}
                        onTabChange={setActiveFilter}
                    />
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <Icon name="tune" className="text-lg" />
                        Filter Lanjutan
                    </button>
                </div>

                {/* Tabel Proyek */}
                <div className="mb-6">
                    <ProjectTable
                        projects={filteredProjects}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Pagination */}
                <div className="mb-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={paginationConfig.totalPages}
                        totalItems={paginationConfig.totalItems}
                        itemsPerPage={paginationConfig.itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </CompanyLayout>
    );
}
