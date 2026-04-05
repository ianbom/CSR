import { MaterialIcon } from '@/Components/Enumerator';
import EnumeratorLayout from '@/Layouts/EnumeratorLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import EditReviewForm from './components/EditReviewForm';
import QuestionForm, {
    DescriptiveAnswers,
    QuestionAnswers,
} from './components/QuestionForm';
import RespondentForm, { RespondentData } from './components/RespondentForm';
import { GpsLocation } from './components/ReviewForm';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface Question {
    id: number;
    category: string | null;
    code: string;
    question_text: string;
    order_no: number;
}

interface Project {
    id: number;
    company_id: number;
    name: string;
    company?: { id: number; name: string };
}

interface Respondent {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    age: number | null;
    gender: string | null;
    respondent_status: string | null;
    education_level: string | null;
    main_occupation: string | null;
    monthly_income: number | null;
}

interface SubmissionMeta {
    id: number;
    assessment_type: string;
    photo_url: string | null;
    latitude: number | null;
    longitude: number | null;
    status: string;
}

interface Props {
    submission: SubmissionMeta;
    project: Project;
    respondent: Respondent;
    questions: Question[];
    /** key → value map: e.g. { "3-ikm-kepentingan": 3, "3-ikm-kinerja": 2 } */
    answersMap: Record<string, number>;
    descriptiveQuestions: { id: number; title: string }[];
    /** questionId → answer text */
    descriptiveAnswersMap: Record<number, string>;
}

// ─────────────────────────────────────────────────────────
// Step config
// ─────────────────────────────────────────────────────────

const steps = [
    { id: 1, label: 'Data Responden', icon: 'person' },
    { id: 2, label: 'Kuesioner', icon: 'quiz' },
    { id: 3, label: 'Review', icon: 'rate_review' },
];

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export default function EditSurvey({
    submission,
    project,
    respondent,
    questions,
    answersMap,
    descriptiveQuestions,
    descriptiveAnswersMap,
}: Props) {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Respondent state — seeded from existing data ──
    const [respondentData, setRespondentData] = useState<RespondentData>({
        name: respondent.name ?? '',
        address: respondent.address ?? '',
        phone: respondent.phone ?? '',
        age: respondent.age != null ? String(respondent.age) : '',
        gender: respondent.gender ?? '',
        respondent_status: respondent.respondent_status ?? '',
        education_level: respondent.education_level ?? '',
        main_occupation: respondent.main_occupation ?? '',
        monthly_income:
            respondent.monthly_income != null
                ? String(respondent.monthly_income)
                : '',
    });

    // ── Answers state — seeded from existing data ──
    const [answers, setAnswers] = useState<QuestionAnswers>(answersMap);

    // ── Descriptive answers — seeded from existing data ──
    const [descriptiveAnswers, setDescriptiveAnswers] =
        useState<DescriptiveAnswers>(descriptiveAnswersMap);

    // ── GPS ──
    const [gpsLocation, setGpsLocation] = useState<GpsLocation>({
        latitude: submission.latitude,
        longitude: submission.longitude,
        error: null,
    });

    // Re-fetch GPS for updated location
    useEffect(() => {
        if (!navigator.geolocation) {
            setGpsLocation((prev) => ({
                ...prev,
                error: 'Browser tidak mendukung GPS.',
            }));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                setGpsLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    error: null,
                }),
            () =>
                setGpsLocation((prev) => ({
                    ...prev,
                    error: 'Gagal memperbarui lokasi GPS. Menggunakan lokasi sebelumnya.',
                })),
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }, []);

    // ── Navigation ──
    const goToStep = (step: 1 | 2 | 3) => setCurrentStep(step);

    const handleBack = () => router.visit(route('enumerator.survey.history'));

    const handleCloseQuestionnaire = () => {
        if (
            confirm(
                'Batalkan pengeditan? Perubahan yang belum disimpan akan hilang.',
            )
        ) {
            router.visit(route('enumerator.survey.history'));
        }
    };

    // ── Build FormData ──
    /**
     * Builds FormData for the PUT request.
     * @param photo  New File if user re-took photo; null to keep existing.
     */
    const buildFormData = (photo: File | null): FormData => {
        const fd = new FormData();

        // Respondent
        fd.append('respondent[name]', respondentData.name);
        fd.append('respondent[address]', respondentData.address);
        fd.append('respondent[phone]', respondentData.phone);
        fd.append('respondent[age]', respondentData.age);
        fd.append('respondent[gender]', respondentData.gender);
        fd.append(
            'respondent[respondent_status]',
            respondentData.respondent_status,
        );
        fd.append(
            'respondent[education_level]',
            respondentData.education_level,
        );
        fd.append(
            'respondent[main_occupation]',
            respondentData.main_occupation,
        );
        fd.append('respondent[monthly_income]', respondentData.monthly_income);

        // Photo (only if re-taken)
        if (photo) {
            fd.append('submission[photo]', photo);
        }

        // GPS — use fetched or fallback to existing
        fd.append(
            'submission[latitude]',
            String(gpsLocation.latitude ?? submission.latitude ?? ''),
        );
        fd.append(
            'submission[longitude]',
            String(gpsLocation.longitude ?? submission.longitude ?? ''),
        );

        // Answers
        Object.entries(answers).forEach(([key, value], index) => {
            const dashIdx = key.indexOf('-');
            const questionId = key.substring(0, dashIdx);
            const type = key.substring(dashIdx + 1);
            fd.append(`answers[${index}][question_id]`, questionId);
            fd.append(`answers[${index}][type]`, type);
            fd.append(`answers[${index}][value]`, String(value));
        });

        // Descriptive answers
        Object.entries(descriptiveAnswers).forEach(([qId, answer], index) => {
            if (String(answer).trim()) {
                fd.append(`descriptive_answers[${index}][question_id]`, qId);
                fd.append(
                    `descriptive_answers[${index}][answer]`,
                    String(answer),
                );
            }
        });

        // Method spoofing for PUT
        fd.append('_method', 'PUT');

        return fd;
    };

    // ── Submit ──
    const submitUpdate = (photo: File | null) => {
        // Frontend guard: GPS must be available
        if (!gpsLocation.latitude || !gpsLocation.longitude) {
            alert(
                'Koordinat GPS belum tersedia. Pastikan izin lokasi diaktifkan.',
            );
            return;
        }

        // Frontend guard: respondent name must not be empty
        if (!respondentData.name.trim()) {
            alert('Nama responden wajib diisi.');
            goToStep(1);
            return;
        }

        // Frontend guard: all questions must be answered
        const isIKM = submission.assessment_type.toUpperCase() === 'IKM';
        const totalRequired = isIKM
            ? questions.reduce(
                  (acc, q) =>
                      acc +
                      (q.category === 'ikm-kepentingan' ||
                      q.category === 'ikm-kinerja'
                          ? 1
                          : 2),
                  0,
              )
            : questions.length;
        if (Object.keys(answers).length < totalRequired) {
            alert('Semua pertanyaan harus dijawab sebelum menyimpan.');
            goToStep(2);
            return;
        }

        setIsSubmitting(true);
        const formData = buildFormData(photo);

        router.post(
            route('enumerator.survey.update', { submissionId: submission.id }),
            formData as unknown as Record<string, string>,
            {
                onError: () => setIsSubmitting(false),
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    // ─────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────

    return (
        <EnumeratorLayout activeNav="tugasku">
            <Head title={`Edit Survei — ${project.name}`} />

            {/* Edit mode banner */}
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                <MaterialIcon
                    name="edit_note"
                    className="text-base text-amber-600"
                />
                <span>
                    Anda sedang mengedit submission{' '}
                    <strong>#{submission.id}</strong> —{' '}
                    {submission.assessment_type}
                </span>
            </div>

            {/* Step Indicator */}
            <div className="mb-6 flex items-center justify-center gap-0">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => {
                                    if (step.id < currentStep) {
                                        goToStep(step.id as 1 | 2 | 3);
                                    }
                                }}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                                    currentStep === step.id
                                        ? 'border-primary bg-primary text-white shadow-md'
                                        : currentStep > step.id
                                          ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                                          : 'border-gray-300 bg-white text-gray-400'
                                } ${step.id < currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                {currentStep > step.id ? (
                                    <MaterialIcon
                                        name="check"
                                        className="text-sm font-bold"
                                    />
                                ) : (
                                    <MaterialIcon
                                        name={step.icon}
                                        className="text-sm"
                                    />
                                )}
                            </button>
                            <span
                                className={`text-xs font-medium ${
                                    currentStep === step.id
                                        ? 'text-primary'
                                        : currentStep > step.id
                                          ? 'text-primary/70'
                                          : 'text-gray-400'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={`mx-2 mb-4 h-0.5 w-16 sm:w-24 ${
                                    currentStep > step.id
                                        ? 'bg-primary'
                                        : 'bg-gray-200'
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: Respondent */}
            {currentStep === 1 && (
                <RespondentForm
                    data={respondentData}
                    onChange={setRespondentData}
                    onBack={handleBack}
                    onNext={() => goToStep(2)}
                />
            )}

            {/* Step 2: Questions */}
            {currentStep === 2 && (
                <QuestionForm
                    questions={questions}
                    projectName={project.name}
                    answers={answers}
                    surveyType={submission.assessment_type}
                    onChange={setAnswers}
                    descriptiveQuestions={descriptiveQuestions}
                    descriptiveAnswers={descriptiveAnswers}
                    onDescriptiveChange={setDescriptiveAnswers}
                    onBack={() => goToStep(1)}
                    onNext={() => goToStep(3)}
                    onClose={handleCloseQuestionnaire}
                />
            )}

            {/* Step 3: Review & Save */}
            {currentStep === 3 && (
                <EditReviewForm
                    respondentData={respondentData}
                    answers={answers}
                    questions={questions}
                    gpsLocation={gpsLocation}
                    existingPhotoUrl={submission.photo_url}
                    onBack={() => goToStep(2)}
                    onEditRespondent={() => goToStep(1)}
                    onEditQuestions={() => goToStep(2)}
                    onSubmit={submitUpdate}
                    isSubmitting={isSubmitting}
                />
            )}
        </EnumeratorLayout>
    );
}
