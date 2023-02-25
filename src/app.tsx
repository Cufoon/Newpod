import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '$components/footer';
import Navbar from '$components/nav';

import styles from './app.scss';
import { useEffect, useState } from 'react';
import { getCurrentAccount } from '$service/account';

const App: React.FC = () => {
  const [init, setInit] = useState(false);
  const navigate = useNavigate();

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
