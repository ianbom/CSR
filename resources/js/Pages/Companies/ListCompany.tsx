import {
    Icon,
    Pagination,
    SearchInput,
    SummaryCard,
} from '@/Components/Company';
import PrimaryButton from '@/Components/PrimaryButton';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';
import ModalCompany from './components/ModalCompany';

// ─── Types ─────────────────────────────────────────────────

interface CompanyData {
    id: number;
    name: string;
    legal_name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: 'active' | 'pending' | 'suspended' | 'deleted';
    usersCount: number;
    projectsCount: number;
    createdAt: string | null;
}

interface Summary {
    totalCompanies: number;
    activeCompanies: number;
    pendingCompanies: number;
    suspendedCompanies: number;
}

interface PaginatedCompanies {
    data: CompanyData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Filters {
    search: string | null;
    status: string;
    sort_by: string;
    sort_order: string;
    per_page: number;
}

interface Props {
    companies: PaginatedCompanies;
    summary: Summary;
    filters: Filters;
}

// ─── Status Badge ──────────────────────────────────────────

const statusConfig: Record<
    string,
    { label: string; bg: string; text: string }
> = {
    active: { label: 'Aktif', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700' },
    suspended: { label: 'Suspended', bg: 'bg-red-50', text: 'text-red-700' },
    deleted: { label: 'Dihapus', bg: 'bg-slate-100', text: 'text-slate-500' },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? statusConfig.active;
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
        >
            {cfg.label}
        </span>
    );
}

// ─── Filter Tabs ───────────────────────────────────────────

const filterTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'active', label: 'Aktif' },
    { key: 'pending', label: 'Pending' },
    { key: 'suspended', label: 'Suspended' },
];

const perPageOptions = [10, 25, 50, 100];

// ─── Component ─────────────────────────────────────────────

export default function ListCompany({ companies, summary, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(
                '/companies',
                { ...filters, search: value || null, page: 1 },
                { preserveState: true, preserveScroll: true },
            );
        }, 400),
        [filters],
    );

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleFilterChange = (status: string) => {
        router.get(
            '/companies',
            { ...filters, status, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSort = (key: string) => {
        const newOrder =
            filters.sort_by === key && filters.sort_order === 'asc'
                ? 'desc'
                : 'asc';
        router.get(
            '/companies',
            { ...filters, sort_by: key, sort_order: newOrder, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/companies',
            { ...filters, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            '/companies',
            { ...filters, per_page: perPage, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AppLayout breadcrumb={{ parent: 'Dashboard', current: 'Companies' }}>
            <Head title="Companies" />

            <div className="p-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Daftar Perusahaan
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Kelola semua perusahaan yang terdaftar dalam sistem.
                        </p>
                    </div>
                    <PrimaryButton
                        className="flex items-center gap-2"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Icon name="add" className="text-sm" />
                        Tambah Perusahaan
                    </PrimaryButton>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        icon="business"
                        iconBgColor="bg-blue-50"
                        iconColor="text-blue-600"
                        title="Total Perusahaan"
                        value={summary.totalCompanies}
                        subtitle="Semua perusahaan terdaftar"
                    />
                    <SummaryCard
                        icon="check_circle"
                        iconBgColor="bg-emerald-50"
                        iconColor="text-emerald-600"
                        title="Aktif"
                        value={summary.activeCompanies}
                        subtitle="Perusahaan aktif"
                    />
                    <SummaryCard
                        icon="schedule"
                        iconBgColor="bg-amber-50"
                        iconColor="text-amber-600"
                        title="Pending"
                        value={summary.pendingCompanies}
                        subtitle="Menunggu verifikasi"
                    />
                    <SummaryCard
                        icon="block"
                        iconBgColor="bg-red-50"
                        iconColor="text-red-600"
                        title="Suspended"
                        value={summary.suspendedCompanies}
                        subtitle="Perusahaan ditangguhkan"
                    />
                </div>

                {/* Search, Filter, Per Page */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <SearchInput
                        placeholder="Cari nama, email, atau telepon..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleFilterChange(tab.key)}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    filters.status === tab.key
                                        ? 'bg-primary text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">
                            Tampilkan:
                        </span>
                        <select
                            value={filters.per_page}
                            onChange={(e) =>
                                handlePerPageChange(Number(e.target.value))
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {perPageOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {companies.data.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        #
                                    </th>
                                    <SortableHeader
                                        label="Nama Perusahaan"
                                        sortKey="name"
                                        currentSort={filters.sort_by}
                                        currentOrder={filters.sort_order}
                                        onSort={handleSort}
                                    />
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Telepon
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Users
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Proyek
                                    </th>
                                    <SortableHeader
                                        label="Status"
                                        sortKey="status"
                                        currentSort={filters.sort_by}
                                        currentOrder={filters.sort_order}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Terdaftar"
                                        sortKey="created_at"
                                        currentSort={filters.sort_by}
                                        currentOrder={filters.sort_order}
                                        onSort={handleSort}
                                    />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {companies.data.map((company, idx) => (
                                    <tr
                                        key={company.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 text-slate-400">
                                            {(companies.current_page - 1) *
                                                companies.per_page +
                                                idx +
                                                1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {company.name}
                                                </p>
                                                {company.legal_name && (
                                                    <p className="text-xs text-slate-400">
                                                        {company.legal_name}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {company.email || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {company.phone || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                                <Icon
                                                    name="group"
                                                    className="text-sm text-slate-400"
                                                />
                                                {company.usersCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                                <Icon
                                                    name="assignment"
                                                    className="text-sm text-slate-400"
                                                />
                                                {company.projectsCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge
                                                status={company.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {company.createdAt || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <Icon
                                name="business"
                                className="mx-auto text-5xl text-slate-300"
                            />
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                {searchQuery || filters.status !== 'all'
                                    ? 'Tidak ada perusahaan ditemukan'
                                    : 'Belum ada perusahaan'}
                            </h3>
                            <p className="mt-2 text-slate-500">
                                {searchQuery || filters.status !== 'all'
                                    ? 'Coba ubah filter atau kata kunci pencarian.'
                                    : 'Tambahkan perusahaan pertama untuk memulai.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {companies.last_page > 1 && (
                    <div className="mb-8">
                        <Pagination
                            currentPage={companies.current_page}
                            totalPages={companies.last_page}
                            totalItems={companies.total}
                            itemsPerPage={companies.per_page}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {/* Info */}
                {companies.total > 0 && (
                    <div className="text-sm text-slate-500">
                        Menampilkan {companies.from} - {companies.to} dari{' '}
                        {companies.total} perusahaan
                    </div>
                )}
            </div>

            {/* Modal */}
            <ModalCompany
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </AppLayout>
    );
}

// ─── Sortable Header ───────────────────────────────────────

function SortableHeader({
    label,
    sortKey,
    currentSort,
    currentOrder,
    onSort,
}: {
    label: string;
    sortKey: string;
    currentSort: string;
    currentOrder: string;
    onSort: (key: string) => void;
}) {
    const isActive = currentSort === sortKey;
    return (
        <th
            className="cursor-pointer px-6 py-4 font-semibold text-slate-500 transition-colors hover:text-slate-700"
            onClick={() => onSort(sortKey)}
        >
            <span className="inline-flex items-center gap-1">
                {label}
                {isActive && (
                    <Icon
                        name={
                            currentOrder === 'asc'
                                ? 'arrow_upward'
                                : 'arrow_downward'
                        }
                        className="text-xs text-primary"
                    />
                )}
            </span>
        </th>
    );
}
