import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';
import { Leaf } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen w-full bg-white font-sans dark:bg-zinc-950">
            {/* Left side: Form */}
            <div className="lg:wflex-none flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    {/* Logo Mobile */}
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-green-600">
                            <Leaf className="size-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            SocialImpact.id
                        </span>
                    </div>

                    <div className="w-full">{children}</div>

                    {/* Footer / Copyright */}
                    <div className="mt-12 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} SocialImpact.id. All
                        rights reserved.
                    </div>
                </div>
            </div>

            {/* Right side: Visual Showcase */}
            <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-zinc-950 lg:flex">
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <DotPattern
                        className={cn(
                            '[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]',
                            'inset-0 h-full w-full text-green-500/40',
                        )}
                        cr={2}
                        cx={2}
                        cy={2}
                        glow={true}
                    />
                </div>

                <div className="relative z-10 flex w-full max-w-lg flex-col items-start justify-center p-12">
                    <div className="mb-8 inline-flex items-center rounded-full border border-zinc-800 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-md">
                        <span className="mr-2 flex size-2 animate-pulse rounded-full bg-green-500"></span>
                        Sistem Manajemen CSR Terpadu
                    </div>

                    <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl lg:leading-[1.1]">
                        Ukur Dampak Nyata <br />
                        <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                            Secara Profesional
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                        Platform evaluasi komprehensif untuk pelaporan Indeks
                        Kepuasan Masyarakat (IKM), Social License to Operate
                        (SLOI), dan Social Return on Investment (SROI)
                        perusahaan Anda.
                    </p>

                    <div className="mt-12 flex items-center gap-4">
                        <div className="flex -space-x-3">
                            <img
                                className="inline-block size-10 rounded-full object-cover ring-2 ring-zinc-950"
                                src="https://avatar.vercel.sh/pertamina"
                                alt="User"
                            />
                            <img
                                className="inline-block size-10 rounded-full object-cover ring-2 ring-zinc-950"
                                src="https://avatar.vercel.sh/pln"
                                alt="User"
                            />
                            <img
                                className="inline-block size-10 rounded-full object-cover ring-2 ring-zinc-950"
                                src="https://avatar.vercel.sh/telkom"
                                alt="User"
                            />
                            <div className="flex size-10 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-white ring-2 ring-zinc-950">
                                +99
                            </div>
                        </div>
                        <p className="text-sm font-medium text-zinc-300">
                            Dipercaya{' '}
                            <span className="font-bold text-green-400">
                                100+
                            </span>{' '}
                            perusahaan
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
