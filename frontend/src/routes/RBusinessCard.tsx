import React, { useEffect, useRef } from 'react';
import {
  useLoaderData,
  useParams,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router-dom';
import { Person } from '../utils/data';
import FlippableCard, { FlipRefType } from '../components/FlippableCard';
import { BackMain } from '../components/BackMain';
import FrontMain from '../components/FrontMain';

export async function loader({ params }: LoaderFunctionArgs<any>) {
  const personData = await fetch(`/api/p/${params.userid}`).then(
    async (res) => {
      if (200 <= res.status && res.status < 300) return res.json();
      else throw new Error(`No success status code (200)\n${await res.text()}`);
    },
  );
  return { personData };
}

export async function action({ request, params }: ActionFunctionArgs<any>) {
  const jsonString = await request.text();
  await fetch(`/api/p/${params.userid}/${params.editpw}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: jsonString,
  });
  return null;
}

export default RBusinessCard;
function RBusinessCard() {
  const params = useParams();
  const { personData } = useLoaderData() as { personData: Person };
  const canShowEditScreen = params.editpw !== undefined;

  const flipRef = useRef<FlipRefType>(null);

  const handleOpenFrontPage = () => {
    flipRef.current?.openFrontPage();
  };

  useEffect(() => {
    if (!personData.firstname || !personData.lastname) {
      setTimeout(() => {
        flipRef.current?.openBackPage();
      }, 500);
    }
  }, [personData.firstname, personData.lastname]);

  return (
    <div className="w-screen h-screen">
      <FlippableCard
        onlyFirstPageAvailable={!canShowEditScreen}
        ref={flipRef}
        front={<FrontMain personData={personData} />}
        back={
          <BackMain
            openFrontPage={handleOpenFrontPage}
            personData={personData}
          />
        }
      ></FlippableCard>
    </div>
  );
}
