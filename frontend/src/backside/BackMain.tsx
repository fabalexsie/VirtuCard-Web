import { useTranslation } from 'react-i18next';

export function BackMain() {
  const { t } = useTranslation();

  return (
    <div className="bg-white w-full h-full p-4">
      <h1>{t('Edit profile information')}</h1>
    </div>
  );
}
