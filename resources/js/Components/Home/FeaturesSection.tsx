import { BentoCard, BentoGrid } from '@/Components/ui/bento-grid';
import { Users, Leaf, TrendingUp, Database } from 'lucide-react';

const features = [
    {
        Icon: Users,
        name: 'Survey Indeks Kepuasan Masyarakat (IKM)',
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
    // {
    //     Icon: Database,
    //     name: 'Manajemen Data Terpusat',
    //     description:
    //         'Kelola ratusan surveyor lapangan, validasi respons, dan analisis hasil survei dalam satu tempat yang aman dan skalabel.',
    //     href: '/',
    //     cta: 'Pelajari lebih lanjut',
    //     className: 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-3',
    //     background: (
    //         <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-blue-50/50 to-transparent" />
    //     ),
    // },
];

export default function FeaturesSection() {
    return (
        <div
            id="features-section"
            className="relative bg-gray-50 py-24 dark:bg-gray-950 sm:py-32"
        >
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
                        <BentoCard key={feature.name} {...feature} />
                    ))}
                </BentoGrid>
            </div>
        </div>
    );
}
