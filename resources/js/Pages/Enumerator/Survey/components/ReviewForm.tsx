/**
 * ReviewForm — Unified component for both create and edit modes.
 *
 * Mode differences:
 * - Create mode: Requires new photo, shows 2 buttons (Submit & Submit+Continue)
 * - Edit mode: Shows existing photo (optional re-take), shows 1 button (Save Changes)
 */
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
    mode?: 'create' | 'edit';
    respondentData: RespondentData;
    answers: QuestionAnswers;
    questions: Question[];
    gpsLocation: GpsLocation;
    /** URL of existing photo (edit mode only) */
    existingPhotoUrl?: string | null;
    onBack: () => void;
    onEditRespondent: () => void;
    onEditQuestions: () => void;
    /** Called with new File in create mode, or File|null in edit mode */
    onSubmit: (photo: File | null) => void;
    /** Only used in create mode */
    onSubmitAndContinue?: (photo: File) => void;
    isSubmitting: boolean;
}

export default function ReviewForm({
    mode = 'create',
    respondentData,
    answers,
    questions,
    gpsLocation,
    existingPhotoUrl,
    onBack,
    onEditRespondent,
    onEditQuestions,
    onSubmit,
    onSubmitAndContinue,
    isSubmitting,
}: ReviewFormProps) {
    const photoHook = usePhotoCapture(mode === 'edit' ? 'photo_edit' : 'photo');

    const validateBeforeSubmit = (): boolean => {
        // In edit mode, photo is optional (can keep existing)
        if (mode === 'create' && !photoHook.photo) {
            alert('Foto bukti wajib diunggah.');
            return false;
        }
        if (mode === 'edit' && !photoHook.photo && !existingPhotoUrl) {
            alert('Foto bukti wajib ada.');
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
        if (mode === 'edit') {
            // In edit mode, pass null to keep existing photo, or File to replace
            onSubmit(photoHook.photo);
        } else {
            // In create mode, photo is always required
            onSubmit(photoHook.photo!);
        }
    };

    const handleSubmitAndContinueClick = () => {
        if (!validateBeforeSubmit()) return;
        onSubmitAndContinue?.(photoHook.photo!);
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
                    title={mode === 'edit' ? 'Review Perubahan' : 'Review & Submit'}
                    subtitle={
                        mode === 'edit'
                            ? 'Periksa kembali semua data sebelum menyimpan'
                            : 'Periksa kembali semua data sebelum mengirim'
                    }
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
                        <p className={`text-sm ${mode === 'edit' ? 'text-amber-600' : 'text-red-500'}`}>
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

                {/* Photo Section */}
                <PhotoCaptureSection
                    hook={photoHook}
                    existingPhotoUrl={mode === 'edit' ? existingPhotoUrl : undefined}
                    required={mode === 'create'}
                />

                <WarningBox
                    title={mode === 'edit' ? 'Menyimpan Perubahan' : 'Pengiriman Bersifat Final'}
                    message={
                        mode === 'edit'
                            ? 'Status submission akan direset ke \'Submitted\' setelah disimpan dan akan menunggu persetujuan ulang.'
                            : 'Pastikan semua data di atas sudah benar. Setelah dikirim, data survei ini akan dikunci dan tidak dapat diubah oleh enumerator.'
                    }
                />
            </div>

            <ReviewFooter
                onBack={onBack}
                onSubmit={handleSubmitClick}
                onSubmitAndContinue={mode === 'create' ? handleSubmitAndContinueClick : undefined}
                isSubmitting={isSubmitting}
                submitLabel={mode === 'edit' ? 'Simpan Perubahan' : undefined}
            />
        </>
    );
}
