import {
    LikertScaleQuestion,
    MaterialIcon,
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
    companyName?: string;
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
    companyName,
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

    const formatQuestionText = (text: string) => {
        if (!companyName) return text;
        return `${companyName} ${text}`;
    };

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
                        ? 'Tiap aspek dinilai dari 2 sisi: Kepentingan dan Kinerja.'
                        : 'Mohon lengkapi semua pertanyaan untuk melanjutkan.'
                }
            />

            {/* Company Name */}
            {companyName && (
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MaterialIcon name="apartment" className="text-xl" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500">
                            Perusahaan
                        </p>
                        <p className="text-base font-bold text-gray-900">
                            {companyName}
                        </p>
                    </div>
                </div>
            )}

            {/* IKM legend */}
            {isIKM && (
                <div className="flex flex-wrap gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex size-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                            K
                        </span>
                        <span className="font-semibold text-blue-700">
                            Kepentingan
                        </span>
                        <span className="text-gray-400">— skala 1–4</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex items-center gap-2">
                        <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                            P
                        </span>
                        <span className="font-semibold text-emerald-700">
                            Kinerja (Performa)
                        </span>
                        <span className="text-gray-400">— skala 1–4</span>
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
                <div className="flex flex-col gap-4">
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
                                    if (isIKM) {
                                        const kepKey = `${question.id}-ikm-kepentingan`;
                                        const kinKey = `${question.id}-ikm-kinerja`;
                                        const kepNumber = ++questionNumber;
                                        const kinNumber = ++questionNumber;
                                        return (
                                            <React.Fragment key={question.id}>
                                                {/* ── IKM Kepentingan ── */}
                                                <div className="rounded-xl border border-blue-100 bg-white shadow-sm">
                                                    <div className="flex items-center gap-2 rounded-t-xl border-b border-blue-100 bg-blue-50 px-4 py-2.5">
                                                        <span className="inline-flex size-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                                                            K
                                                        </span>
                                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                                            IKM Kepentingan
                                                        </span>
                                                    </div>
                                                    <div className="p-4">
                                                        <LikertScaleQuestion
                                                            questionNumber={
                                                                kepNumber
                                                            }
                                                            question={`Bagaimana Kepentingan ${formatQuestionText(question.question_text)}?`}
                                                            name={kepKey}
                                                            value={
                                                                answers[kepKey]
                                                            }
                                                            onChange={(v) =>
                                                                handleAnswerChange(
                                                                    kepKey,
                                                                    v,
                                                                )
                                                            }
                                                            scaleSize={4}
                                                            minLabel={
                                                                IKM_LABELS
                                                                    .kepentingan
                                                                    .min
                                                            }
                                                            maxLabel={
                                                                IKM_LABELS
                                                                    .kepentingan
                                                                    .max
                                                            }
                                                            isAnswered={
                                                                answers[
                                                                    kepKey
                                                                ] !== undefined
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {/* ── IKM Kinerja ── */}
                                                <div className="rounded-xl border border-emerald-100 bg-white shadow-sm">
                                                    <div className="flex items-center gap-2 rounded-t-xl border-b border-emerald-100 bg-emerald-50 px-4 py-2.5">
                                                        <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                                                            P
                                                        </span>
                                                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                                            IKM Kinerja
                                                        </span>
                                                    </div>
                                                    <div className="p-4">
                                                        <LikertScaleQuestion
                                                            questionNumber={
                                                                kinNumber
                                                            }
                                                            question={`Apakah Kinerja ${formatQuestionText(question.question_text)}?`}
                                                            name={kinKey}
                                                            value={
                                                                answers[kinKey]
                                                            }
                                                            onChange={(v) =>
                                                                handleAnswerChange(
                                                                    kinKey,
                                                                    v,
                                                                )
                                                            }
                                                            scaleSize={4}
                                                            minLabel={
                                                                IKM_LABELS.kinerja.min
                                                            }
                                                            maxLabel={
                                                                IKM_LABELS.kinerja.max
                                                            }
                                                            isAnswered={
                                                                answers[
                                                                    kinKey
                                                                ] !== undefined
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    }

                                    // SLOI — single answer
                                    questionNumber++;
                                    const sloiKey = `${question.id}-sloi`;
                                    return (
                                        <LikertScaleQuestion
                                            key={question.id}
                                            questionNumber={questionNumber}
                                            question={formatQuestionText(
                                                question.question_text,
                                            )}
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
