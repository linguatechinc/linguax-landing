
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnalysisIcon, IntegrationIcon, SecurityIcon } from './icons';

const Features: React.FC = () => {
    const { t } = useTranslation();

    const features = [
        {
            name: t('features.analysis.title'),
            description: t('features.analysis.description'),
            icon: <AnalysisIcon />,
        },
        {
            name: t('features.integration.title'),
            description: t('features.integration.description'),
            icon: <IntegrationIcon />,
        },
        {
            name: t('features.security.title'),
            description: t('features.security.description'),
            icon: <SecurityIcon />,
        },
    ];

    return (
        <section className="py-24 bg-[#0A0A12]/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{t('features.title')}</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        {t('features.subtitle')}
                    </p>
                </div>
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.name} className="p-8 border border-gray-800 rounded-2xl bg-[#0F0F1A]/50">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-violet-600/20 text-violet-400">
                                {feature.icon}
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-white">{feature.name}</h3>
                            <p className="mt-2 text-base text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;