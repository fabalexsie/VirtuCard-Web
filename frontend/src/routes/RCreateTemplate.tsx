import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import Card from '../components/Card';
import { Person } from '../utils/data';
import FrontMain from '../components/FrontMain';
import { useState } from 'react';
import EjsEditor from '../components/EjsEditor';

export async function loader({
  params,
}: LoaderFunctionArgs<any>): Promise<{ personData: Person }> {
  if (params.userid === undefined) {
    return {
      personData: {
        firstname: 'Test',
        lastname: 'User',
        theme: {
          selectedName: 'default',
          primaryColor: '#80ffdb',
          secondaryColor: '#5390d9',
          accentColor: '#7400B8',
        },
      },
    };
  } else {
    const personData = await fetch(`/api/${params.userid}`).then(
      async (res) => {
        if (200 <= res.status && res.status < 300)
          return res.json(); // TODO: load template
        else
          throw new Error(`No success status code (200)\n${await res.text()}`);
      },
    );
    return { personData };
  }
}

export default RCreateTemplate;
function RCreateTemplate() {
  const { personData } = useLoaderData() as { personData: Person };

  const [template, setTemplate] = useState<string>(
    'Hello <%= firstname %><% if (from) { %> from <%= from %><% } %>!\n',
  );

  const handleEditorChange = (value: string | undefined) => {
    setTemplate(value || '');
  };

  return (
    <div className="w-screen md:h-screen flex flex-row flex-wrap md:flex-nowrap">
      <div className="w-full md:w-3/5 h-full my-4 md:my-0 flex items-center justify-center">
        <Card className="bg-[dodgerblue]" slim={false}>
          <EjsEditor value={template} onChange={handleEditorChange} />
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
