/**
 * PhotoCaptureSection — reusable photo UI used in ReviewForm (both create and edit modes).
 *
 * Features:
 *  - Open camera (rear / front) with a flip button
 *  - Pick from gallery via file input
 *  - Preview, retake / replace
 */
import { MaterialIcon } from '@/Components/Enumerator';
import type { UsePhotoCaptureReturn } from './usePhotoCapture';

interface PhotoCaptureSectionProps {
    hook: UsePhotoCaptureReturn;
    /** When truthy, this URL is shown as a fallback (edit-mode existing photo) */
    existingPhotoUrl?: string | null;
    required?: boolean;
}

export default function PhotoCaptureSection({
    hook,
    existingPhotoUrl,
    required = false,
}: PhotoCaptureSectionProps) {
    const {
        photo,
        photoPreview,
        photoError,
        isCameraOpen,
        facingMode,
        videoRef,
        fileInputRef,
        startCamera,
        stopCamera,
        capturePhoto,
        flipCamera,
        openGallery,
        handleGalleryChange,
        resetPhoto,
    } = hook;

    // What to show in the static preview area
    const displaySrc = photoPreview ?? existingPhotoUrl ?? null;

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            {/* ── Header ── */}
            <div className="flex items-center gap-2">
                <MaterialIcon name="photo_camera" className="text-primary" />
                <h3 className="text-sm font-semibold text-gray-800">
                    Foto Bukti{' '}
                    {required && <span className="text-red-500">*</span>}
                </h3>
            </div>
            <p className="text-xs text-gray-500">
                {existingPhotoUrl
                    ? 'Foto saat ini ditampilkan. Anda dapat mengganti dengan kamera atau galeri.'
                    : 'Upload foto selfie enumerator bersama responden. Maks 5MB (JPG/PNG/WebP).'}
            </p>

            {/* Hidden gallery input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleGalleryChange}
            />

            {/* ── Static preview (no camera open) ── */}
            {displaySrc && !isCameraOpen && (
                <div className="flex flex-col gap-3">
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <img
                            src={displaySrc}
                            alt="Foto bukti"
                            className="aspect-[3/4] w-full object-cover md:aspect-[4/3]"
                        />
                    </div>
                    {photo && existingPhotoUrl && (
                        <p className="text-xs font-medium text-emerald-600">
                            ✓ Foto baru siap digunakan
                        </p>
                    )}

                    {/* Replace / re-take row */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={startCamera}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <MaterialIcon name="photo_camera" className="text-sm" />
                            Kamera
                        </button>
                        <button
                            type="button"
                            onClick={openGallery}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <MaterialIcon name="photo_library" className="text-sm" />
                            Galeri
                        </button>
                        {photo && (
                            <button
                                type="button"
                                onClick={resetPhoto}
                                className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-100"
                            >
                                <MaterialIcon name="delete" className="text-sm" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── No photo yet — action buttons ── */}
            {!displaySrc && !isCameraOpen && (
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={startCamera}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-sm transition-colors ${
                            photoError
                                ? 'border-red-300 bg-red-50 text-red-600'
                                : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-primary hover:bg-primary/5'
                        }`}
                    >
                        <MaterialIcon name="photo_camera" className="text-xl" />
                        <span>Buka Kamera</span>
                    </button>
                    <button
                        type="button"
                        onClick={openGallery}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        <MaterialIcon name="photo_library" className="text-sm" />
                        Pilih dari Galeri
                    </button>
                </div>
            )}

            {/* ── Live camera view ── */}
            {isCameraOpen && (
                <div className="flex flex-col gap-0 overflow-hidden rounded-lg border border-gray-200 bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="aspect-[3/4] w-full object-cover md:aspect-[4/3]"
                    />
                    <div className="flex items-center justify-between bg-gray-900 p-3">
                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={stopCamera}
                            className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                        >
                            <MaterialIcon name="close" className="text-sm" />
                            Batal
                        </button>

                        {/* Capture */}
                        <button
                            type="button"
                            onClick={capturePhoto}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 active:scale-95"
                            title="Ambil Foto"
                        >
                            <MaterialIcon
                                name="photo_camera"
                                className="text-xl text-gray-900"
                            />
                        </button>

                        {/* Flip camera — also allow switching to gallery */}
                        <div className="flex gap-1">
                            <button
                                type="button"
                                onClick={flipCamera}
                                className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600"
                                title={
                                    facingMode === 'environment'
                                        ? 'Kamera depan'
                                        : 'Kamera belakang'
                                }
                            >
                                <MaterialIcon
                                    name="flip_camera_ios"
                                    className="text-base"
                                />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    stopCamera();
                                    openGallery();
                                }}
                                className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600"
                                title="Galeri"
                            >
                                <MaterialIcon
                                    name="photo_library"
                                    className="text-base"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {photoError && (
                <p className="text-xs text-red-500">{photoError}</p>
            )}
        </div>
    );
}
