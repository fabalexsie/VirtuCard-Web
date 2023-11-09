import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, NextUIProvider } from '@nextui-org/react';

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p>
            <small>
              <pre>{apiResult}</pre>
            </small>
          </p>
          <Button>Test</Button>
          <EjsRenderer
            template="Hello <%= name %><% if (from) { %> from <%= from %><% } %>!"
            data={{ name: 'World' }}
          />
        </header>
      </div>
    </NextUIProvider>
  );
}

function EjsRenderer(props: { template: string; data: object }) {
  try {
    let html = window.ejs.render(props.template, props.data);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (err) {
    return <pre>{String(err)}</pre>;
  }
}

export default App;
