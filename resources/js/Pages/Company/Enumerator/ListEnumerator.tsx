import {
    Enumerator,
    EnumeratorCard,
    Icon,
    SearchInput,
} from '@/Components/Company';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Data dummy - ganti dengan props dari backend
const mockEnumerators: Enumerator[] = [
    {
        id: '1',
        name: 'Johnathan Doe',
        email: 'j.doe@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
        submissions: 42,
        activeProjects: 3,
    },
    {
        id: '2',
        name: 'Sarah Jenkins',
        email: 's.jenkins@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
        submissions: 28,
        activeProjects: 2,
    },
    {
        id: '3',
        name: 'Michael Chen',
        email: 'm.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isOnline: false,
        submissions: 56,
        activeProjects: 5,
    },
    {
        id: '4',
        name: 'Elena Rodriguez',
        email: 'e.rod@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
        submissions: 12,
        activeProjects: 1,
    },
    {
        id: '5',
        name: 'David Park',
        email: 'd.park@company.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
        submissions: 89,
        activeProjects: 4,
    },
    {
        id: '6',
        name: 'Amina Diallo',
        email: 'a.diallo@company.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        isOnline: false,
        submissions: 34,
        activeProjects: 2,
    },
];

export default function ListEnumerator() {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter enumerator berdasarkan pencarian
    const filteredEnumerators = mockEnumerators.filter(
        (enumerator) =>
            enumerator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enumerator.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleEdit = (enumerator: Enumerator) => {
        console.log('Edit enumerator:', enumerator);
    };

    const handleDelete = (enumerator: Enumerator) => {
        console.log('Hapus enumerator:', enumerator);
    };

    return (
        <CompanyLayout
            breadcrumb={{ parent: 'Halaman', current: 'Enumerator' }}
        >
            <Head title="Direktori Enumerator" />

            <div className="p-8">
                {/* Header Halaman */}
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
                    <Link
                        href="/company/enumerators/create"
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                    >
                        <Icon name="person_add" className="text-lg" />
                        <span>Tambah Enumerator</span>
                    </Link>
                </div>

                {/* Filter & Pencarian */}
                <div className="mb-8 flex items-center gap-4">
                    <SearchInput
                        placeholder="Cari berdasarkan nama, email, atau ID proyek..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                        <Icon name="filter_list" className="text-lg" />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                        <Icon name="download" className="text-lg" />
                        <span>Ekspor</span>
                    </button>
                </div>

                {/* Grid Enumerator */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEnumerators.map((enumerator) => (
                        <EnumeratorCard
                            key={enumerator.id}
                            enumerator={enumerator}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* Load More */}
                <div className="mt-12 flex justify-center">
                    <button className="flex items-center gap-2 rounded-full border border-slate-200 px-6 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-50">
                        <span>Muat Lebih Banyak Enumerator</span>
                        <Icon name="expand_more" className="text-sm" />
                    </button>
                </div>
            </div>
        </CompanyLayout>
    );
}
