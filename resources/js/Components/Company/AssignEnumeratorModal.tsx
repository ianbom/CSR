import { FormEvent, useEffect, useState } from 'react';
import Icon from './Icon';

export interface Enumerator {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_assigned?: boolean;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    project: {
        id: number | string;
        name: string;
        code: string;
    } | null;
    enumerators: Enumerator[];
    assignedEnumeratorIds: number[];
    onSubmit: (projectId: number | string, enumeratorIds: number[]) => void;
    isLoading?: boolean;
}

export default function AssignEnumeratorModal({
    isOpen,
    onClose,
    project,
    enumerators,
    assignedEnumeratorIds,
    onSubmit,
    isLoading = false,
}: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(assignedEnumeratorIds);
            setSearchQuery('');
        }
    }, [isOpen, assignedEnumeratorIds]);

    if (!isOpen || !project) return null;

    const filteredEnumerators = enumerators.filter(
        (e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleToggle = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredEnumerators.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredEnumerators.map((e) => e.id));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(project.id, selectedIds);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Assign Enumerator
                        </h2>
                        <p className="text-sm text-slate-500">
                            Proyek:{' '}
                            <span className="font-medium">{project.name}</span>{' '}
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                                {project.code}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit}>
                    <div className="max-h-96 overflow-y-auto px-6 py-4">
                        {/* Search */}
                        <div className="mb-4">
                            <div className="relative">
                                <Icon
                                    name="search"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Cari enumerator..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Select All */}
                        {filteredEnumerators.length > 0 && (
                            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedIds.length ===
                                                filteredEnumerators.length &&
                                            filteredEnumerators.length > 0
                                        }
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-slate-700">
                                        Pilih Semua
                                    </span>
                                </label>
                                <span className="text-sm text-slate-500">
                                    {selectedIds.length} dipilih
                                </span>
                            </div>
                        )}

                        {/* Enumerator List */}
                        {filteredEnumerators.length > 0 ? (
                            <div className="space-y-2">
                                {filteredEnumerators.map((enumerator) => (
                                    <label
                                        key={enumerator.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(
                                                enumerator.id,
                                            )}
                                            onChange={() =>
                                                handleToggle(enumerator.id)
                                            }
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                            {enumerator.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">
                                                {enumerator.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {enumerator.email}
                                            </p>
                                        </div>
                                        {assignedEnumeratorIds.includes(
                                            enumerator.id,
                                        ) && (
                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                Assigned
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <Icon
                                    name="person_off"
                                    className="mx-auto text-4xl text-slate-300"
                                />
                                <p className="mt-2 text-sm text-slate-500">
                                    {searchQuery
                                        ? 'Enumerator tidak ditemukan'
                                        : 'Belum ada enumerator'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-lg bg-primary-btn px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-btn-hover disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Icon
                                        name="sync"
                                        className="animate-spin"
                                    />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Icon name="save" />
                                    Simpan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
