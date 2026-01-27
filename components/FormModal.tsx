
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        role: '',
        teamSize: '',
        phone: '',
        country: '',
        comments: '',
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const response = await fetch('https://formspree.io/f/mojdbnkj', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    company: '',
                    role: '',
                    teamSize: '',
                    phone: '',
                    country: '',
                    comments: '',
                });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative bg-[#0A0A12] border border-gray-800 rounded-2xl shadow-2xl shadow-violet-900/20 w-full max-w-lg m-4 p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <h3 className="text-2xl font-bold text-white">{t('form.success.title')}</h3>
                        <p className="mt-4 text-gray-400">{t('form.success.message')}</p>
                        <button
                            onClick={onClose}
                            className="mt-8 w-full bg-violet-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            {t('form.success.close')}
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-white">{t('form.title')}</h3>
                        <p className="mt-2 text-gray-400">{t('form.subtitle')}</p>
                        
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400">{t('form.fullName')}</label>
                                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400">{t('form.businessEmail')}</label>
                                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-400">{t('form.companyName')}</label>
                                <input type="text" name="company" id="company" required value={formData.company} onChange={handleChange} className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-400">{t('form.roleOptional')}</label>
                                    <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
                                </div>
                                <div>
                                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-400">{t('form.teamSizeOptional')}</label>
                                    <select name="teamSize" id="teamSize" value={formData.teamSize} onChange={handleChange} className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500">
                                        <option value="">{t('form.selectSize')}</option>
                                        <option value="1-10">1-10</option>
                                        <option value="11-50">11-50</option>
                                        <option value="51-200">51-200</option>
                                        <option value="201-1000">201-1000</option>
                                        <option value="1000+">1000+</option>
                                    </select>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-400">{t('form.phoneOptional')}</label>
                                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-400">{t('form.countryOptional')}</label>
                                    <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="comments" className="block text-sm font-medium text-gray-400">{t('form.commentsOptional')}</label>
                                <textarea name="comments" id="comments" rows={3} value={formData.comments} onChange={handleChange} className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500" placeholder={t('form.commentsPlaceholder')}></textarea>
                            </div>
                             {status === 'error' && <p className="text-red-500 text-sm text-center">{t('form.error')}</p>}
                            <div>
                                <button type="submit" disabled={status === 'submitting'} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {status === 'submitting' ? t('form.submitting') : t('form.submit')}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default FormModal;
