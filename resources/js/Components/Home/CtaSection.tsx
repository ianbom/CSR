import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

export default function CtaSection() {
    return (
        <div className="relative isolate mt-40 flex flex-col items-center justify-center overflow-hidden px-6 py-32 sm:py-40 lg:px-8">
            {/* Video Background */}
            <img
                src="/img/Banner 2.jpg"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm"></div>

            <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl">
                    Siap Mengukur Dampak Program Keberlanjutan Anda?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-200 drop-shadow-md">
                    Bergabunglah dengan perusahaan lain yang sudah menggunakan
                    platform kami untuk mengukur dan melaporkan program
                    keberlanjutan mereka.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link href={route('register')}>
                        <Button
                            size="lg"
                            className="rounded-full bg-white text-green-900 shadow-lg hover:bg-gray-100"
                        >
                            Mulai Sekarang - Gratis
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
