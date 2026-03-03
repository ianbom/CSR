import { Icon, SummaryCard } from '@/Components/Company';
import CreateQuestionModal from '@/Components/Company/CreateQuestionModal';
import EditQuestionModal, {
    type QuestionData,
} from '@/Components/Company/EditQuestionModal';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

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

interface Props {
    template: TemplateData;
    questions: QuestionData[];
}

// ─── Constants ─────────────────────────────────────────────

const typeColors: Record<string, { bg: string; text: string }> = {
    IKM: { bg: 'bg-blue-50', text: 'text-blue-700' },
    SLOI: { bg: 'bg-violet-50', text: 'text-violet-700' },
};

// ─── Component ─────────────────────────────────────────────

export default function DetailInstrument({ template, questions }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editQuestion, setEditQuestion] = useState<QuestionData | null>(null);

    const handleEdit = (q: QuestionData) => {
        setEditQuestion(q);
        setIsEditOpen(true);
    };

    const handleDelete = (q: QuestionData) => {
        if (
            confirm(`Apakah Anda yakin ingin menghapus pertanyaan "${q.code}"?`)
        ) {
            router.delete(`/templates/${template.id}/questions/${q.id}`, {
                preserveScroll: true,
            });
        }
    };

    const tc = typeColors[template.type] ?? typeColors.IKM;

    // Compute category stats
    const categories = [
        ...new Set(questions.map((q) => q.category).filter(Boolean)),
    ];

    return (
        <AppLayout breadcrumb={{ parent: 'Templates', current: template.name }}>
            <Head title={`Template: ${template.name}`} />

            <div className="p-8">
                {/* Back link + Header */}
                <div className="mb-6">
                    <Link
                        href="/templates"
                        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-primary"
                    >
                        <Icon name="arrow_back" className="text-base" />
                        Kembali ke Daftar Template
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-slate-900">
                                    {template.name}
                                </h1>
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tc.bg} ${tc.text}`}
                                >
                                    {template.type}
                                </span>
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                        template.isActive
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {template.isActive
                                        ? 'Aktif'
                                        : 'Tidak Aktif'}
                                </span>
                            </div>
                            {template.description && (
                                <p className="mt-2 max-w-2xl text-slate-500">
                                    {template.description}
                                </p>
                            )}
                            <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                                <span>Versi {template.version}</span>
                                <span>•</span>
                                <span>Dibuat oleh {template.createdBy}</span>
                                {template.publishedAt && (
                                    <>
                                        <span>•</span>
                                        <span>
                                            Dipublikasi {template.publishedAt}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-primary-btn px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-btn/20 transition-all hover:bg-primary-btn-hover active:scale-95"
                        >
                            <Icon name="add" className="text-lg" />
                            Tambah Pertanyaan
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryCard
                        icon="quiz"
                        iconBgColor="bg-blue-50"
                        iconColor="text-blue-600"
                        title="Total Pertanyaan"
                        value={questions.length}
                        subtitle="Pertanyaan dalam template"
                    />
                    <SummaryCard
                        icon="category"
                        iconBgColor="bg-amber-50"
                        iconColor="text-amber-600"
                        title="Kategori"
                        value={categories.length}
                        subtitle="Kategori unik"
                    />
                    <SummaryCard
                        icon="calendar_month"
                        iconBgColor="bg-emerald-50"
                        iconColor="text-emerald-600"
                        title="Dibuat"
                        value={template.createdAt || '-'}
                        subtitle="Tanggal template dibuat"
                    />
                </div>

                {/* Questions Table */}
                <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    {questions.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        No
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Kode
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Kategori
                                    </th>
                                    <th className="min-w-[300px] px-6 py-4 font-semibold text-slate-500">
                                        Pertanyaan
                                    </th>
                                    <th className="px-6 py-4 font-semibold text-slate-500">
                                        Urutan
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold text-slate-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {questions.map((q, idx) => (
                                    <tr
                                        key={q.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 text-slate-400">
                                            {idx + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                                                {q.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {q.category || (
                                                <span className="text-slate-300">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800">
                                            {q.questionText}
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-slate-600">
                                            {q.orderNo}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(q)
                                                    }
                                                    className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <Icon
                                                        name="edit"
                                                        className="text-base"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(q)
                                                    }
                                                    className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                    title="Hapus"
                                                >
                                                    <Icon
                                                        name="delete"
                                                        className="text-base"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <Icon
                                name="quiz"
                                className="mx-auto text-5xl text-slate-300"
                            />
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                Belum ada pertanyaan
                            </h3>
                            <p className="mt-2 text-slate-500">
                                Klik tombol &ldquo;Tambah Pertanyaan&rdquo;
                                untuk menambahkan pertanyaan ke template ini.
                            </p>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-btn px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary-btn-hover active:scale-95"
                            >
                                <Icon name="add" className="text-lg" />
                                Tambah Pertanyaan
                            </button>
                        </div>
                    )}
                </div>

                {/* Info */}
                {questions.length > 0 && (
                    <div className="text-sm text-slate-500">
                        Total {questions.length} pertanyaan
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <CreateQuestionModal
                isOpen={isCreateOpen}
                templateId={template.id}
                onClose={() => setIsCreateOpen(false)}
            />

            {/* Edit Modal */}
            <EditQuestionModal
                isOpen={isEditOpen}
                templateId={template.id}
                question={editQuestion}
                onClose={() => {
                    setIsEditOpen(false);
                    setEditQuestion(null);
                }}
            />
        </AppLayout>
    );
}
