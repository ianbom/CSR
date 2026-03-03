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

export type QuestionAnswers = Record<number, number>;

interface QuestionFormProps {
    questions: Question[];
    answers: QuestionAnswers;
    onChange: (answers: QuestionAnswers) => void;
    onBack: () => void;
    onNext: () => void;
    onClose: () => void;
}

export default function QuestionForm({
    questions,
    answers,
    onChange,
    onBack,
    onNext,
    onClose,
}: QuestionFormProps) {
    // Progress
    const progressPercentage = useMemo(() => {
        if (questions.length === 0) return 0;
        const answeredCount = Object.keys(answers).length;
        return Math.round((answeredCount / questions.length) * 100);
    }, [answers, questions.length]);

    const handleAnswerChange = (questionId: number, value: number) => {
        onChange({
            ...answers,
            [questionId]: value,
        });
    };

    const isComplete = Object.keys(answers).length === questions.length;

    // Kelompokkan pertanyaan berdasarkan category
    const groupedQuestions = useMemo(() => {
        const groups: Record<string, Question[]> = {};
        questions.forEach((q) => {
            const cat = q.category || 'Umum';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(q);
        });
        return groups;
    }, [questions]);

    // Counter untuk nomor pertanyaan global
    let questionNumber = 0;

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-8">
            {/* Survey Header */}
            <SurveyHeader
                title="Survei Kepuasan"
                subtitle="Publik & Masyarakat"
                onClose={onClose}
            />

            {/* Progress Card */}
            <SurveyProgressCard
                percentage={progressPercentage}
                title="Kelengkapan Survei"
                description="Mohon lengkapi semua pertanyaan untuk melanjutkan."
            />

            {/* Questions List — grouped by category */}
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
                                {/* Category label */}
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
                                    return (
                                        <LikertScaleQuestion
                                            key={question.id}
                                            questionNumber={questionNumber}
                                            question={question.question_text}
                                            name={`q${question.id}`}
                                            value={answers[question.id]}
                                            onChange={(value) =>
                                                handleAnswerChange(
                                                    question.id,
                                                    value,
                                                )
                                            }
                                            isActive={false}
                                            isAnswered={
                                                answers[question.id] !==
                                                undefined
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
