import React, { useEffect, useState } from 'react';
import './App.scss';
import { NextUIProvider } from '@nextui-org/react';

function App() {
  const [apiResult, setApiResult] = useState('API is loading');

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

  return (
    <NextUIProvider>
      <div className="App">
        <div className="flipable-card-holder">
          <div className="flipable-card">
            <div className="front">
              <h1>Front</h1>
            </div>
            <div className="back">
              <h1>Back</h1>
            </div>
          </div>
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
    </NextUIProvider>
  );
}

export default App;
