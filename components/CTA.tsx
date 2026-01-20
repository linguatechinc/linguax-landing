
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CTAProps {
    onOpenModal: () => void;
}

const CTA: React.FC<CTAProps> = ({ onOpenModal }) => {
    const { t } = useTranslation();

    return (
        <section className="py-24 bg-[#0A0A12]/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {t('cta.title')}
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-400">
                    {t('cta.subtitle')}
                </p>
                <div className="mt-10">
                    <button
                        onClick={onOpenModal}
                        className="inline-block bg-violet-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-violet-600/30 hover:bg-violet-700 transition-all duration-300 transform hover:scale-105"
                    >
                        {t('cta.cta')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTA;