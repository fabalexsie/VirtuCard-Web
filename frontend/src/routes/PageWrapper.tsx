import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

declare var VirtuCardApp: {
  pageLoadFinished: () => void;
};

export default function PageWrapperNotifyLoaded() {
  useEffect(() => {
    if (
      typeof VirtuCardApp !== 'undefined' &&
      VirtuCardApp &&
      VirtuCardApp.pageLoadFinished
    ) {
      VirtuCardApp.pageLoadFinished();
    }
  }, []);

  return <Outlet />;
}
