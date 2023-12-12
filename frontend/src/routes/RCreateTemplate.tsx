import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
  useParams,
  useSubmit,
} from 'react-router-dom';
import Card from '../components/Card';
import { Person, Template } from '../utils/data';
import FrontMain from '../components/FrontMain';
import { useCallback, useEffect, useState } from 'react';
import EjsEditor from '../components/EjsEditor';
import { Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { logError } from '../utils/util';
import { toast } from 'react-toastify';
import clsx from 'clsx';

export async function loader({
  request,
  params,
}: LoaderFunctionArgs<any>): Promise<{
  templateData: Template | null;
  personData: Person;
}> {
  const searchParams = new URL(request.url).searchParams;
  let personData: Person = {
    firstname: 'John',
    lastname: 'Doe',
    birthday: '2000-01-01',
    email: 'john.doe@example.com',
    phone: '+49 123 456789',
    address: 'Example Street 123, 12345 Example City',
    website: 'example.com',
    linkedin: 'johndoe',
    github: 'johndoe',
    notes: 'Some notes',
    theme: {
      selectedName: 'default',
      primaryColor: '#80ffdb',
      secondaryColor: '#5390d9',
      accentColor: '#7400B8',
    },
  };
  const templateData = await fetch(`/api/t/${params.templateid}`).then(
    async (res) => {
      if (200 <= res.status && res.status < 300) {
        return res.json() as Promise<Template>;
      } else {
        logError(`No success status code (200)\n${await res.text()}`);
        return null;
      }
    },
  );
  if (searchParams.has('previewid'))
    personData = await fetch(`/api/p/${searchParams.get('previewid')}`).then(
      async (res) => {
        if (200 <= res.status && res.status < 300)
          return res.json() as Promise<Person>;
        else {
          logError(`No success status code (200)\n${await res.text()}`);
          return personData;
        }
      },
    );
  return { templateData, personData };
}

export async function action({ params, request }: ActionFunctionArgs<any>) {
  if (params.editpw !== undefined) {
    const jsonString = await request.text();
    await fetch(`/api/t/${params.templateid}/${params.editpw}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: jsonString,
    }).then(async (res) => {
      if (200 <= res.status && res.status < 300)
        toast.success('Saved', { autoClose: 500, hideProgressBar: true });
      else
        toast.error('Error saving', { autoClose: 500, hideProgressBar: true });
    });
    return null;
  }
}

export default RCreateTemplate;
function RCreateTemplate() {
  const { t } = useTranslation();
  const params = useParams();
  let submit = useSubmit();
  const { templateData, personData } = useLoaderData() as {
    templateData: Template | null;
    personData: Person;
  };

  const [templateStr, setTemplateStr] = useState<string>(
    templateData ? templateData.template : '// ' + t('No template found'),
  );

  const handleEditorChange = (value: string | undefined) => {
    setTemplateStr(value || '');
  };

  const handleSaveClick = useCallback(() => {
    submit(
      {
        template: templateStr,
        name: templateData?.name,
      } as Template,
      { method: 'PUT', encType: 'application/json' },
    );
  }, [submit, templateStr, templateData?.name]);

  useEffect(() => {
    const ctrlS = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSaveClick();
      }
    };
    document.addEventListener('keydown', ctrlS);

    return () => {
      document.removeEventListener('keydown', ctrlS);
    };
  }, [handleSaveClick]);

  return (
    <div className="w-screen h-screen flex flex-row flex-wrap md:flex-nowrap">
      {params.editpw && (
        <div className="w-full md:w-3/5 h-full my-4 md:my-0 flex items-center justify-center">
          <Card className="bg-[dodgerblue]" slim={false}>
            <div className="w-full h-full flex flex-col">
              <div className="mt-4 flex flex-row content-between">
                <h1 className="text-center text-white grow self-center">
                  {templateData?.name}
                </h1>
                <Button
                  className="me-4"
                  color="primary"
                  onPress={handleSaveClick}
                >
                  {t('Save')}
                </Button>
              </div>
              <div className="w-full flex-grow my-4">
                <EjsEditor value={templateStr} onChange={handleEditorChange} />
              </div>
            </div>
          </Card>
        </div>
      )}
      <div
        className={clsx('flex', 'items-center', 'justify-center', {
          'w-full md:w-2/5 h-full my-4 md:my-0': params.editpw,
          'w-full h-full': !params.editpw,
        })}
      >
        <Card className="bg-[dodgerblue] text-white">
          <FrontMain
            personData={personData}
            templateStr={templateStr}
          ></FrontMain>
        </Card>
      </div>
    </div>
  );
}
