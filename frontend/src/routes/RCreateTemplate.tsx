import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import CardWrapper from '../components/Card';
import { Person } from '../utils/data';
import FrontMain from '../components/FrontMain';

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
        if (200 <= res.status && res.status < 300) return res.json();
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

  return (
    <div className="w-screen h-screen flex flex-row">
      <div className="w-1/2 h-full flex items-center justify-center">
        <CardWrapper></CardWrapper>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center">
        <CardWrapper>
          <FrontMain personData={personData}></FrontMain>
        </CardWrapper>
      </div>
    </div>
  );
}
