import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

interface Feature {
    title: string;
    description: string;
    tags?: string[];
    image: string;
    href: string;
    featured?: boolean;
}

const features: Feature[] = [
    {
        title: 'IKM Survey',
        description:
            'Ukur kepuasan masyarakat terhadap program Keberlanjutan secara real-time dan komprehensif.',
        tags: ['Kepuasan Masyarakat', 'Keberlanjutan Survey'],
        image: '/img/feature_ikm.png',
        href: '#features-section',
        featured: true,
    },
    {
        title: 'Indeks SLOI',
        description:
            'Pantau tingkat penerimaan masyarakat terhadap operasional perusahaan Anda.',
        image: '/img/feature_sloi.png',
        href: '#features-section',
    },
    {
        title: 'Laporan Keberlanjutan',
        description:
            'Buat laporan dampak Keberlanjutan yang terstruktur dan siap untuk stakeholder perusahaan.',
        image: '/img/feature_laporan.png',
        href: '#features-section',
    },
     {
        title: 'Analisis SROI',
        description:
            'Evaluasi dampak sosial dan lingkungan dengan metodologi Social Return on Investment (Coming Soon).',
        image: '/img/feature_sroi.png',
        href: '#features-section',
    },
];

function FeatureCard({ feature }: { feature: Feature }) {
    return (
        <div
            className={`feature-card group relative flex-shrink-0 overflow-hidden rounded-3xl ${
                feature.featured ? 'w-72 sm:w-80' : 'w-56 sm:w-64'
            }`}
            style={{ height: '520px' }}
        >
            {/* Background Image */}
            <img
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)',
                }}
            />

            {/* Top bar */}
            <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                {/* Tags — only shown on featured card */}
                {feature.tags && (
                    <div className="flex flex-col gap-2">
                        {feature.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
                            >
                                <span className="size-1.5 rounded-full bg-yellow-400" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Arrow button */}
                <a
                    href={feature.href}
                    className="ml-auto flex size-10 flex-shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-900 shadow-md transition-all duration-300 hover:bg-white hover:shadow-lg group-hover:rotate-12"
                >
                    <ArrowUpRight className="size-4" strokeWidth={2.5} />
                </a>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                    className="mb-2 font-serif text-3xl font-bold leading-tight text-white"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                >
                    {feature.title.split(' ').map((word, i) => (
                        <span key={i} className="block">
                            {word}
                        </span>
                    ))}
                </h3>
                <p className="mb-4 text-xs leading-relaxed text-white/80">
                    {feature.description}
                </p>

                {/* CTA Button */}
                <a
                    href={feature.href}
                    className="group/btn flex w-full items-center justify-between rounded-2xl bg-white/95 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white"
                >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                        Jelajahi Fitur
                    </span>
                    <svg
                        className="size-4 text-gray-900 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default function FeaturesSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section
            id="features-section"
            className="relative overflow-hidden bg-[#f7f7f5] py-20 sm:py-28"
        >
            {/* Section header */}
            <div className="mx-auto mb-12 max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="mb-3 inline-block rounded-full bg-green-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
                            Fitur Utama
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Solusi Lengkap
                            <br />
                            <span className="text-green-600">Evaluasi Keberlanjutan</span>
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-gray-500 sm:text-right">
                        Semua alat yang Anda butuhkan untuk mengukur dan
                        melaporkan dampak sosial perusahaan.
                    </p>
                </div>
            </div>

            {/* Cards horizontal scroll */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto px-6 pb-4 lg:px-8"
                style={{
                    scrollSnapType: 'x mandatory',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
            >
                {/* Left padding sentinel for max-width centering */}
                <div className="flex-shrink-0 lg:w-[calc((100vw-80rem)/2)]" />

                {features.map((feature) => (
                    <div
                        key={feature.title}
                        style={{ scrollSnapAlign: 'start' }}
                    >
                        <FeatureCard feature={feature} />
                    </div>
                ))}

                {/* Right padding sentinel */}
                <div className="flex-shrink-0 lg:w-[calc((100vw-80rem)/2)]" />
            </div>

            {/* Scroll indicator dots */}
            {/* <div className="mt-8 flex justify-center gap-2">
                {features.map((f, i) => (
                    <button
                        key={f.title}
                        onClick={() => {
                            const cards =
                                scrollRef.current?.querySelectorAll(
                                    '[style*="scroll-snap-align"]',
                                );
                            cards?.[i]?.scrollIntoView({
                                behavior: 'smooth',
                                inline: 'start',
                                block: 'nearest',
                            });
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === 0
                                ? 'w-6 bg-gray-900'
                                : 'w-1.5 bg-gray-300 hover:bg-gray-500'
                        }`}
                        aria-label={`Go to ${f.title}`}
                    />
                ))}
            </div> */}

            {/* Scrollbar hide for webkit */}
            <style>{`
                #features-section [style*="scroll-snap-type"]::-webkit-scrollbar {
                    display: none;
                }
                .feature-card {
                    will-change: transform;
                }
            `}</style>
        </section>
    );
}
