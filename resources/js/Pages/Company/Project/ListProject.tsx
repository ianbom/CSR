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
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Data dummy - ganti dengan props dari backend
const mockProjects: Project[] = [
    {
        id: '1',
        code: 'SROI-24-082',
        name: 'Inisiatif Pertanian Berkelanjutan',
        type: 'SROI',
        typeLabel: 'Social Return on Investment (SROI)',
        location: 'Penilaian Q3',
        status: 'active',
        currentResponses: 842,
        targetResponses: 1200,
    },
    {
        id: '2',
        code: 'IKM-24-015',
        name: 'Audit Kesehatan Masyarakat',
        type: 'IKM',
        typeLabel: 'Indeks Kepuasan Masyarakat (IKM)',
        location: 'Tingkat Regional',
        status: 'active',
        currentResponses: 142,
        targetResponses: 500,
    },
    {
        id: '3',
        code: 'SLOI-24-004',
        name: 'Perpanjangan Izin Area Tambang',
        type: 'SLOI',
        typeLabel: 'Social License to Operate (SLOI)',
        location: 'Site A',
        status: 'draft',
        currentResponses: 0,
        targetResponses: 250,
    },
    {
        id: '4',
        code: 'IKM-23-112',
        name: 'Kepuasan Layanan Tahunan 2023',
        type: 'IKM',
        typeLabel: 'Indeks Kepuasan Masyarakat (IKM)',
        location: 'Kantor Pusat',
        status: 'closed',
        currentResponses: 2104,
        targetResponses: 2000,
    },
];

const filterTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'active', label: 'Aktif' },
    { key: 'draft', label: 'Draft' },
    { key: 'closed', label: 'Selesai' },
];

export default function ListProject() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

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
                        totalPages={3}
                        totalItems={24}
                        itemsPerPage={4}
                        onPageChange={setCurrentPage}
                    />
                </div>

                {/* Kartu Ringkasan */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <SummaryCard
                        icon="monitoring"
                        iconBgColor="bg-primary/10"
                        iconColor="text-primary"
                        title="Total ROI Terlacak"
                        value="Rp 67M"
                        subtitle="+12% dari kuartal sebelumnya"
                    />
                    <SummaryCard
                        icon="groups"
                        iconBgColor="bg-primary/10"
                        iconColor="text-primary"
                        title="Total Responden"
                        value="12.482"
                        subtitle="Dari 4 kampanye aktif"
                    />
                    <SummaryCard
                        icon="draft"
                        iconBgColor="bg-amber-50"
                        iconColor="text-amber-600"
                        title="Proposal Draft"
                        value="7"
                        subtitle="Menunggu persetujuan supervisor"
                    />
                </div>
            </div>
        </CompanyLayout>
    );
}
