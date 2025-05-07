
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelectorModal from './LanguageSelectorModal';

const FooterLanguageButton: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(prev => !prev);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button 
        onClick={toggleModal}
        className="text-sm hover:underline"
      >
        {t('changeLanguage', 'Change Language')}
      </button>

      <LanguageSelectorModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};

export default FooterLanguageButton;
