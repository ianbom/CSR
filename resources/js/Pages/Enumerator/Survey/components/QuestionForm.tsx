import {
    LikertScaleQuestion,
    SurveyFooter,
    SurveyHeader,
    SurveyProgressCard,
} from '@/Components/Enumerator';
import { useMemo } from 'react';

// Question interface — sesuai kolom tabel template_questions
interface Question {
    id: number;
    category: string | null;
    code: string;
    question_text: string;
    order_no: number;
}

// For IKM: each question has two answer slots (kepentingan + kinerja)
// Key format: `${questionId}-ikm-kepentingan` | `${questionId}-ikm-kinerja` | `${questionId}-sloi`
export type QuestionAnswers = Record<string, number>;

interface QuestionFormProps {
    questions: Question[];
    answers: QuestionAnswers;
    surveyType: string; // 'IKM' | 'SLOI'
    onChange: (answers: QuestionAnswers) => void;
    onBack: () => void;
    onNext: () => void;
    onClose: () => void;
}

const IKM_LABELS: {
    kepentingan: { min: string; max: string };
    kinerja: { min: string; max: string };
} = {
    kepentingan: { min: 'Tidak Penting', max: 'Sangat Penting' },
    kinerja: { min: 'Tidak Baik', max: 'Sangat Baik' },
};

const SLOI_LABELS = { min: 'Sangat Tidak Setuju', max: 'Sangat Setuju' };

export default function QuestionForm({
    questions,
    answers,
    surveyType,
    onChange,
    onBack,
    onNext,
    onClose,
}: QuestionFormProps) {
    const isIKM = surveyType.toUpperCase() === 'IKM';

    // For IKM: need 2 answers per question; for SLOI: 1 per question
    const totalRequired = isIKM ? questions.length * 2 : questions.length;

    const progressPercentage = useMemo(() => {
        if (totalRequired === 0) return 0;
        return Math.round((Object.keys(answers).length / totalRequired) * 100);
    }, [answers, totalRequired]);

    const handleAnswerChange = (key: string, value: number) => {
        onChange({ ...answers, [key]: value });
    };

    const isComplete = Object.keys(answers).length === totalRequired;

    // Group by category
    const groupedQuestions = useMemo(() => {
        const groups: Record<string, Question[]> = {};
        questions.forEach((q) => {
            const cat = q.category || 'Umum';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(q);
        });
        return groups;
    }, [questions]);

    let questionNumber = 0;

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-8">
            {/* Survey Header */}
            <SurveyHeader
                title={isIKM ? 'Survei IKM' : 'Survei SLOI'}
                subtitle="Publik &amp; Masyarakat"
                onClose={onClose}
            />

            {/* Progress Card */}
            <SurveyProgressCard
                percentage={progressPercentage}
                title="Kelengkapan Survei"
                description={
                    isIKM
                        ? 'Tiap pertanyaan memiliki 2 penilaian: Kepentingan dan Kinerja.'
                        : 'Mohon lengkapi semua pertanyaan untuk melanjutkan.'
                }
            />

            {/* IKM legend */}
            {isIKM && (
                <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="inline-block size-3 rounded-full bg-blue-500" />
                        <span className="font-semibold text-blue-700">
                            Kepentingan
                        </span>
                        <span className="text-blue-500">— skala 1–4</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block size-3 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-emerald-700">
                            Kinerja
                        </span>
                        <span className="text-emerald-500">— skala 1–4</span>
                    </div>
                </div>
            )}

            {/* Questions */}
            {questions.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
                    <p className="text-sm font-medium text-amber-700">
                        Tidak ada pertanyaan ditemukan untuk tipe survei ini.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {Object.entries(groupedQuestions).map(
                        ([category, catQuestions]) => (
                            <div key={category} className="flex flex-col gap-4">
                                {Object.keys(groupedQuestions).length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <div className="h-px flex-1 bg-gray-200" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            {category}
                                        </span>
                                        <div className="h-px flex-1 bg-gray-200" />
                                    </div>
                                )}

                                {catQuestions.map((question) => {
                                    questionNumber++;

                                    if (isIKM) {
                                        const kepKey = `${question.id}-ikm-kepentingan`;
                                        const kinKey = `${question.id}-ikm-kinerja`;
                                        return (
                                            <div
                                                key={question.id}
                                                className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                                            >
                                                {/* Question title */}
                                                <div className="flex gap-3">
                                                    <span className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                                                        {questionNumber}
                                                    </span>
                                                    <h3 className="pt-0.5 text-base font-bold leading-snug text-gray-900">
                                                        {question.question_text}
                                                    </h3>
                                                </div>

                                                {/* Kepentingan */}
                                                <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50/40 p-3">
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                                                        Kepentingan
                                                    </p>
                                                    <LikertScaleQuestion
                                                        questionNumber={0}
                                                        question=""
                                                        name={kepKey}
                                                        value={answers[kepKey]}
                                                        onChange={(v) =>
                                                            handleAnswerChange(
                                                                kepKey,
                                                                v,
                                                            )
                                                        }
                                                        scaleSize={4}
                                                        minLabel={
                                                            IKM_LABELS
                                                                .kepentingan.min
                                                        }
                                                        maxLabel={
                                                            IKM_LABELS
                                                                .kepentingan.max
                                                        }
                                                        isAnswered={
                                                            answers[kepKey] !==
                                                            undefined
                                                        }
                                                    />
                                                </div>

                                                {/* Kinerja */}
                                                <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                                                        Kinerja
                                                    </p>
                                                    <LikertScaleQuestion
                                                        questionNumber={0}
                                                        question=""
                                                        name={kinKey}
                                                        value={answers[kinKey]}
                                                        onChange={(v) =>
                                                            handleAnswerChange(
                                                                kinKey,
                                                                v,
                                                            )
                                                        }
                                                        scaleSize={4}
                                                        minLabel={
                                                            IKM_LABELS.kinerja
                                                                .min
                                                        }
                                                        maxLabel={
                                                            IKM_LABELS.kinerja
                                                                .max
                                                        }
                                                        isAnswered={
                                                            answers[kinKey] !==
                                                            undefined
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }

                                    // SLOI — single answer
                                    const sloiKey = `${question.id}-sloi`;
                                    return (
                                        <LikertScaleQuestion
                                            key={question.id}
                                            questionNumber={questionNumber}
                                            question={question.question_text}
                                            name={sloiKey}
                                            value={answers[sloiKey]}
                                            onChange={(value) =>
                                                handleAnswerChange(
                                                    sloiKey,
                                                    value,
                                                )
                                            }
                                            scaleSize={5}
                                            minLabel={SLOI_LABELS.min}
                                            maxLabel={SLOI_LABELS.max}
                                            isAnswered={
                                                answers[sloiKey] !== undefined
                                            }
                                        />
                                    );
                                })}
                            </div>
                        ),
                    )}
                </div>
            )}

            {/* Footer Actions */}
            <SurveyFooter
                onBack={onBack}
                onSubmit={onNext}
                backLabel="Kembali"
                submitLabel="Review Jawaban"
                submitIcon="rate_review"
                isSubmitDisabled={!isComplete}
            />
        </div>
    );
}
