import {
    Icon,
    Pagination,
    SearchInput,
    SummaryCard,
} from '@/Components/Company';
import CreateInstrumentTemplateModal from '@/Components/Company/CreateInstrumentTemplateModal';
import EditInstrumentTemplateModal, {
    type EditTemplateData,
} from '@/Components/Company/EditInstrumentTemplateModal';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────

interface TemplateData {
    id: number;
    type: 'IKM' | 'SLOI';
    name: string;
    version: number;
    description: string | null;
    isActive: boolean;
    publishedAt: string | null;
    createdBy: string;
    questionsCount: number;
    createdAt: string | null;
}

interface Summary {
    totalTemplates: number;
    activeTemplates: number;
    ikmTemplates: number;
    sloiTemplates: number;
}

interface PaginatedTemplates {
    data: TemplateData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Filters {
    search: string | null;
    type: string;
    status: string;
    sort_by: string;
    sort_order: string;
    per_page: number;
}

interface Props {
    templates: PaginatedTemplates;
    summary: Summary;
    filters: Filters;
}

// ─── Constants ─────────────────────────────────────────────

const typeColors: Record<string, { bg: string; text: string }> = {
    IKM: { bg: 'bg-blue-50', text: 'text-blue-700' },
    SLOI: { bg: 'bg-violet-50', text: 'text-violet-700' },
};

const typeTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'ikm', label: 'IKM' },
    { key: 'sloi', label: 'SLOI' },
];

const statusTabs = [
    { key: 'all', label: 'Semua Status' },
    { key: 'active', label: 'Aktif' },
    { key: 'inactive', label: 'Tidak Aktif' },
];

const perPageOptions = [10, 25, 50, 100];

// ─── Component ─────────────────────────────────────────────

export default function ListInstrument({ templates, summary, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EditTemplateData | null>(null);

    const handleEdit = (tpl: TemplateData) => {
        setEditingTemplate({
            id: tpl.id,
            type: tpl.type,
            name: tpl.name,
            version: tpl.version,
            description: tpl.description,
            isActive: tpl.isActive,
        });
        setShowEditModal(true);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(
                '/templates',
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

    const handleTypeFilter = (type: string) => {
        router.get(
            '/templates',
            { ...filters, type, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(
            '/templates',
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
            '/templates',
            { ...filters, sort_by: key, sort_order: newOrder, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/templates',
            { ...filters, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            '/templates',
            { ...filters, per_page: perPage, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDelete = (tpl: TemplateData) => {
        if (
            confirm(`Apakah Anda yakin ingin menghapus template "${tpl.name}"?`)
        ) {
            router.delete(`/templates/${tpl.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout
            breadcrumb={{
                parent: 'Dashboard',
                current: 'Instrument Templates',
            }}
        >
            <Head title="Instrument Templates" />

            <div className="p-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Instrument Templates
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Kelola template instrumen survei IKM dan SLOI.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-primary-btn px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-btn/20 transition-all hover:bg-primary-btn-hover active:scale-95"
                    >
                        <Icon name="add" className="text-lg" />
                        Tambah Template
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        icon="folder"
                        iconBgColor="bg-blue-50"
                        iconColor="text-blue-600"
                        title="Total Template"
                        value={summary.totalTemplates}
                        subtitle="Semua template terdaftar"
                    />
                    <SummaryCard
                        icon="check_circle"
                        iconBgColor="bg-emerald-50"
                        iconColor="text-emerald-600"
                        title="Template Aktif"
                        value={summary.activeTemplates}
                        subtitle="Siap digunakan"
                    />
                    <SummaryCard
                        icon="assignment"
                        iconBgColor="bg-sky-50"
                        iconColor="text-sky-600"
                        title="Template IKM"
                        value={summary.ikmTemplates}
                        subtitle="Indeks Kepuasan Masyarakat"
                    />
                    <SummaryCard
                        icon="analytics"
                        iconBgColor="bg-violet-50"
                        iconColor="text-violet-600"
                        title="Template SLOI"
                        value={summary.sloiTemplates}
                        subtitle="Social Life Outcome Index"
                    />
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <SearchInput
                        placeholder="Cari nama atau deskripsi template..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    {/* Type tabs */}
                    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                        {typeTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleTypeFilter(tab.key)}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    filters.type === tab.key
                                        ? 'bg-primary text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {/* Status tabs */}
                    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleStatusFilter(tab.key)}
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
                    {/* Per page */}
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
                <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    {templates.data.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        #
                                    </th>
                                    <SortableHeader
                                        label="Nama Template"
                                        sortKey="name"
                                        currentSort={filters.sort_by}
                                        currentOrder={filters.sort_order}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Tipe"
                                        sortKey="type"
                                        currentSort={filters.sort_by}
                                        currentOrder={filters.sort_order}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Versi"
                                        sortKey="version"
                                        currentSort={filters.sort_by}
                                        currentOrder={filters.sort_order}
                                        onSort={handleSort}
                                    />
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Pertanyaan
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Dibuat Oleh
                                    </th>
                                    <SortableHeader
                                        label="Status"
                                        sortKey="is_active"
                                        currentSort={filters.sort_by}
                                        currentOrder={filters.sort_order}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Dipublikasi"
                                        sortKey="published_at"
                                        currentSort={filters.sort_by}
                                        currentOrder={filters.sort_order}
                                        onSort={handleSort}
                                    />
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Dibuat
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold text-slate-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {templates.data.map((tpl, idx) => {
                                    const tc =
                                        typeColors[tpl.type] ?? typeColors.IKM;
                                    return (
                                        <tr
                                            key={tpl.id}
                                            className="transition-colors hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 text-slate-400">
                                                {(templates.current_page - 1) *
                                                    templates.per_page +
                                                    idx +
                                                    1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {tpl.name}
                                                    </p>
                                                    {tpl.description && (
                                                        <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                                                            {tpl.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${tc.bg} ${tc.text}`}
                                                >
                                                    {tpl.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-semibold text-slate-700">
                                                v{tpl.version}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                                    <Icon
                                                        name="quiz"
                                                        className="text-sm text-slate-400"
                                                    />
                                                    {tpl.questionsCount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {tpl.createdBy}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                        tpl.isActive
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}
                                                >
                                                    {tpl.isActive
                                                        ? 'Aktif'
                                                        : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {tpl.publishedAt || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {tpl.createdAt || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <ActionMenu
                                                    tpl={tpl}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <Icon
                                name="folder_off"
                                className="mx-auto text-5xl text-slate-300"
                            />
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                {searchQuery ||
                                filters.type !== 'all' ||
                                filters.status !== 'all'
                                    ? 'Tidak ada template ditemukan'
                                    : 'Belum ada template'}
                            </h3>
                            <p className="mt-2 text-slate-500">
                                {searchQuery ||
                                filters.type !== 'all' ||
                                filters.status !== 'all'
                                    ? 'Coba ubah filter atau kata kunci pencarian.'
                                    : 'Tambahkan template pertama untuk memulai.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {templates.last_page > 1 && (
                    <div className="mb-8">
                        <Pagination
                            currentPage={templates.current_page}
                            totalPages={templates.last_page}
                            totalItems={templates.total}
                            itemsPerPage={templates.per_page}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {/* Info */}
                {templates.total > 0 && (
                    <div className="text-sm text-slate-500">
                        Menampilkan {templates.from} - {templates.to} dari{' '}
                        {templates.total} template
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateInstrumentTemplateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
            <EditInstrumentTemplateModal
                isOpen={showEditModal}
                template={editingTemplate}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingTemplate(null);
                }}
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

// ─── Action Menu ───────────────────────────────────────────

function ActionMenu({
    tpl,
    onEdit,
    onDelete,
}: {
    tpl: TemplateData;
    onEdit: (tpl: TemplateData) => void;
    onDelete: (tpl: TemplateData) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative flex justify-end">
            <button
                onClick={() => setOpen((v) => !v)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Aksi"
            >
                <Icon name="more_vert" className="text-lg" />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg shadow-slate-200/50 ring-1 ring-black/5">
                    <Link
                        href={`/templates/${tpl.id}`}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                        onClick={() => setOpen(false)}
                    >
                        <Icon name="visibility" className="text-base" />
                        Detail
                    </Link>
                    <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-amber-600"
                        onClick={() => {
                            setOpen(false);
                            onEdit(tpl);
                        }}
                    >
                        <Icon name="edit" className="text-base" />
                        Edit
                    </button>
                    <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
                        onClick={() => {
                            setOpen(false);
                            onDelete(tpl);
                        }}
                    >
                        <Icon name="delete" className="text-base" />
                        Hapus
                    </button>
                </div>
            )}
        </div>
    );
}
