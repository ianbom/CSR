import HeroSection from '@/Components/Home/HeroSection';
import { Button } from '@/Components/ui/button';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { LogIn, Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

// Lazy load komponen yang berada di bawah layar pertama (below the fold)
const WhyChooseUsSection = React.lazy(() => import('@/Components/Home/WhyChooseUsSection'));
const FeaturesSection = React.lazy(() => import('@/Components/Home/FeaturesSection'));
const LogoGrid = React.lazy(() => import('@/Components/LogoGrid'));
const CtaSection = React.lazy(() => import('@/Components/Home/CtaSection'));
const FooterSection = React.lazy(() => import('@/Components/Home/FooterSection'));

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
                            <img
                                src="/img/LogoHeader.png"
                                alt="Impact Report Manajemen Apps"
                                className="h-10 w-auto"
                            />
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button
                                        variant="default"
                                        className="rounded-full text-white"
                                    >
                                        Dashboard
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
                                            <span className="text-white">
                                                Daftar Sekarang
                                            </span>
                                            <LogIn className="size-4 text-white" />
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <HeroSection />
                    <Suspense fallback={<div className="flex h-32 w-full items-center justify-center"><Loader2 className="size-8 animate-spin text-green-500" /></div>}>
                        <WhyChooseUsSection />
                        <FeaturesSection />
                        <LogoGrid />
                        <CtaSection />
                    </Suspense>
                </main>

                <Suspense fallback={null}>
                    <FooterSection />
                </Suspense>
            </div>
        </>
    );
}
