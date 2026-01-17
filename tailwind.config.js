import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: '#00753d',
                'primary-dark': '#15803d',
                'primary-light': '#dcfce7',
                'primary-btn': '#70C229',
                'primary-btn-hover': '#5fa821',
                'background-light': '#f9fafb',
                'card-light': '#ffffff',
            },
            fontFamily: {
                sans: ['Urbanist', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
