import React, { useRef } from 'react';
import { BackMain } from '../components/BackMain';
import {
  useLoaderData,
  useParams,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router-dom';
import { Person } from '../utils/data';
import FlippableCard, { FlipRefType } from '../components/FlippableCard';

export async function loader({ params }: LoaderFunctionArgs<any>) {
  const personData = await fetch(`/api/${params.userid}`).then(async (res) => {
    if (200 <= res.status && res.status < 300) return res.json();
    else throw new Error(`No success status code (200)\n${await res.text()}`);
  });
  return { personData };
}

export async function action({ request, params }: ActionFunctionArgs<any>) {
  const jsonString = await request.text();
  await fetch(`/api/${params.userid}/${params.editpw}`, {
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

  return (
    <FlippableCard onlyFirstPageAvailable={!canShowEditScreen} ref={flipRef}>
      <div className="front">
        <h1>Front</h1>
        <pre>{JSON.stringify(personData)}</pre>
      </div>
      <div className="back">
        <BackMain openFrontPage={handleOpenFrontPage} personData={personData} />
      </div>
    </FlippableCard>
  );
}
