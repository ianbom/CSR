import {
    FilterChip,
    PageHeader,
    ProjectCard,
    ProjectData,
    ProjectStatus,
    ProjectType,
    ProjectVerificationModal,
    SearchInput,
} from '@/Components/Enumerator';
import EnumeratorLayout from '@/Layouts/EnumeratorLayout';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type FilterStatus = 'all' | ProjectStatus;

// Sample data - in real app, this would come from props/API
const sampleProjects: ProjectData[] = [
    {
        id: 1,
        title: 'Survei Kepuasan Masyarakat 2024',
        institution: 'Dinas Kependudukan',
        type: 'IKM',
        status: 'active',
        startDate: '10 Jan',
        endDate: '25 Jan 2024',
    },
    {
        id: 2,
        title: 'Indeks Layanan Online Terpadu',
        institution: 'Kementerian Komunikasi',
        type: 'SLOI',
        status: 'active',
        startDate: '15 Jan',
        endDate: '20 Feb 2024',
    },
    {
        id: 3,
        title: 'Evaluasi Kinerja Pelayanan Publik',
        institution: 'Pemerintah Kota Bandung',
        type: 'IKM',
        status: 'upcoming',
        startDate: '01 Mar',
        endDate: '30 Mar 2024',
    },
    {
        id: 4,
        title: 'Survei Kesehatan Lingkungan',
        institution: 'Dinas Kesehatan',
        type: 'SLOI',
        status: 'finished',
        startDate: '01 Des',
        endDate: '31 Des 2023',
    },
];

interface FilterOption {
    label: string;
    value: FilterStatus;
}

const filterOptions: FilterOption[] = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Sedang Berjalan', value: 'active' },
    { label: 'Akan Datang', value: 'upcoming' },
];

export default function ListProject() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
        null,
    );

    const filteredProjects = useMemo(() => {
        return sampleProjects.filter((project) => {
            // Filter by status
            if (activeFilter !== 'all' && project.status !== activeFilter) {
                return false;
            }

            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    project.title.toLowerCase().includes(query) ||
                    project.institution.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [searchQuery, activeFilter]);

    const handleStartSurvey = (project: ProjectData) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleViewReport = (project: ProjectData) => {
        console.log('Viewing report:', project);
        // Navigate to report page
    };

    const handleVerificationSubmit = (
        projectCode: string,
        surveyType: ProjectType,
    ) => {
        console.log('Verification submitted:', {
            projectCode,
            surveyType,
            project: selectedProject,
        });
        // Navigate to survey page with verified data
    };

    return (
        <EnumeratorLayout activeNav="dashboard">
            <Head title="Daftar Project Survei" />

            {/* Page Heading */}
            <PageHeader
                title="Daftar Project Survei"
                description="Kelola dan laksanakan tugas survei anda dengan efisien."
            />

            {/* Filters & Search */}
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                {/* Search Bar */}
                <SearchInput
                    placeholder="Cari berdasarkan nama project atau instansi..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="w-full lg:max-w-md"
                />

                {/* Filter Chips */}
                <div className="flex w-full gap-2 overflow-x-auto pb-2 lg:w-auto lg:pb-0">
                    {filterOptions.map((option) => (
                        <FilterChip
                            key={option.value}
                            active={activeFilter === option.value}
                            onClick={() => setActiveFilter(option.value)}
                            showDropdown={option.value === 'all'}
                        >
                            {option.label}
                        </FilterChip>
                    ))}
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onStartSurvey={handleStartSurvey}
                        onViewReport={handleViewReport}
                    />
                ))}

                {filteredProjects.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                        <p className="text-lg text-gray-500">
                            Tidak ada project yang ditemukan.
                        </p>
                    </div>
                )}
            </div>

            {/* Verification Modal */}
            <ProjectVerificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
                onSubmit={handleVerificationSubmit}
            />
        </EnumeratorLayout>
    );
}
