import { sroiData } from '@/data';
import { ReactNode } from 'react';

import {
    SROIHeader,
    SROIImpactChart,
    SROIKeyMetrics,
    SROIOutcomesTable,
    SROIStakeholderDonut,
} from './SROI';

// Menggunakan data dari JSON
const stats = sroiData.stats;
const impactTimeline = sroiData.impactTimeline;
const stakeholderImpact = sroiData.stakeholderImpact;
const outcomes = sroiData.outcomes;

export default function ProjectSROI(): ReactNode {
    const handleDownload = () => {
        console.log('Download report');
    };

    const handleCalculator = () => {
        console.log('Open SROI calculator');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <SROIHeader
                onDownload={handleDownload}
                onCalculator={handleCalculator}
            />

            {/* Key Metrics Grid */}
            <SROIKeyMetrics
                ratio={stats.ratio}
                netPresentValue={stats.netPresentValue}
                paybackPeriod={stats.paybackPeriod}
                paybackImprovement={stats.paybackImprovement}
            />

            {/* Financial Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <SROIImpactChart impactTimeline={impactTimeline} />
                <SROIStakeholderDonut stakeholderImpact={stakeholderImpact} />
            </div>

            {/* Detailed Outcomes Table */}
            <SROIOutcomesTable
                outcomes={outcomes}
                totalImpactValue={stats.totalImpactValue}
            />
        </div>
    );
}
