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
import { useEffect, useMemo, useRef, useState } from 'react';
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

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    aspectRatio: { ideal: 4 / 3 },
                },
                audio: false,
            });
            setStream(mediaStream);
            setIsCameraOpen(true);
            // Attachment ke videoRef dilakukan di useEffect setelah render
        } catch (err) {
            alert(
                'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser/OS Anda.',
            );
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');

        // Menentukan rasio 4:3 atau 3:4 tergantung orientasi kamera
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const isPortrait = videoHeight > videoWidth;
        const targetRatio = isPortrait ? 3 / 4 : 4 / 3;

        let cropWidth = videoWidth;
        let cropHeight = videoHeight;

        if (videoWidth / videoHeight > targetRatio) {
            // Video lebih lebar proporsinya dibanding target, potong kiri & kanan
            cropWidth = videoHeight * targetRatio;
        } else {
            // Video lebih tinggi proporsinya dibanding target, potong atas & bawah
            cropHeight = videoWidth / targetRatio;
        }

        const startX = (videoWidth - cropWidth) / 2;
        const startY = (videoHeight - cropHeight) / 2;

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(
                video,
                startX,
                startY,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight,
            );
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const file = new File(
                            [blob],
                            `photo_${Date.now()}.jpg`,
                            { type: 'image/jpeg' },
                        );
                        setPhoto(file);
                        setPhotoPreview(URL.createObjectURL(file));
                        setPhotoError(null);
                        stopCamera();
                    }
                },
                'image/jpeg',
                0.8,
            );
        }
    };

    // Attach stream ke video element setelah elemen muncul di DOM
    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
        }
    }, [isCameraOpen, stream]);

    // Bersihkan stream jika komponen di-unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

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

                    {!photoPreview && !isCameraOpen && (
                        <button
                            type="button"
                            onClick={startCamera}
                            className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-sm transition-colors ${
                                photoError
                                    ? 'border-red-300 bg-red-50 text-red-600'
                                    : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-primary hover:bg-primary/5'
                            }`}
                        >
                            <MaterialIcon
                                name="photo_camera"
                                className="text-xl"
                            />
                            <span>Buka Kamera untuk Mengambil Foto</span>
                        </button>
                    )}

                    {isCameraOpen && (
                        <div className="flex flex-col gap-3 overflow-hidden rounded-lg border border-gray-200 bg-black">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="aspect-[3/4] w-full object-cover md:aspect-[4/3]"
                            />
                            <div className="flex items-center justify-between p-3">
                                <button
                                    type="button"
                                    onClick={stopCamera}
                                    className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                >
                                    <MaterialIcon
                                        name="close"
                                        className="text-sm"
                                    />
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                                >
                                    <MaterialIcon
                                        name="camera"
                                        className="text-sm"
                                    />
                                    Ambil Foto
                                </button>
                            </div>
                        </div>
                    )}

                    {photoPreview && !isCameraOpen && (
                        <div className="flex flex-col gap-3">
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <img
                                    src={photoPreview}
                                    alt="Preview foto bukti"
                                    className="aspect-[3/4] w-full object-cover md:aspect-[4/3]"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setPhoto(null);
                                    setPhotoPreview(null);
                                    startCamera();
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                <MaterialIcon
                                    name="refresh"
                                    className="text-sm"
                                />
                                Foto Ulang
                            </button>
                        </div>
                    )}

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
