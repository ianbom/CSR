import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';

// Similar to User interface but omit some properties
export interface UserFormValues {
    name: string;
    email: string;
    password?: string;
    role: string;
    company_id: string | number;
    position: string;
    phone: string;
    is_active: boolean;
}

interface Company {
    id: number;
    name: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    companies: Company[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any | null; // Pass user data to edit, or null to create
}

export default function ModalUserForm({
    show,
    onClose,
    companies,
    user,
}: Props) {
    const isEdit = !!user;

    const {
        data,
        setData,
        post,
        patch,
        transform,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<UserFormValues>({
        name: '',
        email: '',
        password: '',
        role: 'company',
        company_id: '',
        position: '',
        phone: '',
        is_active: true,
    });

    useEffect(() => {
        if (show) {
            if (isEdit && user) {
                setData({
                    name: user.name ?? '',
                    email: user.email ?? '',
                    password: '',
                    role: user.role ?? 'company',
                    company_id: user.company_id ?? '',
                    position: user.position ?? '',
                    phone: user.phone ?? '',
                    is_active: user.is_active ?? true,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [show, isEdit, user]);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (isEdit && user) {
            transform((currentData) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dirty: any = {};

                // Jika superadmin/admin maka set company_id dan position kosong
                const isAdmin =
                    currentData.role === 'superadmin' ||
                    currentData.role === 'admin';
                const finalCompanyId = isAdmin ? '' : currentData.company_id;
                const finalPosition = isAdmin ? '' : currentData.position;

                if (currentData.name !== user.name)
                    dirty.name = currentData.name;
                if (currentData.email !== user.email)
                    dirty.email = currentData.email;
                if (currentData.password) dirty.password = currentData.password;
                if (currentData.role !== user.role)
                    dirty.role = currentData.role;

                if (
                    String(finalCompanyId || '') !==
                    String(user.company_id || '')
                ) {
                    dirty.company_id = finalCompanyId;
                }
                if ((finalPosition || '') !== (user.position || ''))
                    dirty.position = finalPosition;
                if ((currentData.phone || '') !== (user.phone || ''))
                    dirty.phone = currentData.phone;
                if (currentData.is_active !== user.is_active)
                    dirty.is_active = currentData.is_active;

                return dirty as UserFormValues;
            });

            patch(route('users.update', user.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            transform((currentData) => {
                const isAdmin =
                    currentData.role === 'superadmin' ||
                    currentData.role === 'admin';
                return {
                    ...currentData,
                    company_id: isAdmin ? '' : currentData.company_id,
                    position: isAdmin ? '' : currentData.position,
                };
            });
            post(route('users.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-slate-900">
                    {isEdit ? 'Ubah Profil Pengguna' : 'Tambah Pengguna Baru'}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    Silakan isi form di bawah ini untuk{' '}
                    {isEdit
                        ? 'mengubah profil pengguna ini'
                        : 'menambahkan pengguna baru'}
                    .
                </p>

                <div className="mt-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value={
                                isEdit
                                    ? 'Password (kosongkan jika tidak ingin diubah)'
                                    : 'Password'
                            }
                        />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required={!isEdit}
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="role" value="Role" />
                            <select
                                id="role"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={data.role}
                                onChange={(e) =>
                                    setData('role', e.target.value)
                                }
                                required
                            >
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="company">Company</option>
                                <option value="enumerator">Enumerator</option>
                            </select>
                            <InputError
                                message={errors.role}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="company_id"
                                value="Perusahaan"
                            />
                            <select
                                id="company_id"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-slate-100 disabled:text-slate-500 sm:text-sm"
                                value={data.company_id}
                                onChange={(e) =>
                                    setData('company_id', e.target.value)
                                }
                                required={
                                    data.role === 'company' ||
                                    data.role === 'enumerator'
                                }
                                disabled={
                                    data.role === 'superadmin' ||
                                    data.role === 'admin'
                                }
                                aria-disabled={
                                    data.role === 'superadmin' ||
                                    data.role === 'admin'
                                }
                            >
                                <option value="">-- Pilih Perusahaan --</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.company_id}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel
                                htmlFor="position"
                                value="Posisi / Jabatan"
                            />
                            <TextInput
                                id="position"
                                className="mt-1 block w-full disabled:bg-slate-100 disabled:text-slate-500"
                                value={data.position}
                                onChange={(e) =>
                                    setData('position', e.target.value)
                                }
                                disabled={
                                    data.role === 'superadmin' ||
                                    data.role === 'admin'
                                }
                            />
                            <InputError
                                message={errors.position}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="No. Telepon" />
                            <TextInput
                                id="phone"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(
                                        /\D/g,
                                        '',
                                    );
                                    setData('phone', val);
                                }}
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Status Aktif" />
                        <div className="mt-2 flex items-center gap-4 rounded-lg border border-slate-200 p-3">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    className="h-4 w-4 text-primary focus:ring-primary"
                                    checked={data.is_active === true}
                                    onChange={() => setData('is_active', true)}
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    Aktif
                                </span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                                    checked={data.is_active === false}
                                    onChange={() => setData('is_active', false)}
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    Nonaktif
                                </span>
                            </label>
                        </div>
                        <InputError
                            message={errors.is_active as string}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Batal
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
