export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role?: string;
    company_id?: number;
    position?: string;
    phone?: string;
    is_active?: boolean;
}

export interface Company {
    id: number;
    name: string;
    legal_name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
