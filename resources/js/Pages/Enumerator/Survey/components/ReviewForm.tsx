import {
    DemographicItem,
    MaterialIcon,
    RespondentProfileCard,
    ReviewFooter,
    ReviewItem,
    ReviewPageHeader,
    ReviewProgressBar,
    ReviewSection,
    VerifiedBadge,
    WarningBox,
} from '@/Components/Enumerator';
import React, { useMemo, useState } from 'react';
import { QuestionAnswers } from './QuestionForm';
import { RespondentData } from './RespondentForm';

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
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setPhotoError('Ukuran foto maksimal 5MB.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            setPhotoError('File harus berupa gambar.');
            return;
        }

        setPhotoError(null);
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const validateBeforeSubmit = (): boolean => {
        if (!photo) {
            setPhotoError('Foto bukti wajib diunggah.');
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
        onSubmit(photo!);
    };

    const handleSubmitAndContinueClick = () => {
        if (!validateBeforeSubmit()) return;
        onSubmitAndContinue(photo!);
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

                <RespondentProfileCard
                    name={respondentData.name || 'Nama Responden'}
                    id="-"
                    location={respondentData.address || '-'}
                    interviewDate={new Date().toLocaleString('id-ID', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                    imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBwwE0BERxEh3AgbHPydoIU4mxdCB6AQRWX26RjdPXTI3LxWNcq8MTe_BGYEzUmCqmxUbyrw4TS2kHXudo3Of-RcyQoWSCpHl2W4_5tDooAWZNejW4m40E0BNW2_-Hdeh3CwSCUeQpc8SEBzCQIGtzM0qUP9JZ79IbqwsJ_AWVgy9TI9iYowKPOL5-H-xm-METe4xkA2QQbvF31SH6e7Ein_nFBr629oCG3w-Z24j1z-wgAaCQps8BuKNR_WUKx5fwmZ51HAK5IJfQ"
                    onEdit={onEditRespondent}
                />

                {/* Data Responden */}
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
                        label="Pendidikan"
                        value={respondentData.education_level || '-'}
                        onEdit={onEditRespondent}
                    />
                </ReviewSection>

                {/* Pekerjaan & Ekonomi */}
                <ReviewSection title="Pekerjaan & Ekonomi" icon="payments">
                    <ReviewItem
                        label="Pekerjaan Utama"
                        value={respondentData.main_occupation || '-'}
                        badge={
                            respondentData.main_occupation ? (
                                <VerifiedBadge />
                            ) : undefined
                        }
                        onEdit={onEditRespondent}
                    />
                    <ReviewItem
                        label="Pendapatan per Bulan"
                        value={
                            respondentData.monthly_income
                                ? `Rp ${parseInt(respondentData.monthly_income).toLocaleString('id-ID')}`
                                : '-'
                        }
                        onEdit={onEditRespondent}
                    />
                    <ReviewItem
                        label="Alamat"
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
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <MaterialIcon
                            name="photo_camera"
                            className="text-primary"
                        />
                        <h3 className="text-sm font-semibold text-gray-800">
                            Foto Bukti <span className="text-red-500">*</span>
                        </h3>
                    </div>
                    <p className="text-xs text-gray-500">
                        Upload foto selfie enumerator bersama responden. Maks
                        5MB (JPG/PNG/WebP).
                    </p>

                    {photoPreview && (
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <img
                                src={photoPreview}
                                alt="Preview foto bukti"
                                className="h-48 w-full object-cover"
                            />
                        </div>
                    )}

                    <label
                        htmlFor="photo-upload"
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-sm transition-colors ${
                            photo
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-primary hover:bg-primary/5'
                        }`}
                    >
                        <MaterialIcon
                            name={photo ? 'check_circle' : 'upload'}
                            className="text-lg"
                        />
                        <span>
                            {photo ? photo.name : 'Klik untuk upload foto'}
                        </span>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </label>

                    {photoError && (
                        <p className="text-xs text-red-500">{photoError}</p>
                    )}
                </div>

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
