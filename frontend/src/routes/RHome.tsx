import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useRouteError } from 'react-router-dom';
import { NewPersonResponse, NewTemplateResponse } from '../utils/data';

export default function RHome({ error404 = false }: { error404?: boolean }) {
  const { t } = useTranslation();
  const errorExplanation = useRouteError();

  const handleCreateNewPerson = async () => {
    const newCardResp: NewPersonResponse = await fetch(`/api/p/new`).then(
      async (res) => {
        if (200 <= res.status && res.status < 300) return res.json();
        else
          throw new Error(`No success status code (200)\n${await res.text()}`);
      },
    );
    window.location.href = `/p/${newCardResp.personId}/${newCardResp.editpw}`;
  };

  const handleCreateNewTemplate = async () => {
    const newTemplateResp: NewTemplateResponse = await fetch(`/api/t/new`).then(
      async (res) => {
        if (200 <= res.status && res.status < 300) return res.json();
        else
          throw new Error(`No success status code (200)\n${await res.text()}`);
      },
    );
    window.location.href = `/t/${newTemplateResp.templateId}/${newTemplateResp.editpw}`;
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
          <Link
            className="text-xl mt-4"
            onPress={handleCreateNewTemplate}
            href="#"
          >
            {t('or create your own template')}
          </Link>
        </section>
        <section className="w-full flex flex-col items-center justify-center h-screen"></section>
      </div>
    </>
  );
}
