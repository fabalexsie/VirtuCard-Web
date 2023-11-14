import React, { useEffect, useState } from 'react';
import './App.scss';
import { NextUIProvider } from '@nextui-org/react';
import { motion } from 'framer-motion';

function App() {
  const [apiResult, setApiResult] = useState('API is loading');
  const [rotAnim, setRotAnim] = useState(0);
  const [outStr, setOutStr] = useState('');
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api')
      .then(async (res) => {
        if (200 <= res.status && res.status < 300) return res.text();
        else
          throw new Error(`No success status code (200)\n${await res.text()}`);
      })
      .then((resText) => setApiResult(resText))
      .catch((err) => setApiResult(`${err}`));
  }, []);

  const handlePan = (event: any, info: any) => {
    // "2 *" move the card twice as fast as the finger
    const relDelta = (2 * info.delta.x) / (cardRef.current?.clientWidth || 1);
    setRotAnim(rotAnim + relDelta);
  };
  const handlePanEnd = (event: any, info: any) => {
    const relOffset = info.offset.x / (cardRef.current?.clientWidth || 1);
    if (info.velocity.x > 200 || (relOffset > 0.3 && rotAnim < -0.5)) {
      setRotAnim(0);
    } else if (info.velocity.x < -200 || (relOffset < -0.3 && rotAnim > -0.5)) {
      setRotAnim(-1);
    } else {
      if (rotAnim > -0.5) setRotAnim(0);
      else setRotAnim(-1);
    }
    setOutStr(
      `offset: ${relOffset}\nvelocity: ${info.velocity.x}\nrotAnim: ${rotAnim}`,
    );
  };

  return (
    <NextUIProvider>
      <motion.div onPan={handlePan} onPanEnd={handlePanEnd} ref={cardRef}>
        {/*<p>{outStr}</p>*/}
        <div className="App touch-pan-x">
          <div className="flipable-card-holder">
            <motion.div
              layout
              className="flipable-card"
              animate={{
                rotateY: `${180 * Math.max(-1.1, Math.min(rotAnim, 0.1))}deg`,
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <div className="front">
                <h1>Front</h1>
              </div>
              <div className="back">
                <h1>Back</h1>
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
    </NextUIProvider>
  );
}

export default App;
