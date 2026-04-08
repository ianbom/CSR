import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect } from 'react';
import CompanyForm, { CompanyFormValues } from './CompanyForm';

interface Props {
    show: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    company?: any | null; // Provide existing data via this prop for editing
}

export default function ModalCompany({ show, onClose, company }: Props) {
    const isEdit = !!company;

    const {
        data,
        setData,
        post,
        patch,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<CompanyFormValues>({
        name: '',
        legal_name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
    });

    useEffect(() => {
        if (show) {
            if (isEdit && company) {
                setData({
                    name: company.name ?? '',
                    legal_name: company.legal_name ?? '',
                    email: company.email ?? '',
                    phone: company.phone ?? '',
                    address: company.address ?? '',
                    status: company.status ?? 'active',
                });
            } else {
                reset();
            }
            clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, isEdit, company]);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (isEdit && company) {
            patch(route('companies.update', company.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('companies.store'), {
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
                    {isEdit ? 'Ubah Data Perusahaan' : 'Tambah Perusahaan Baru'}
                </h2>

                <p className="mb-6 mt-1 text-sm text-slate-600">
                    Silakan isi form di bawah ini untuk{' '}
                    {isEdit
                        ? 'mengubah data perusahaan ini'
                        : 'menambahkan perusahaan baru'}
                    .
                </p>

                <CompanyForm data={data} setData={setData} errors={errors} />

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Batal
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        {isEdit ? 'Simpan Perubahan' : 'Tambah Perusahaan'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
