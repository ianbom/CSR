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

// ─── Types ─────────────────────────────────────────────────

interface StatsData {
    totalResponses: number;
    targetResponses: number;
    progress: number;
    score: number;
    scoreLabel: string;
}

interface GenderItem {
    gender: string;
    count: number;
    percentage: number;
}

interface AgeRangeItem {
    range: string;
    count: number;
}

interface EducationItem {
    label: string;
    value: number;
    percentage: number;
}

interface DemographicsData {
    genderDistribution: GenderItem[];
    ageRange: AgeRangeItem[];
    educationLevel: EducationItem[];
}

interface QuestionScoreItem {
    id: string;
    question: string;
    score: number;
    importance: number;
    performance: number;
}

interface AuditLogItem {
    id: string;
    respondentName: string;
    enumerator: string;
    date: string;
    score: number;
    status: string;
    group: string;
}

interface TrendDataItem {
    month: string;
    score: number;
    height: number;
}

interface ProjectSLOIProps {
    stats: StatsData;
    demographics: DemographicsData;
    questionScores: QuestionScoreItem[];
    auditLog: AuditLogItem[];
    trendData: TrendDataItem[];
}

export default function ProjectSLOI({
    stats,
    demographics,
    questionScores,
    auditLog,
}: ProjectSLOIProps): ReactNode {
    // Transform gender data for GenderPieChart
    const genderData = (() => {
        const male = demographics.genderDistribution.find(
            (g) => g.gender === 'Laki-laki',
        );
        const female = demographics.genderDistribution.find(
            (g) => g.gender === 'Perempuan',
        );
        const total =
            demographics.genderDistribution.reduce(
                (sum, g) => sum + g.count,
                0,
            ) || 0;
        return {
            male: {
                count: male?.count ?? 0,
                percentage: male?.percentage ?? 0,
            },
            female: {
                count: female?.count ?? 0,
                percentage: female?.percentage ?? 0,
            },
            total,
        };
    })();

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
                    sloiScore={stats.score}
                    trustLevel={stats.scoreLabel}
                />
                <SLOITrendChart questionScores={questionScores} />
            </div>

            {/* Demographics Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <SLOIGenderPieChart data={genderData} />

                <div className="space-y-6">
                    <SLOIEducationChart data={demographics.educationLevel} />
                    <SLOIAgeRangeChart ageRange={demographics.ageRange} />
                </div>
            </div>

            {/* Question Scores */}
            <SLOIQuestionScores
                scores={questionScores.map((q) => ({
                    id: q.id,
                    score: q.score,
                }))}
            />

            {/* Audit Log */}
            <SLOIAuditLog
                auditLog={auditLog}
                totalResponses={stats.totalResponses}
            />
        </div>
    );
}
