
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="text-gray-500 text-sm">
                    <p className="font-semibold tracking-wider uppercase">
                        {t('footer.badge')}
                    </p>
                    <p className="mt-4">
                        &copy; {currentYear} LinguaX. {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;