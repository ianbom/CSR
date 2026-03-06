import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { Button } from '@/components/ui/button';
import { Marquee } from '@/components/ui/marquee';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Database, Leaf, LogIn, TrendingUp, Users } from 'lucide-react';

const features = [
    {
        Icon: Users,
        name: 'Survey Indeks Kepuasan Masyarakat',
        description:
            'Ukur kepuasan masyarakat terhadap program CSR Anda secara real-time dan komprehensif.',
        href: '/',
        cta: 'Pelajari lebih lanjut',
        className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
        background: (
            <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-blue-50/50 to-transparent" />
        ),
    },
    {
        Icon: Leaf,
        name: 'Social Return on Investment (SROI)',
        description:
            'Evaluasi dampak sosial dan lingkungan dari program CSR Anda dengan metodologi SROI yang terstruktur.',
        href: '/',
        cta: 'Pelajari lebih lanjut',
        className: 'lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2',
        background: <div />,
    },
    {
        Icon: TrendingUp,
        name: 'Social License to Operate Index (SLOI)',
        description:
            'Ukur tingkat penerimaan masyarakat terhadap operasional perusahaan Anda.',
        href: '/',
        cta: 'Pelajari lebih lanjut',
        className: 'lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3',
        background: <div />,
    },
    {
        Icon: Database,
        name: 'Manajemen Data Terpusat',
        description:
            'Kelola ratusan surveyor lapangan, validasi respons, dan analisis hasil survei dalam satu tempat yang aman dan skalabel.',
        href: '/',
        cta: 'Pelajari lebih lanjut',
        className: 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-3',
        background: (
            <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-blue-50/50 to-transparent" />
        ),
    },
];

const reviews = [
    {
        name: 'Pertamina',
        username: '@pertamina',
        body: 'Aplikasi ini sangat membantu kami dalam mengelola program CSR di seluruh pelosok negeri. Laporannya sangat detail.',
        img: 'https://avatar.vercel.sh/pertamina',
    },
    {
        name: 'PLN',
        username: '@pln_id',
        body: 'Pengukuran IKM dan SROI jadi lebih mudah dan terstruktur. Tim kami sangat terbantu dengan platform ini.',
        img: 'https://avatar.vercel.sh/pln',
    },
    {
        name: 'Telkom Indonesia',
        username: '@telkom',
        body: 'Fitur manajemen enumerator yang luar biasa. Sangat efisien untuk mengumpulkan data dari ratusan responden.',
        img: 'https://avatar.vercel.sh/telkom',
    },
    {
        name: 'Bank Mandiri',
        username: '@bankmandiri',
        body: 'Platform terbaik untuk mengelola dan memonitor dampak program tanggung jawab sosial perusahaan kami.',
        img: 'https://avatar.vercel.sh/mandiri',
    },
    {
        name: 'MIND ID',
        username: '@mind_id',
        body: 'Visualisasi data yang diberikan sangat memudahkan kami dalam mengambil keputusan strategis terkait CSR.',
        img: 'https://avatar.vercel.sh/mind_id',
    },
];

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure className="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-4 hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]">
            <div className="flex flex-row items-center gap-2">
                <img
                    className="rounded-full"
                    width="32"
                    height="32"
                    alt=""
                    src={img}
                />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">
                        {username}
                    </p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="CSR & ESG Management Platform" />
            <div className="relative flex min-h-screen flex-col overflow-hidden bg-background font-sans">
                {/* Navigation */}
                <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-md">
                    <div className="relative mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-green-500 shadow-lg shadow-green-500/20">
                                <Leaf className="size-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                                SocialImpact.id
                            </span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button
                                        variant="default"
                                        className="rounded-full"
                                    >
                                        Pergi ke Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button
                                            variant="ghost"
                                            className="hidden rounded-full text-white hover:bg-white/20 hover:text-white sm:flex"
                                        >
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button
                                            variant="default"
                                            className="gap-2 rounded-full"
                                        >
                                            <span>Mulai Sekarang</span>
                                            <LogIn className="size-4" />
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Hero Section */}
                    <div className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden pt-20">
                        {/* Video Background */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 z-0 h-full w-full object-cover"
                        >
                            <source src="/img/animation.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"></div>

                        <div className="relative z-10 mt-[-5vh] w-full max-w-7xl px-6 text-center">
                            {/* <div className="mb-8 flex justify-center">
                                <div className="z-10 flex items-center justify-center">
                                    <div className="group rounded-full border border-white/20 bg-white/10 text-base text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all ease-in hover:cursor-pointer hover:bg-white/20">
                                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 text-sm text-white/90 transition ease-out hover:text-white">
                                            ✨ Platform Evaluasi Program CSR #1
                                            di Indonesia
                                        </AnimatedShinyText>
                                    </div>
                                </div>
                            </div> */}

                            <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-xl sm:text-7xl">
                                Evaluasi Dampak Sosial{' '}
                                <br className="hidden sm:block" />
                                <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                                    Secara Terukur & Profesional
                                </span>
                            </h1>

                            {/* <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-200 drop-shadow-md">
                                Tingkatkan efektivitas program CSR Anda dengan
                                platform manajemen evaluasi komprehensif. Hitung
                                IKM, SLOI, dan SROI dalam satu dashboard
                                canggih.
                            </p> */}

                            <div className="mt-10 flex items-center justify-center gap-4">
                                <Link href={route('register')}>
                                    <ShimmerButton className="shadow-2xl">
                                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                            Coba Gratis Sekarang
                                        </span>
                                    </ShimmerButton>
                                </Link>
                                <Link href={route('login')}>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="hidden h-12 rounded-full px-8 sm:flex"
                                    >
                                        Pelajari Fitur
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Features Section - Bento Grid */}
                    <div className="relative bg-gray-50 py-24 dark:bg-gray-950 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto mb-16 max-w-2xl text-center">
                                <h2 className="text-base font-semibold leading-7 text-green-600">
                                    Semua Fitur yang Anda Butuhkan
                                </h2>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                    Solusi Lengkap Evaluasi CSR
                                </p>
                            </div>

                            <BentoGrid className="lg:grid-cols-3 lg:grid-rows-2">
                                {features.map((feature) => (
                                    <BentoCard
                                        key={feature.name}
                                        {...feature}
                                    />
                                ))}
                            </BentoGrid>
                        </div>
                    </div>

                    {/* Review Section - Marquee */}
                    <div className="relative overflow-hidden py-24">
                        <div className="mx-auto mb-16 max-w-2xl px-6 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                Dipercaya oleh Perusahaan Terkemuka
                            </h2>
                        </div>

                        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                            <Marquee pauseOnHover className="[--duration:20s]">
                                {reviews.map((review) => (
                                    <ReviewCard
                                        key={review.username}
                                        {...review}
                                    />
                                ))}
                            </Marquee>
                            <Marquee
                                reverse
                                pauseOnHover
                                className="[--duration:20s]"
                            >
                                {reviews
                                    .slice()
                                    .reverse()
                                    .map((review) => (
                                        <ReviewCard
                                            key={review.username}
                                            {...review}
                                        />
                                    ))}
                            </Marquee>
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background dark:from-background"></div>
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background dark:from-background"></div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="relative isolate flex flex-col items-center justify-center overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
                        {/* Video Background */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 -z-20 h-full w-full object-cover"
                        >
                            <source
                                src="/img/aurora-animation.mp4"
                                type="video/mp4"
                            />
                        </video>
                        <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm"></div>

                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl">
                                Siap Meningkatkan Dampak CSR Anda?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-200 drop-shadow-md">
                                Bergabunglah dengan ratusan perusahaan lain yang
                                sudah menggunakan platform kami untuk mengukur
                                dan melaporkan program CSR mereka.
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
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                        <div className="flex justify-center space-x-6 md:order-2">
                            <span className="cursor-pointer text-gray-400 hover:text-gray-500">
                                Syarat & Ketentuan
                            </span>
                            <span className="cursor-pointer text-gray-400 hover:text-gray-500">
                                Kebijakan Privasi
                            </span>
                            <span className="cursor-pointer text-gray-400 hover:text-gray-500">
                                Bantuan
                            </span>
                        </div>
                        <div className="mt-8 flex items-center justify-center gap-2 md:order-1 md:mt-0">
                            <div className="flex size-6 items-center justify-center rounded-md bg-green-600">
                                <Leaf className="size-3 text-white" />
                            </div>
                            <p className="text-center text-xs leading-5 text-gray-500">
                                &copy; {new Date().getFullYear()}{' '}
                                SocialImpact.id. Hak cipta dilindungi
                                undang-undang.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
