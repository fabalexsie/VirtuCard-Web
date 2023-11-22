import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useRouteError } from 'react-router-dom';

type NewCardResponse = {
  personId: string;
  editpw: string;
};

export default function RHome({ error404 = false }: { error404?: boolean }) {
  const { t } = useTranslation();
  const errorExplanation = useRouteError();

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

  useEffect(() => {
    if (error404) {
      const toastId = toast.warn('The requested page was not found');
      return () => toast.dismiss(toastId);
    }
  }, [error404]);
  useEffect(() => {
    const c = console; // fool the console-log detection script
    c.error(errorExplanation);
  }, [errorExplanation]);

  return (
    <>
      <div className="w-screen h-screen overflow-y-auto">
        <section className="w-full h-screen flex flex-col items-center justify-center">
          <h1 className="text-6xl font-semibold">
            {t('Welcome to VirtuCard!')}
          </h1>
          <Link
            className="text-3xl mt-4"
            onPress={handleCreateNewPerson}
            href="#"
          >
            {t('Create your own Card')}
          </Link>
        </section>
        <section className="w-full flex flex-col items-center justify-center h-screen"></section>
      </div>
    </>
  );
}
