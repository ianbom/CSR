import { Icon } from '@/Components/Company';
import { ReactNode } from 'react';

interface SROIHeaderProps {
    onDownload?: () => void;
    onCalculator?: () => void;
}

export default function SROIHeader({
    onDownload,
    onCalculator,
}: SROIHeaderProps): ReactNode {
    return (
        <div className="mb-8 flex items-start justify-between">
            <div>
                <div className="mb-2 flex items-center gap-3">
                    <h2 className="text-2xl font-black tracking-tight">
                        Analisis Social Return on Investment
                    </h2>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        BETA
                    </span>
                </div>
                <p className="text-slate-500">
                    Evaluasi nilai dampak sosial, ekonomi, dan lingkungan
                    terhadap investasi proyek.
                </p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-slate-50"
                >
                    <Icon name="download" className="text-sm" /> Unduh Laporan
                </button>
                <button
                    onClick={onCalculator}
                    className="flex items-center gap-2 rounded-lg bg-primary-btn px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-btn-hover"
                >
                    <Icon name="calculate" className="text-sm" /> Kalkulator
                    SROI
                </button>
            </div>
        </div>
    );
}
