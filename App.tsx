
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';
import FormModal from './components/FormModal';

const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { i18n, t } = useTranslation();

    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.title = t('page.title');
        const descriptionTag = document.querySelector('meta[name="description"]');
        if (descriptionTag) {
            descriptionTag.setAttribute('content', t('page.description'));
        }
    }, [i18n.language, t]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="relative bg-[#05050A] text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-violet-900/40 rounded-full filter blur-[150px] opacity-60"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-900/40 rounded-full filter blur-[150px] opacity-60"></div>
            </div>
            <div className="relative z-10">
                <Header onOpenModal={handleOpenModal} />
                <main>
                    <Hero onOpenModal={handleOpenModal} />
                    <TrustedBy />
                    <Features />
                    <HowItWorks />
                    <CTA onOpenModal={handleOpenModal} />
                </main>
                <Footer />
            </div>
            <FormModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default App;