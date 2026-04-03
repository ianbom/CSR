/**
 * EditReviewForm — like ReviewForm but for edit mode.
 *
 * Key differences:
 * - Shows the existing photo from the server; user can optionally re-take it.
 * - Single "Simpan Perubahan" button (no submit-and-continue).
 * - Calls `onSubmit(null)` when keeping existing photo,
 *   or `onSubmit(file)` when a new photo was taken.
 */
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
import { GpsLocation } from './ReviewForm';

interface Question {
    id: number;
    category: string | null;
    code: string;
    question_text: string;
    order_no: number;
}

interface EditReviewFormProps {
    respondentData: RespondentData;
    answers: QuestionAnswers;
    questions: Question[];
    gpsLocation: GpsLocation;
    /** URL of the photo already stored in storage — null if none yet */
    existingPhotoUrl: string | null;
    onBack: () => void;
    onEditRespondent: () => void;
    onEditQuestions: () => void;
    /** Called with a new File if the user re-took the photo, or null to keep existing */
    onSubmit: (photo: File | null) => void;
    isSubmitting: boolean;
}

export default function EditReviewForm({
    respondentData,
    answers,
    questions,
    gpsLocation,
    existingPhotoUrl,
    onBack,
    onEditRespondent,
    onEditQuestions,
    onSubmit,
    isSubmitting,
}: EditReviewFormProps) {
    // New photo taken in this session (replaces existing on submit)
    const [newPhoto, setNewPhoto] = useState<File | null>(null);
    const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // ── Camera ──
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
        } catch {
            alert(
                'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.',
            );
        }
    };

    const stopCamera = () => {
        stream?.getTracks().forEach((t) => t.stop());
        setStream(null);
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const isPortrait = vh > vw;
        const ratio = isPortrait ? 3 / 4 : 4 / 3;
        let cw = vw;
        let ch = vh;
        if (vw / vh > ratio) {
            cw = vh * ratio;
        } else {
            ch = vw / ratio;
        }
        const sx = (vw - cw) / 2;
        const sy = (vh - ch) / 2;
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, sx, sy, cw, ch, 0, 0, cw, ch);
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const file = new File(
                            [blob],
                            `photo_edit_${Date.now()}.jpg`,
                            { type: 'image/jpeg' },
                        );
                        setNewPhoto(file);
                        setNewPhotoPreview(URL.createObjectURL(file));
                        setPhotoError(null);
                        stopCamera();
                    }
                },
                'image/jpeg',
                0.8,
            );
        }
    };

    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
        }
    }, [isCameraOpen, stream]);

    useEffect(() => {
        return () => {
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, [stream]);

    // ── Submit ──
    const handleSubmitClick = () => {
        // Require either a new photo or an existing one
        if (!newPhoto && !existingPhotoUrl) {
            setPhotoError('Foto bukti wajib ada.');
            return;
        }
        if (!gpsLocation.latitude || !gpsLocation.longitude) {
            alert('Koordinat GPS belum tersedia.');
            return;
        }
        onSubmit(newPhoto); // null = keep existing
    };

    // ── Helpers ──
    const questionMap = useMemo(() => {
        const map = new Map<number, Question>();
        questions.forEach((q) => map.set(q.id, q));
        return map;
    }, [questions]);

    const typeLabel = (type: string) => {
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

    // Decide which photo to display in preview
    const displayPhotoSrc = newPhotoPreview ?? existingPhotoUrl;

    return (
        <>
            <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-4 py-6 md:px-8 lg:px-0">
                <ReviewProgressBar percentage={100} />

                <ReviewPageHeader
                    title="Review Perubahan"
                    subtitle="Periksa kembali semua data sebelum menyimpan"
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
                        <p className="text-sm text-amber-600">
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
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <MaterialIcon
                            name="photo_camera"
                            className="text-primary"
                        />
                        <h3 className="text-sm font-semibold text-gray-800">
                            Foto Bukti
                        </h3>
                    </div>
                    <p className="text-xs text-gray-500">
                        Foto saat ini ditampilkan di bawah. Anda dapat mengambil
                        foto baru untuk mengganti, atau biarkan tidak berubah.
                    </p>

                    {/* Current / new photo preview */}
                    {displayPhotoSrc && !isCameraOpen && (
                        <div className="flex flex-col gap-3">
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <img
                                    src={displayPhotoSrc}
                                    alt="Foto bukti"
                                    className="aspect-[3/4] w-full object-cover md:aspect-[4/3]"
                                />
                            </div>
                            {newPhoto && (
                                <p className="text-xs font-medium text-emerald-600">
                                    ✓ Foto baru siap digunakan
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={startCamera}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                <MaterialIcon
                                    name="refresh"
                                    className="text-sm"
                                />
                                Ganti Foto
                            </button>
                        </div>
                    )}

                    {/* No photo at all — show open camera button */}
                    {!displayPhotoSrc && !isCameraOpen && (
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

                    {/* Live camera */}
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

                    {photoError && (
                        <p className="text-xs text-red-500">{photoError}</p>
                    )}
                </div>

                <WarningBox
                    title="Menyimpan Perubahan"
                    message="Status submission akan direset ke 'Submitted' setelah disimpan dan akan menunggu persetujuan ulang."
                />
            </div>

            {/* Footer — single save button */}
            <ReviewFooter
                onBack={onBack}
                onSubmit={handleSubmitClick}
                isSubmitting={isSubmitting}
                submitLabel="Simpan Perubahan"
            />
        </>
    );
}
