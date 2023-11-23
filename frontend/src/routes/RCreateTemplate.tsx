import { LoaderFunctionArgs, useLoaderData, useParams } from 'react-router-dom';
import Card from '../components/Card';
import { Person, Template } from '../utils/data';
import FrontMain from '../components/FrontMain';
import { useState } from 'react';
import EjsEditor from '../components/EjsEditor';

export async function loader({
  request,
  params,
}: LoaderFunctionArgs<any>): Promise<{
  templateData: Template;
  personData: Person;
}> {
  const searchParams = new URL(request.url).searchParams;
  let personData = {
    firstname: 'John',
    lastname: 'Doe',
    birthday: '2000-01-01',
    email: 'john.doe@example.com',
    phone: '+49 123 456789',
    address: 'Example Street 123, 12345 Example City',
    website: 'example.com',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    notes: 'Some notes',
    theme: {
      selectedName: 'default',
      accentColor: '#000000',
      primaryColor: '#ffffff',
      secondaryColor: '#000000',
    },
  };

  if (params.userid === undefined) {
    return {
      templateData: {
        name: 'default',
        template: [
          '<h1>Hello <%= firstname %></h1>',
          '<% if (birthday) { %> birthday <%= birthday %><% } %>!',
          '<p>Some more text</p>',
          '<div>',
          '<a href="https://<%= website %>">Website (<%= website %>)</a>',
          '<a href="<%= linkedin %>">LinkedIn</a>',
          '</div>',
        ].join('\n'),
      },
      personData: personData,
    };
  } else {
    const templateData = await fetch(`/api/t/${params.templateid}`).then(
      async (res) => {
        if (200 <= res.status && res.status < 300)
          return res.json(); // TODO: load template
        else
          throw new Error(`No success status code (200)\n${await res.text()}`);
      },
    );
    if (searchParams.has('previewid'))
      personData = await fetch(`/api/p/${searchParams.get('previewid')}`).then(
        async (res) => {
          if (200 <= res.status && res.status < 300)
            return res.json(); // TODO: load template
          else
            throw new Error(
              `No success status code (200)\n${await res.text()}`,
            );
        },
      );
    return { templateData, personData };
  }
}

export default RCreateTemplate;
function RCreateTemplate() {
  const params = useParams();
  const { templateData, personData } = useLoaderData() as {
    templateData: Template;
    personData: Person;
  };

  const [template, setTemplate] = useState<string>(templateData.template);

  const handleEditorChange = (value: string | undefined) => {
    setTemplate(value || '');
  };

  return (
    <div className="w-screen md:h-screen flex flex-row flex-wrap md:flex-nowrap">
      <div className="w-full md:w-3/5 h-full my-4 md:my-0 flex items-center justify-center">
        <Card className="bg-[dodgerblue]" slim={false}>
          <div className="w-full h-full flex flex-col">
            <h1 className="mt-4 text-center text-white">{templateData.name}</h1>
            <div className="w-full flex-grow my-4">
              <EjsEditor value={template} onChange={handleEditorChange} />
            </div>
          </div>
        </Card>
      </div>
      <div className="w-full md:w-2/5 h-full my-4 md:my-0 flex items-center justify-center">
        <Card className="bg-[dodgerblue] text-white">
          <FrontMain personData={personData} templateStr={template}></FrontMain>
        </Card>
      </div>
    </div>
  );
}
