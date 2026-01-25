import {
    FilterTabs,
    Icon,
    Pagination,
    Project,
    ProjectTable,
    SearchInput,
    SummaryCard,
} from '@/Components/Company';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Summary {
    totalProjects: number;
    activeProjects: number;
    draftProjects: number;
    closedProjects: number;
    totalRespondents: number;
}

interface Props {
    projects: Project[];
    summary: Summary;
}

const filterTabs = [
    { id: 'all', label: 'Semua' },
    { id: 'active', label: 'Aktif' },
    { id: 'draft', label: 'Draft' },
    { id: 'closed', label: 'Selesai' },
];

export default function ListProject({ projects, summary }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter proyek berdasarkan pencarian dan status
    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' || project.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    // Pagination
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const handleEdit = (project: Project) => {
        console.log('Edit proyek:', project);
    };

    const handleDelete = (project: Project) => {
        console.log('Hapus proyek:', project);
    };

    return (
        <CompanyLayout breadcrumb={{ parent: 'Dashboard', current: 'Proyek' }}>
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
                        className="flex items-center gap-2 rounded-lg bg-primary-btn px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-btn-hover"
                    >
                        <Icon name="add" />
                        Buat Proyek
                    </Link>
                </div>

                {/* Kartu Ringkasan */}
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <SummaryCard
                        icon="folder"
                        iconBgColor="bg-primary/10"
                        iconColor="text-primary"
                        title="Total Proyek"
                        value={summary.totalProjects.toString()}
                        subtitle={`${summary.activeProjects} aktif`}
                    />
                    <SummaryCard
                        icon="groups"
                        iconBgColor="bg-primary/10"
                        iconColor="text-primary"
                        title="Total Responden"
                        value={summary.totalRespondents.toString()}
                        subtitle="Dari semua proyek"
                    />
                    <SummaryCard
                        icon="draft"
                        iconBgColor="bg-amber-50"
                        iconColor="text-amber-600"
                        title="Proposal Draft"
                        value={summary.draftProjects.toString()}
                        subtitle="Menunggu aktivasi"
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
                    {paginatedProjects.length > 0 ? (
                        <ProjectTable
                            projects={paginatedProjects}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                            <Icon name="folder_off" className="mx-auto text-5xl text-slate-300" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                Belum ada proyek
                            </h3>
                            <p className="mt-2 text-slate-500">
                                Mulai buat proyek pertama Anda untuk melacak dampak sosial.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mb-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredProjects.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </CompanyLayout>
    );
}
