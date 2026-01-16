import { sloiData } from '@/data';
import { ReactNode } from 'react';

import {
    SLOIAgeRangeChart,
    SLOIAuditLog,
    SLOIEducationChart,
    SLOIGenderPieChart,
    SLOIHeader,
    SLOIQuestionScores,
    SLOIScoreGauge,
    SLOITrendChart,
} from './SLOI';

// Menggunakan data dari JSON
const stats = sloiData.stats;
const ageRange = sloiData.ageRange;
const trendData = sloiData.trendData;
const auditLog = sloiData.auditLog;

export default function ProjectSLOI(): ReactNode {
    const handleViewAllAudit = () => {
        console.log('View all audit logs');
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <SLOIHeader
                totalResponses={stats.totalResponses}
                progress={stats.progress}
                targetResponses={stats.targetResponses}
            />

            {/* Main Score & Trend Row */}
            <div className="grid gap-6 lg:grid-cols-5">
                <SLOIScoreGauge
                    sloiScore={stats.sloiScore}
                    trustLevel={stats.trustLevel}
                />
                <SLOITrendChart trendData={trendData} />
            </div>

            {/* Demographics Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <SLOIGenderPieChart />

                <div className="space-y-6">
                    <SLOIEducationChart />
                    <SLOIAgeRangeChart ageRange={ageRange} />
                </div>
            </div>

            {/* Question Scores */}
            <SLOIQuestionScores />

            {/* Audit Log */}
            <SLOIAuditLog
                auditLog={auditLog}
                totalResponses={stats.totalResponses}
                onViewAll={handleViewAllAudit}
            />
        </div>
    );
}
