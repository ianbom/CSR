import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import EnumeratorLayout from '@/Layouts/EnumeratorLayout';
import {
    SurveyHeader,
    SurveyProgressCard,
    LikertScaleQuestion,
    SurveyFooter,
} from '@/Components/Enumerator';

// Question interface
interface Question {
    id: number;
    text: string;
}

// Sample questions - in real app, this would come from props/API
const sampleQuestions: Question[] = [
    {
        id: 1,
        text: 'Seberapa mudah proses pengajuan dokumen di loket pelayanan ini?',
    },
    {
        id: 2,
        text: 'Apakah petugas pelayanan bersikap ramah dan sopan?',
    },
    {
        id: 3,
        text: 'Apakah fasilitas ruang tunggu nyaman dan bersih?',
    },
    {
        id: 4,
        text: 'Apakah informasi biaya pelayanan disampaikan secara transparan?',
    },
    {
        id: 5,
        text: 'Apakah waktu pelayanan sesuai dengan standar yang dijanjikan?',
    },
];

export default function QuestionSurvey() {
    // State to track answers: { questionId: answerValue }
    const [answers, setAnswers] = useState<Record<number, number>>({});

    // Calculate which question is currently active (first unanswered)
    const activeQuestionId = useMemo(() => {
        for (const question of sampleQuestions) {
            if (answers[question.id] === undefined) {
                return question.id;
            }
        }
        return null; // All answered
    }, [answers]);

    // Calculate progress percentage
    const progressPercentage = useMemo(() => {
        const answeredCount = Object.keys(answers).length;
        return Math.round((answeredCount / sampleQuestions.length) * 100);
    }, [answers]);

    // Handle answer change
    const handleAnswerChange = (questionId: number, value: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    // Handle back navigation
    const handleBack = () => {
        router.visit(route('enumerator.survey.respondent'));
    };

    // Handle close survey
    const handleClose = () => {
        if (confirm('Apakah Anda yakin ingin menutup survei? Data yang belum disimpan akan hilang.')) {
            router.visit(route('enumerator.list-survey'));
        }
    };

    // Handle submit
    const handleSubmit = () => {
        console.log('Survey submitted:', answers);
        // In real app, submit to API then navigate to success page
        alert('Survei berhasil dikirim!');
        router.visit(route('enumerator.list-survey'));
    };

    // Check if all questions are answered
    const isComplete = Object.keys(answers).length === sampleQuestions.length;

    return (
        <EnumeratorLayout activeNav="tugasku">
            <Head title="Kuesioner Survei" />

            {/* Survey Header */}
            <SurveyHeader
                title="Survei Kepuasan"
                subtitle="Publik & Masyarakat"
                onClose={handleClose}
            />

            {/* Content Container */}
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                {/* Progress Card */}
                <SurveyProgressCard
                    percentage={progressPercentage}
                    title="Kelengkapan Survei"
                    description="Mohon lengkapi semua pertanyaan untuk melanjutkan."
                />

                {/* Questions List */}
                <div className="flex flex-col gap-4">
                    {sampleQuestions.map((question) => (
                        <LikertScaleQuestion
                            key={question.id}
                            questionNumber={question.id}
                            question={question.text}
                            name={`q${question.id}`}
                            value={answers[question.id]}
                            onChange={(value) => handleAnswerChange(question.id, value)}
                            isActive={activeQuestionId === question.id}
                            isAnswered={answers[question.id] !== undefined}
                        />
                    ))}
                </div>

                {/* Spacer for fixed footer */}
                <div className="h-24" />
            </div>

            {/* Fixed Footer */}
            <SurveyFooter
                onBack={handleBack}
                onSubmit={handleSubmit}
                backLabel="Kembali"
                submitLabel="Submit Review"
                submitIcon="check"
                isSubmitDisabled={!isComplete}
            />
        </EnumeratorLayout>
    );
}
