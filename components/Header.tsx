
import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
    onOpenModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-between items-center">
                    <div className="text-3xl font-extrabold tracking-tight">
                        Lingua<span className="text-violet-500">X</span> Ai
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex items-center space-x-1 border border-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => changeLanguage('es')}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${i18n.language.startsWith('es') ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                ES
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 ${i18n.language.startsWith('en') ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                EN
                            </button>
                        </div>
                        <button
                            onClick={onOpenModal}
                            className="hidden sm:inline-block bg-transparent border border-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                        >
                            {t('header.contact')}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;