import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { NextUIProvider } from '@nextui-org/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RBusinessCard, {
  loader as personLoader,
  action as personAction,
} from './routes/RBusinessCard';
import {
  loader as templateLoader,
  action as templateAction,
} from './routes/RCreateTemplate';
import PageWrapperNotifyLoaded from './routes/PageWrapper';
import RCreateTemplate from './routes/RCreateTemplate';
import RHome from './routes/RHome';
import { loader as homeLoader } from './routes/RHome';
import RError from './routes/RError';

import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import './i18n';

const router = createBrowserRouter([
  {
    errorElement: <RError />,
    element: <PageWrapperNotifyLoaded />,
    children: [
      {
        path: '/',
        element: <RHome />,
        loader: homeLoader,
      },
      {
        path: '/t/:templateid/:editpw?', // optional get params: previewid=:userid
        element: <RCreateTemplate />,
        loader: templateLoader,
        action: templateAction,
      },
      {
        path: '/p/:userid/:editpw?',
        element: <RBusinessCard />,
        loader: personLoader,
        action: personAction,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={true}
      theme="dark"
      transition={Slide}
    />
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console .log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
