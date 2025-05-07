import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelectorModal from '@/components/LanguageSelectorModal';

const FooterLanguageButton: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const openModal = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Link rel="nofollow" title={t('changeLanguage', 'Change Language')} to={location.pathname} onClick={openModal}>
        {t('changeLanguage', 'Change Language')}
      </Link>

      <LanguageSelectorModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default FooterLanguageButton;
