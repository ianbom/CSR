import { ikmData } from '@/data';
import { ReactNode } from 'react';

import {
    IKMAnswerDistribution,
    IKMAuditLog,
    IKMAutoInsight,
    IKMQuestionScores,
    IKMScoreTrend,
    IKMStatsCards,
} from './IKM';

// Menggunakan data dari JSON
const stats = ikmData.stats;
const answerDistribution = ikmData.answerDistribution;
const scoreTrend = ikmData.scoreTrend;
const questionScores = ikmData.questionScores;
const autoInsights = ikmData.autoInsights;
const auditLog = ikmData.auditLog;

export default function ProjectIKM(): ReactNode {
    const handleLoadMore = () => {
        console.log('Load more audit logs');
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards Row */}
            <IKMStatsCards
                totalResponses={stats.totalResponses}
                targetResponses={stats.targetResponses}
                targetProgress={stats.targetProgress}
                ikmScore={stats.ikmScore}
                ikmScoreMax={stats.ikmScoreMax}
                lastSubmissionTime={stats.lastSubmissionTime}
                lastEnumerator={stats.lastEnumerator}
                weeklyTrend={stats.weeklyTrend}
            />

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <IKMScoreTrend scoreTrend={scoreTrend} />
                <IKMAnswerDistribution distribution={answerDistribution} />
            </div>

            {/* Question Scores + Auto-Insight */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <IKMQuestionScores questionScores={questionScores} />
                <IKMAutoInsight
                    positiveTrend={autoInsights.positiveTrend}
                    criticalAttention={autoInsights.criticalAttention}
                />
            </div>

            {/* Audit Log Table */}
            <IKMAuditLog auditLog={auditLog} onLoadMore={handleLoadMore} />
        </div>
    );
}
