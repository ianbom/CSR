import { ReactNode } from 'react';

interface FooterProps {
    companyName?: string;
    year?: number;
}

export default function Footer({
    companyName = 'ImpactSaaS Platform',
    year = new Date().getFullYear(),
}: FooterProps): ReactNode {
    return (
        <footer className="flex items-center justify-between border-t border-slate-200 p-8 text-slate-500">
            <p className="text-xs">
                © {year} {companyName}. All rights reserved.
            </p>
            <div className="flex gap-6">
                <a
                    href="#"
                    className="text-xs transition-colors hover:text-primary"
                >
                    Privacy Policy
                </a>
                <a
                    href="#"
                    className="text-xs transition-colors hover:text-primary"
                >
                    Documentation
                </a>
                <a
                    href="#"
                    className="text-xs transition-colors hover:text-primary"
                >
                    Support
                </a>
            </div>
        </footer>
    );
}
