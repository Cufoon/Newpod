import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '$components/footer';
import Navbar from '$components/nav';
import { getCurrentAccount } from '$service/account';
import { GlobalMessage } from '$utils/message';

import styles from './app.scss';

const App: React.FC = () => {
  const [init, setInit] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const isFromYWYJ = searchParams.getAll('utm_source').includes('xinquji');
    if (isFromYWYJ) {
      GlobalMessage.info('欢迎来自一网一匠的同学！');
    }
  }, []);

  useEffect(() => {
    let living = true;
    (async () => {
      const currentAccount = await getCurrentAccount();
      if (currentAccount && living) {
        setInit(true);
        return;
      }
      navigate('/setting');
    })();
    return () => {
      living = false;
    };
  }, []);

  return (
    (init && (
      <div className={styles.appLayout}>
        <Navbar />
        <div className={styles.appContent}>
          <Outlet />
        </div>
        <Footer />
      </div>
    )) ||
    null
  );
};

export default App;
