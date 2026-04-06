import { useCallback, useEffect, useRef, useState } from 'react';

type FacingMode = 'environment' | 'user';

export interface UsePhotoCaptureReturn {
    photo: File | null;
    photoPreview: string | null;
    photoError: string | null;
    isCameraOpen: boolean;
    facingMode: FacingMode;
    videoRef: React.RefObject<HTMLVideoElement>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    startCamera: () => Promise<void>;
    stopCamera: () => void;
    capturePhoto: () => void;
    flipCamera: () => Promise<void>;
    openGallery: () => void;
    handleGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resetPhoto: () => void;
    clearError: () => void;
    setExternalPhoto: (file: File, preview: string) => void;
}

export function usePhotoCapture(filenamePrefix = 'photo'): UsePhotoCaptureReturn {
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [facingMode, setFacingMode] = useState<FacingMode>('environment');
    const [stream, setStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stopStream = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
        }
    }, [stream]);

    const startCamera = useCallback(
        async (mode: FacingMode = facingMode) => {
            try {
                stopStream();
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: mode, aspectRatio: { ideal: 4 / 3 } },
                    audio: false,
                });
                setStream(mediaStream);
                setFacingMode(mode);
                setIsCameraOpen(true);
            } catch {
                alert(
                    'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.',
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [facingMode],
    );

    const stopCamera = useCallback(() => {
        stopStream();
        setStream(null);
        setIsCameraOpen(false);
    }, [stopStream]);

    const flipCamera = useCallback(async () => {
        const newMode: FacingMode =
            facingMode === 'environment' ? 'user' : 'environment';
        await startCamera(newMode);
    }, [facingMode, startCamera]);

    const capturePhoto = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

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
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const sx = (vw - cw) / 2;
        const sy = (vh - ch) / 2;
        ctx.drawImage(video, sx, sy, cw, ch, 0, 0, cw, ch);
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const file = new File(
                        [blob],
                        `${filenamePrefix}_${Date.now()}.jpg`,
                        { type: 'image/jpeg' },
                    );
                    setPhoto(file);
                    setPhotoPreview(URL.createObjectURL(file));
                    setPhotoError(null);
                    stopCamera();
                }
            },
            'image/jpeg',
            0.85,
        );
    }, [filenamePrefix, stopCamera]);

    const openGallery = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleGalleryChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate size (max 5MB) and type
            if (file.size > 5 * 1024 * 1024) {
                setPhotoError('Ukuran file terlalu besar. Maksimum 5MB.');
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setPhotoError('Format file tidak didukung. Gunakan JPG/PNG/WebP.');
                return;
            }

            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
            setPhotoError(null);
            // Reset input so same file can be re-selected
            e.target.value = '';
        },
        [],
    );

    const resetPhoto = useCallback(() => {
        setPhoto(null);
        setPhotoPreview(null);
        setPhotoError(null);
    }, []);

    const clearError = useCallback(() => {
        setPhotoError(null);
    }, []);

    const setExternalPhoto = useCallback((file: File, preview: string) => {
        setPhoto(file);
        setPhotoPreview(preview);
        setPhotoError(null);
    }, []);

    // Attach stream to video element after it mounts in the DOM
    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
        }
    }, [isCameraOpen, stream]);

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            stream?.getTracks().forEach((t) => t.stop());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream]);

    return {
        photo,
        photoPreview,
        photoError,
        isCameraOpen,
        facingMode,
        videoRef,
        fileInputRef,
        startCamera: () => startCamera(facingMode),
        stopCamera,
        capturePhoto,
        flipCamera,
        openGallery,
        handleGalleryChange,
        resetPhoto,
        clearError,
        setExternalPhoto,
    };
}
