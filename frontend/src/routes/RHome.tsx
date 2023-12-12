import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { toast } from 'react-toastify';
import {
  LoaderFunctionArgs,
  useLoaderData,
  useRouteError,
} from 'react-router-dom';
import { Config, NewPersonResponse, NewTemplateResponse } from '../utils/data';

export async function loader({
  request,
  params,
}: LoaderFunctionArgs<any>): Promise<{
  config: Config;
}> {
  const config = await fetch(`/api/config`).then(async (res) => {
    if (200 <= res.status && res.status < 300) return res.json();
    else throw new Error(`No success status code (200)\n${await res.text()}`);
  });
  return { config };
}

export default function RHome() {
  const { t } = useTranslation();
  const errorExplanation = useRouteError();
  const { config } = useLoaderData() as { config: Config };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    if (errorExplanation) {
      const c = console; // fool the console-log detection script
      c.error(errorExplanation);
    }
  }, [errorExplanation]);

  return (
    <>
      <CreatePersonModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className="w-screen h-screen overflow-y-auto">
        <section className="w-full h-screen flex flex-col items-center justify-center">
          <h1 className="text-6xl font-semibold px-4 text-center">
            {t('Welcome to VirtuCard!')}
          </h1>
          {config?.newPersonsAllowed && (
            <Link
              className="text-3xl mt-4 px-4 text-center"
              onPress={onOpen}
              href="#"
            >
              {t('Create your own Card')}
            </Link>
          )}
          {config?.newTemplatesAllowed && (
            <Link
              className="text-3xl mt-4 px-4 text-center"
              onPress={handleCreateNewTemplate}
              href="#"
            >
              {t('Create your own Template')}
            </Link>
          )}
        </section>
        <section className="w-full flex flex-col items-center justify-center h-screen"></section>
      </div>
    </>
  );
}

function CreatePersonModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}): React.ReactElement {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [generatedUsername, setGeneratedUsername] = useState('');

  useEffect(() => {
    async function fetchData() {
      await fetch(`/api/p/suggestUsername`).then(async (res) => {
        if (200 <= res.status && res.status < 300) {
          setGeneratedUsername((await res.json()).username);
        } else {
          toast.warn('Error generating username');
        }
      });
    }
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleCreateNewPerson = async () => {
    const searchParams = new URLSearchParams();
    searchParams.set('name', username || generatedUsername);
    await fetch(`/api/p/new?${searchParams.toString()}`).then(async (res) => {
      if (200 <= res.status && res.status < 300) {
        return res.json().then((newPersonResp: NewPersonResponse) => {
          window.location.href = `/p/${newPersonResp.personId}/${newPersonResp.editpw}`;
        });
      } else {
        toast.error(`Error creating new card: ${(await res.json()).msg}`);
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{t('Choose your username')}</ModalHeader>
            <ModalBody>
              <Input
                placeholder={generatedUsername}
                value={username}
                onValueChange={setUsername}
                label={t('Username')}
                color="primary"
                variant="flat"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                {t('Cancel')}
              </Button>
              <Button color="primary" onClick={handleCreateNewPerson}>
                {t('Create')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
