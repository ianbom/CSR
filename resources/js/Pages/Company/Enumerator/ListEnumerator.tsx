import { Icon, SearchInput } from '@/Components/Company';
import CreateEnumeratorModal from '@/Components/Company/CreateEnumeratorModal';
import EditEnumeratorModal from '@/Components/Company/EditEnumeratorModal';
import CompanyLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────

interface EnumeratorData {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    submissions: number;
    activeProjects: number;
    createdAt: string | null;
}

interface Filters {
    search?: string | null;
}

interface Props {
    enumerators: EnumeratorData[];
    filters: Filters;
}

// ─── Component ─────────────────────────────────────────────

export default function ListEnumerator({ enumerators, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editEnumerator, setEditEnumerator] = useState<EnumeratorData | null>(
        null,
    );

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            router.get(
                '/enumerators',
                { search: value || undefined },
                { preserveState: true, preserveScroll: true },
            );
        }, 400),
        [],
    );

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleEdit = (en: EnumeratorData) => {
        setEditEnumerator(en);
        setIsEditOpen(true);
    };

    const handleDelete = (en: EnumeratorData) => {
        if (confirm(`Hapus enumerator "${en.name}"?`)) {
            router.delete(`/company/enumerators/${en.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <CompanyLayout
            breadcrumb={{ parent: 'Halaman', current: 'Enumerator' }}
        >
            <Head title="Direktori Enumerator" />

            <div className="p-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Direktori Enumerator
                        </h2>
                        <p className="max-w-lg text-slate-500">
                            Kelola dan pantau performa staf lapangan, metrik
                            produktivitas, dan penugasan proyek aktif.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-primary-btn px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-btn/20 transition-all hover:bg-primary-btn-hover"
                    >
                        <Icon name="person_add" className="text-lg" />
                        <span>Tambah Enumerator</span>
                    </button>
                </div>

                {/* Search & Stats */}
                <div className="mb-8 flex items-center gap-4">
                    <SearchInput
                        placeholder="Cari berdasarkan nama, email, atau telepon..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
                        <Icon name="group" className="text-lg text-primary" />
                        <span>
                            <strong className="text-slate-900">
                                {enumerators.length}
                            </strong>{' '}
                            Enumerator
                        </span>
                    </div>
                </div>

                {/* Grid */}
                {enumerators.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16">
                        <Icon
                            name="person_search"
                            className="mb-4 text-5xl text-slate-300"
                        />
                        <h3 className="text-lg font-bold text-slate-700">
                            Belum ada enumerator
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                            Tambahkan enumerator pertama untuk memulai
                        </p>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-4 flex items-center gap-2 rounded-lg bg-primary-btn px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-btn-hover"
                        >
                            <Icon name="person_add" className="text-lg" />
                            Tambah Enumerator
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {enumerators.map((en) => (
                            <EnumeratorCardItem
                                key={en.id}
                                enumerator={en}
                                onEdit={() => handleEdit(en)}
                                onDelete={() => handleDelete(en)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <CreateEnumeratorModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            {/* Edit Modal */}
            <EditEnumeratorModal
                isOpen={isEditOpen}
                enumerator={editEnumerator}
                onClose={() => {
                    setIsEditOpen(false);
                    setEditEnumerator(null);
                }}
            />
        </CompanyLayout>
    );
}

// ─── Inline Card Component ─────────────────────────────────

function EnumeratorCardItem({
    enumerator,
    onEdit,
    onDelete,
}: {
    enumerator: EnumeratorData;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const initials = enumerator.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Pastikan Anda memanggil helper route() dengan benar sesuai setup Laravel/Inertia Anda
    const handleCardClick = () => {
        router.get(route('enumerators.show', { id: enumerator.id }));
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50"
        >
            {/* Action Buttons */}
            <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Mencegah klik menembus ke card
                        onEdit();
                    }}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
                >
                    <Icon name="edit" className="text-lg" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Mencegah klik menembus ke card
                        onDelete();
                    }}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                    <Icon name="delete" className="text-lg" />
                </button>
            </div>

            <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                    <div className="flex size-20 items-center justify-center rounded-full border-4 border-slate-50 bg-primary/10 text-xl font-bold text-primary">
                        {initials}
                    </div>
                    <div
                        className={`absolute bottom-1 right-1 size-4 rounded-full border-2 border-white ${
                            enumerator.isActive
                                ? 'bg-green-500'
                                : 'bg-slate-300'
                        }`}
                    />
                </div>

                {/* Info - Diubah dari <Link> menjadi tag teks biasa */}
                <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-primary">
                    {enumerator.name}
                </h3>
                <p className="text-sm text-slate-500">{enumerator.email}</p>
                {enumerator.phone && (
                    <p className="mt-0.5 text-xs text-slate-400">
                        {enumerator.phone}
                    </p>
                )}

                {/* Status Badge */}
                <span
                    className={`mt-2 inline-flex rounded-full px-3 py-0.5 text-[10px] font-bold uppercase ${
                        enumerator.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                    }`}
                >
                    {enumerator.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>

                {/* Stats */}
                <div className="mt-4 grid w-full grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-primary">
                            {enumerator.submissions}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Pengiriman
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-800">
                            {enumerator.activeProjects}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Proyek Aktif
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
