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
import { Head, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

type FilterStatus = 'all' | ProjectStatus;

interface FilterOption {
    label: string;
    value: FilterStatus;
}

const filterOptions: FilterOption[] = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Sedang Berjalan', value: 'active' },
    { label: 'Akan Datang', value: 'upcoming' },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ListProjectProps {
    projects: {
        data: ProjectData[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            from: number;
            to: number;
            total: number;
        };
    };
    filters: {
        search?: string;
        status?: FilterStatus;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
    };
}

export default function ListProject({ projects, filters }: ListProjectProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState<FilterStatus>(
        filters.status || 'all',
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
        null,
    );

    // Debounce search to prevent excessive API calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((query: string, status: FilterStatus) => {
            router.get(
                route('enumerator.list-survey'),
                { search: query, status: status },
                { preserveState: true, replace: true },
            );
        }, 300),
        [],
    );

    // Initial search query sync
    useEffect(() => {
        setSearchQuery(filters.search || '');
    }, [filters.search]);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query, activeFilter);
    };

    const handleFilterChange = (status: FilterStatus) => {
        setActiveFilter(status);
        // Direct update for better UX on filter click
        router.get(
            route('enumerator.list-survey'),
            { search: searchQuery, status: status },
            { preserveState: true, replace: true },
        );
    };

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
        if (!selectedProject) return;

        router.get(
            route('enumerator.survey.respondent', selectedProject.id),
            {
                projectCode,
                surveyType,
            },
            {
                onError: (errors) => {
                    console.error('Verification failed:', errors);
                    // You might want to handle flash errors here if your layout supports them
                },
                onFinish: () => {
                    setIsModalOpen(false);
                },
            },
        );
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
                    onChange={handleSearchChange}
                    className="w-full lg:max-w-md"
                />

                {/* Filter Chips */}
                <div className="flex w-full gap-2 overflow-x-auto pb-2 lg:w-auto lg:pb-0">
                    {filterOptions.map((option) => (
                        <FilterChip
                            key={option.value}
                            active={activeFilter === option.value}
                            onClick={() => handleFilterChange(option.value)}
                            showDropdown={option.value === 'all'}
                        >
                            {option.label}
                        </FilterChip>
                    ))}
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-2 xl:grid-cols-3">
                {projects.data.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onStartSurvey={handleStartSurvey}
                        onViewReport={handleViewReport}
                    />
                ))}

                {projects.data.length === 0 && (
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
