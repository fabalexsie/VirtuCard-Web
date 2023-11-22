import { useTranslation } from 'react-i18next';
import { Link } from '@nextui-org/react';

type NewCardResponse = {
  personId: string;
  editpw: string;
};

export default function RHome() {
  const { t } = useTranslation();

  const handleCreateNewPerson = async () => {
    const newCardResp: NewCardResponse = await fetch(`/api/new-card`).then(
      async (res) => {
        if (200 <= res.status && res.status < 300) return res.json();
        else
          throw new Error(`No success status code (200)\n${await res.text()}`);
      },
    );
    window.location.href = `/${newCardResp.personId}/${newCardResp.editpw}`;
  };

  return (
    <>
      <div className="w-screen h-screen overflow-y-auto">
        <section className="w-full h-screen flex flex-col items-center justify-center">
          <h1 className="text-6xl font-semibold">
            {t('Welcome to VirtuCard!')}
          </h1>
          <p className="text-3xl mt-4">
            {t('Get started by')}{' '}
            <Link className="text-3xl" onPress={handleCreateNewPerson} href="#">
              creating
            </Link>{' '}
            your own Card
          </p>
        </section>
        <section className="w-full flex flex-col items-center justify-center h-screen"></section>
      </div>
    </>
  );
}
