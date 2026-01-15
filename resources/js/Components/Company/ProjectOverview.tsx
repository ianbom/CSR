import { MetricCard, Submission, SubmissionTable } from '@/Components/Company';
import { ReactNode } from 'react';

// Data dummy - ganti dengan props dari backend
const mockSubmissions: Submission[] = [
    {
        id: '#RES-2026-0045',
        dateTime: '24 Okt 2026 • 14:20',
        respondentType: 'Masyarakat Lokal',
        impactScore: 8.5,
        status: 'verified',
    },
    {
        id: '#RES-2026-0044',
        dateTime: '24 Okt 2026 • 13:55',
        respondentType: 'Usaha Kecil',
        impactScore: 7.0,
        status: 'verified',
    },
    {
        id: '#RES-2026-0043',
        dateTime: '24 Okt 2026 • 11:12',
        respondentType: 'Pejabat Pemerintah',
        impactScore: 9.5,
        status: 'pending',
    },
    {
        id: '#RES-2026-0042',
        dateTime: '23 Okt 2026 • 17:45',
        respondentType: 'Perwakilan NGO',
        impactScore: 6.0,
        status: 'verified',
    },
    {
        id: '#RES-2026-0041',
        dateTime: '23 Okt 2026 • 16:30',
        respondentType: 'Pakar Akademisi',
        impactScore: 8.2,
        status: 'verified',
    },
];

interface ProjectOverviewProps {
    project: {
        ikmScore: number;
        ikmTrend: string;
        sloiLevel: string;
        sloiProgress: number;
        sroiRatio: string;
    };
}

export default function ProjectOverview({
    project,
}: ProjectOverviewProps): ReactNode {
    return (
        <>
            {/* Metric Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* IKM Card */}
                <MetricCard
                    icon="sentiment_satisfied"
                    iconBgColor="bg-blue-50"
                    iconColor="text-blue-600"
                    label="IKM Score"
                    value={project.ikmScore}
                    unit="/ 100"
                    badge={{ text: project.ikmTrend, type: 'positive' }}
                    footer={
                        <p className="text-xs text-slate-500">
                            Kualitas layanan dinilai{' '}
                            <span className="font-bold text-blue-600">
                                Sangat Baik
                            </span>
                        </p>
                    }
                />

                {/* SLOI Card */}
                <MetricCard
                    icon="handshake"
                    iconBgColor="bg-amber-50"
                    iconColor="text-amber-600"
                    label="SLOI Level"
                    value={project.sloiLevel}
                    badge={{ text: 'STABIL', type: 'stable' }}
                    footer={
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full ${
                                        i <= project.sloiProgress
                                            ? 'bg-primary'
                                            : 'bg-slate-200'
                                    }`}
                                />
                            ))}
                        </div>
                    }
                />

                {/* SROI Card */}
                <MetricCard
                    icon="payments"
                    iconBgColor="bg-primary/10"
                    iconColor="text-primary"
                    label="SROI Ratio"
                    value={project.sroiRatio}
                    footer={
                        <p className="text-xs text-slate-500">
                            Setiap Rp1 menghasilkan{' '}
                            <span className="font-bold text-primary">
                                Rp3.20
                            </span>{' '}
                            dampak
                        </p>
                    }
                />
            </div>

            {/* Submissions Table */}
            <SubmissionTable
                submissions={mockSubmissions}
                onViewAll={() => console.log('View all')}
            />
        </>
    );
}
