import React, { useState } from 'react';
import './App.scss';
import { motion } from 'framer-motion';
import { BackMain } from './backside/BackMain';
import {
  useLoaderData,
  useParams,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router-dom';
import { Person } from './utils/data';

export async function loader({ params }: LoaderFunctionArgs<any>) {
  const personData = await fetch(`/api/${params.userid}`).then(async (res) => {
    if (200 <= res.status && res.status < 300) return res.json();
    else throw new Error(`No success status code (200)\n${await res.text()}`);
  });
  return { personData };
}

export async function action({ request, params }: ActionFunctionArgs<any>) {
  const formData = await request.formData();
  await fetch(`/api/${params.userid}/${params.editpw}`, {
    method: 'PUT',
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  return { title: 'Card' };
}

function App() {
  const params = useParams();
  const { personData } = useLoaderData() as { personData: Person };
  const canShowEditScreen = params.editpw !== undefined;

  const [rotAnim, setRotAnim] = useState(0);
  const divPan = React.useRef<HTMLDivElement>(null);

  const handlePan = (event: any, info: any) => {
    // "2 *" move the card twice as fast as the finger
    const relDelta = (2 * info.delta.x) / (divPan.current?.clientWidth || 1);
    setRotAnim(rotAnim + relDelta);
  };
  const handlePanEnd = (event: any, info: any) => {
    const relOffset = info.offset.x / (divPan.current?.clientWidth || 1);
    if (info.velocity.x > 200 || (relOffset > 0.3 && rotAnim < -0.5)) {
      setRotAnim(0);
    } else if (info.velocity.x < -200 || (relOffset < -0.3 && rotAnim > -0.5)) {
      setRotAnim(canShowEditScreen ? -1 : 0);
    } else {
      if (rotAnim > -0.5) setRotAnim(0);
      else setRotAnim(canShowEditScreen ? -1 : 0);
    }
  };

  return (
    <motion.div onPan={handlePan} onPanEnd={handlePanEnd} ref={divPan}>
      <div className="App touch-pan-x select-none">
        <div className="flipable-card-holder">
          <motion.div
            layout
            className="flipable-card"
            animate={{
              rotateY: canShowEditScreen
                ? `${180 * Math.max(-1.1, Math.min(rotAnim, 0.1))}deg`
                : `${180 * Math.max(-0.1, Math.min(rotAnim, 0.1))}deg`,
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <div className="front">
              <h1>Front</h1>
              <pre>{JSON.stringify(personData)}</pre>
            </div>
            <div className="back">
              <BackMain openFrontPage={() => setRotAnim(0)} />
            </div>
          </motion.div>
        </div>
        {/*<Button
              onPress={() =>
                downloadVcf({
                  firstname: 'Erika',
                  emailList: ['erika@example.com'],
                  phoneList: [{ no: '+49123456789', type: 'home' }],
                })
              }
            >
              Test
            </Button>
            <EjsRenderer
              template="Hello <%= name %><% if (from) { %> from <%= from %><% } %>!"
              data={{ name: 'World', from: undefined }}
            />*/}
      </div>
    </motion.div>
  );
}

export default App;
