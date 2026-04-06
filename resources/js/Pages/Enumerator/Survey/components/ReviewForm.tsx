import {
    DemographicItem,
    MaterialIcon,
    ReviewFooter,
    ReviewItem,
    ReviewPageHeader,
    ReviewProgressBar,
    ReviewSection,
    WarningBox,
} from '@/Components/Enumerator';
import { useMemo } from 'react';
import { QuestionAnswers } from './QuestionForm';
import PhotoCaptureSection from './PhotoCaptureSection';
import { RespondentData } from './RespondentForm';
import { usePhotoCapture } from './usePhotoCapture';

export interface GpsLocation {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
}

interface Question {
    id: number;
    category: string | null;
    code: string;
    question_text: string;
    order_no: number;
}

interface ReviewFormProps {
    respondentData: RespondentData;
    answers: QuestionAnswers;
    questions: Question[];
    gpsLocation: GpsLocation;
    onBack: () => void;
    onEditRespondent: () => void;
    onEditQuestions: () => void;
    onSubmit: (photo: File) => void;
    onSubmitAndContinue: (photo: File) => void;
    isSubmitting: boolean;
}

export default function ReviewForm({
    respondentData,
    answers,
    questions,
    gpsLocation,
    onBack,
    onEditRespondent,
    onEditQuestions,
    onSubmit,
    onSubmitAndContinue,
    isSubmitting,
}: ReviewFormProps) {
    const photoHook = usePhotoCapture('photo');

    const validateBeforeSubmit = (): boolean => {
        if (!photoHook.photo) {
            photoHook.clearError();
            // Trigger error via the hook's internal state — we do this by reading
            // the fileInputRef; simplest way is to call the setter on the hook.
            // Since hook doesn't expose setError directly, we use DOM approach:
            // Just show a manual alert.
            alert('Foto bukti wajib diunggah.');
            return false;
        }
        if (!gpsLocation.latitude || !gpsLocation.longitude) {
            alert(
                'Koordinat GPS belum tersedia. Pastikan izin lokasi diaktifkan.',
            );
            return false;
        }
        return true;
    };

    const handleSubmitClick = () => {
        if (!validateBeforeSubmit()) return;
        onSubmit(photoHook.photo!);
    };

    const handleSubmitAndContinueClick = () => {
        if (!validateBeforeSubmit()) return;
        onSubmitAndContinue(photoHook.photo!);
    };

    const questionMap = useMemo(() => {
        const map = new Map<number, Question>();
        questions.forEach((q) => map.set(q.id, q));
        return map;
    }, [questions]);

    const typeLabel = (type: string): string => {
        switch (type) {
            case 'ikm-kepentingan':
                return 'IKM Kepentingan';
            case 'ikm-kinerja':
                return 'IKM Kinerja';
            case 'sloi':
                return 'SLOI';
            default:
                return type;
        }
    };

    const genderLabel =
        respondentData.gender === 'male'
            ? 'Pria'
            : respondentData.gender === 'female'
              ? 'Wanita'
              : '-';

    return (
        <>
            <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-4 py-6 md:px-8 lg:px-0">
                <ReviewProgressBar percentage={100} />

                <ReviewPageHeader
                    title="Review & Submit"
                    subtitle="Periksa kembali semua data sebelum mengirim"
                />

                {/* Data Responden Lengkap */}
                <ReviewSection
                    title="Data Responden"
                    icon="person"
                    variant="grid"
                >
                    <DemographicItem
                        label="Nama Lengkap"
                        value={respondentData.name || '-'}
                        onEdit={onEditRespondent}
                    />
                    <DemographicItem
                        label="Nomor Telepon"
                        value={respondentData.phone || '-'}
                        onEdit={onEditRespondent}
                    />
                    <DemographicItem
                        label="Usia"
                        value={
                            respondentData.age
                                ? `${respondentData.age} Tahun`
                                : '-'
                        }
                        onEdit={onEditRespondent}
                    />
                    <DemographicItem
                        label="Jenis Kelamin"
                        value={genderLabel}
                        onEdit={onEditRespondent}
                    />
                    <DemographicItem
                        label="Status Keluarga"
                        value={respondentData.respondent_status || '-'}
                        onEdit={onEditRespondent}
                    />
                    <DemographicItem
                        label="Pendidikan Terakhir"
                        value={respondentData.education_level || '-'}
                        onEdit={onEditRespondent}
                    />
                    <DemographicItem
                        label="Pekerjaan Utama"
                        value={respondentData.main_occupation || '-'}
                        onEdit={onEditRespondent}
                    />
                    <DemographicItem
                        label="Pendapatan per Bulan"
                        value={
                            respondentData.monthly_income
                                ? `Rp ${parseInt(respondentData.monthly_income).toLocaleString('id-ID')}`
                                : '-'
                        }
                        onEdit={onEditRespondent}
                    />
                    <DemographicItem
                        label="Alamat Lengkap"
                        value={respondentData.address || '-'}
                        onEdit={onEditRespondent}
                    />
                </ReviewSection>

                {/* Jawaban Kuesioner */}
                <ReviewSection title="Jawaban Kuesioner" icon="quiz">
                    {Object.entries(answers).length > 0 ? (
                        Object.entries(answers)
                            .sort(([keyA], [keyB]) => {
                                const qIdA = Number(
                                    keyA.substring(0, keyA.indexOf('-')),
                                );
                                const qIdB = Number(
                                    keyB.substring(0, keyB.indexOf('-')),
                                );
                                const orderA =
                                    questionMap.get(qIdA)?.order_no ?? qIdA;
                                const orderB =
                                    questionMap.get(qIdB)?.order_no ?? qIdB;
                                if (orderA !== orderB) return orderA - orderB;
                                return keyA.localeCompare(keyB);
                            })
                            .map(([key, value]) => {
                                const dashIdx = key.indexOf('-');
                                const qId = Number(key.substring(0, dashIdx));
                                const type = key.substring(dashIdx + 1);
                                const question = questionMap.get(qId);

                                return (
                                    <ReviewItem
                                        key={key}
                                        label={`${question?.code ?? `Q${qId}`} — ${typeLabel(type)}`}
                                        value={question?.question_text ?? '-'}
                                        badge={
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold text-primary">
                                                Nilai: {value}
                                            </span>
                                        }
                                        onEdit={onEditQuestions}
                                    />
                                );
                            })
                    ) : (
                        <ReviewItem
                            label="Status"
                            value="Belum ada jawaban"
                            onEdit={onEditQuestions}
                        />
                    )}
                </ReviewSection>

                {/* GPS Location */}
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <MaterialIcon
                            name="location_on"
                            className="text-primary"
                        />
                        <h3 className="text-sm font-semibold text-gray-800">
                            Lokasi GPS
                        </h3>
                    </div>
                    {gpsLocation.error ? (
                        <p className="text-sm text-red-500">
                            ⚠ {gpsLocation.error}
                        </p>
                    ) : gpsLocation.latitude && gpsLocation.longitude ? (
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <span>
                                <span className="font-medium">Latitude:</span>{' '}
                                {gpsLocation.latitude.toFixed(6)}
                            </span>
                            <span>
                                <span className="font-medium">Longitude:</span>{' '}
                                {gpsLocation.longitude.toFixed(6)}
                            </span>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">
                            Mengambil koordinat GPS...
                        </p>
                    )}
                </div>

                {/* Photo Upload */}
                <PhotoCaptureSection hook={photoHook} required />

                <WarningBox
                    title="Pengiriman Bersifat Final"
                    message="Pastikan semua data di atas sudah benar. Setelah dikirim, data survei ini akan dikunci dan tidak dapat diubah oleh enumerator."
                />
            </div>

            <ReviewFooter
                onBack={onBack}
                onSubmit={handleSubmitClick}
                onSubmitAndContinue={handleSubmitAndContinueClick}
                isSubmitting={isSubmitting}
            />
        </>
    );
}
