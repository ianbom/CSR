import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import EnumeratorLayout from '@/Layouts/EnumeratorLayout';
import {
    Button,
    FormSection,
    TextInputField,
    SelectField,
    RadioGroup,
    ChipGroup,
    ProgressBar,
    StepIndicator,
    MaterialIcon,
} from '@/Components/Enumerator';

interface Province {
    id: string;
    name: string;
}

interface City {
    id: string;
    name: string;
}

interface District {
    id: string;
    name: string;
}

interface SelectOption {
    value: string;
    label: string;
}

// Education options
const educationOptions: SelectOption[] = [
    { value: 'sd', label: 'SD/Sederajat' },
    { value: 'smp', label: 'SMP/Sederajat' },
    { value: 'sma', label: 'SMA/Sederajat' },
    { value: 'd3', label: 'Diploma (D1/D2/D3)' },
    { value: 's1', label: 'Sarjana (S1)' },
    { value: 's2', label: 'Magister (S2)' },
    { value: 's3', label: 'Doktor (S3)' },
];

// Gender options
const genderOptions = [
    { value: 'male', label: 'Pria', icon: 'male' },
    { value: 'female', label: 'Wanita', icon: 'female' },
];

// Service type options
const serviceTypeOptions = [
    { value: 'walk-in', label: 'Layanan Langsung (Walk-in)', icon: 'storefront' },
    { value: 'online', label: 'Layanan Online / Digital', icon: 'computer' },
    { value: 'call', label: 'Layanan Panggilan', icon: 'call' },
];

export default function RespondentSurvey() {
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: '',
        education: '',
        occupation: '',
        serviceType: 'walk-in',
        provinceId: '',
        cityId: '',
        districtId: '',
    });

    // Location data state
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState({
        provinces: false,
        cities: false,
        districts: false,
    });

    // Fetch provinces on mount
    useEffect(() => {
        fetchProvinces();
    }, []);

    // Fetch cities when province changes
    useEffect(() => {
        if (formData.provinceId) {
            fetchCities(formData.provinceId);
            setFormData((prev) => ({ ...prev, cityId: '', districtId: '' }));
            setCities([]);
            setDistricts([]);
        }
    }, [formData.provinceId]);

    // Fetch districts when city changes
    useEffect(() => {
        if (formData.cityId) {
            fetchDistricts(formData.cityId);
            setFormData((prev) => ({ ...prev, districtId: '' }));
            setDistricts([]);
        }
    }, [formData.cityId]);

    const fetchProvinces = async () => {
        setLoading((prev) => ({ ...prev, provinces: true }));
        try {
            const response = await fetch(route('api.area.provinces'));
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            console.error('Failed to fetch provinces:', error);
        } finally {
            setLoading((prev) => ({ ...prev, provinces: false }));
        }
    };

    const fetchCities = async (provinceId: string) => {
        setLoading((prev) => ({ ...prev, cities: true }));
        try {
            const response = await fetch(
                route('api.area.cities', { province_id: provinceId })
            );
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setLoading((prev) => ({ ...prev, cities: false }));
        }
    };

    const fetchDistricts = async (cityId: string) => {
        setLoading((prev) => ({ ...prev, districts: true }));
        try {
            const response = await fetch(
                route('api.area.districts', { city_id: cityId })
            );
            const data = await response.json();
            setDistricts(data);
        } catch (error) {
            console.error('Failed to fetch districts:', error);
        } finally {
            setLoading((prev) => ({ ...prev, districts: false }));
        }
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleBack = () => {
        router.visit(route('enumerator.list-survey'));
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // Navigate to next step (questionnaire)
    };

    // Convert location data to select options
    const provinceOptions: SelectOption[] = provinces.map((p) => ({
        value: p.id,
        label: p.name,
    }));

    const cityOptions: SelectOption[] = cities.map((c) => ({
        value: c.id,
        label: c.name,
    }));

    const districtOptions: SelectOption[] = districts.map((d) => ({
        value: d.id,
        label: d.name,
    }));

    return (
        <EnumeratorLayout activeNav="tugasku">
            <Head title="Data Responden" />

            {/* Header with Progress */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-gray-900 text-2xl sm:text-3xl font-bold">
                        Data Responden
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Silakan isi data demografi responden dengan lengkap.
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col gap-8">
                {/* Section 1: Identitas Pribadi */}
                <FormSection icon="person" title="Identitas Pribadi">
                    <TextInputField
                        label="Nama Lengkap"
                        placeholder="Contoh: Budi Santoso"
                        icon="badge"
                        value={formData.fullName}
                        onChange={(value) => updateFormData('fullName', value)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInputField
                            label="Usia"
                            placeholder="Tahun"
                            icon="cake"
                            type="number"
                            value={formData.age}
                            onChange={(value) => updateFormData('age', value)}
                        />

                        <RadioGroup
                            label="Jenis Kelamin"
                            name="gender"
                            options={genderOptions}
                            value={formData.gender}
                            onChange={(value) => updateFormData('gender', value)}
                        />
                    </div>
                </FormSection>

                {/* Section 2: Sosial & Ekonomi */}
                <FormSection icon="payments" title="Sosial & Ekonomi" iconColor="text-primary">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SelectField
                            label="Pendidikan Terakhir"
                            placeholder="Pilih pendidikan"
                            options={educationOptions}
                            value={formData.education}
                            onChange={(value) => updateFormData('education', value)}
                        />

                        <TextInputField
                            label="Pekerjaan Utama"
                            placeholder="Contoh: Pegawai Swasta, Guru"
                            icon="work"
                            value={formData.occupation}
                            onChange={(value) => updateFormData('occupation', value)}
                        />
                    </div>
                </FormSection>

                {/* Section 3: Lokasi & Layanan */}
                <FormSection icon="location_on" title="Lokasi & Layanan" iconColor="text-primary">
                    <ChipGroup
                        label="Jenis Layanan yang Diterima"
                        options={serviceTypeOptions}
                        value={formData.serviceType}
                        onChange={(value) => updateFormData('serviceType', value)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SelectField
                            label="Provinsi"
                            placeholder="Pilih Provinsi"
                            options={provinceOptions}
                            value={formData.provinceId}
                            onChange={(value) => updateFormData('provinceId', value)}
                            disabled={loading.provinces}
                        />

                        <SelectField
                            label="Kabupaten/Kota"
                            placeholder="Pilih Kabupaten/Kota"
                            options={cityOptions}
                            value={formData.cityId}
                            onChange={(value) => updateFormData('cityId', value)}
                            disabled={!formData.provinceId || loading.cities}
                        />
                    </div>

                    <SelectField
                        label="Kecamatan"
                        placeholder="Pilih Kecamatan"
                        options={districtOptions}
                        value={formData.districtId}
                        onChange={(value) => updateFormData('districtId', value)}
                        disabled={!formData.cityId || loading.districts}
                    />
                </FormSection>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pb-8">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                    <MaterialIcon name="arrow_back" className="text-lg" />
                    <span>Kembali</span>
                </button>

                <Button
                    variant="primary"
                    icon="arrow_forward"
                    onClick={handleSubmit}
                    className="w-full sm:w-auto px-8"
                >
                    Lanjut ke Kuesioner
                </Button>
            </div>
        </EnumeratorLayout>
    );
}
