import { ReactNode } from 'react';
import Icon from './Icon';

export interface Enumerator {
    id: string;
    name: string;
    email: string;
    avatar: string;
    isOnline: boolean;
    submissions: number;
    activeProjects: number;
}

interface EnumeratorCardProps {
    enumerator: Enumerator;
    onEdit?: (enumerator: Enumerator) => void;
    onDelete?: (enumerator: Enumerator) => void;
}

export default function EnumeratorCard({
    enumerator,
    onEdit,
    onDelete,
}: EnumeratorCardProps): ReactNode {
    return (
        <div className="group relative rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50">
            {/* Action Buttons */}
            <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {onEdit && (
                    <button
                        onClick={() => onEdit(enumerator)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
                    >
                        <Icon name="edit" className="text-lg" />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(enumerator)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                        <Icon name="delete" className="text-lg" />
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                    <div className="size-20 overflow-hidden rounded-full border-4 border-slate-50">
                        <img
                            src={enumerator.avatar}
                            alt={enumerator.name}
                            className="size-full object-cover"
                        />
                    </div>
                    <div
                        className={`absolute bottom-1 right-1 size-4 rounded-full border-2 border-white ${
                            enumerator.isOnline
                                ? 'bg-green-500'
                                : 'bg-slate-300'
                        }`}
                    />
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-slate-900">
                    {enumerator.name}
                </h3>
                <p className="mb-6 text-sm text-slate-500">
                    {enumerator.email}
                </p>

                {/* Stats */}
                <div className="grid w-full grid-cols-2 gap-4 border-t border-slate-100 pt-6">
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
