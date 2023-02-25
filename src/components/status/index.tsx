import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.scss';

interface Props {
  status: string;
}

const Index: React.FC<Props> = ({ status }) => {
  const result = useMemo<[string, JSX.Element, string]>(() => {
    if (status === 'ENABLE') {
      return [
        'hsl(120, 38%, 60%)',
        <FontAwesomeIcon key='running' icon={['fas', 'circle-check']} />,
        'Running'
      ];
    }
    if (status === 'PAUSE' || status === 'DISABLE') {
      return [
        'hsl(39, 38%, 60%)',
        <FontAwesomeIcon key='pause' icon={['fas', 'circle-pause']} />,
        'Pause'
      ];
    }
    return [
      'hsl(0, 38%, 60%)',
      <FontAwesomeIcon key='forbidden' icon={['fas', 'circle-xmark']} />,
      'Forbidden'
    ];
  }, [status]);

  return (
    <div className={styles.status} style={{ borderColor: result[0] }}>
      <span className={styles.statusIcon} style={{ background: result[0] }}>
        {result[1]}
      </span>
      <span className={styles.statusText} style={{ color: result[0] }}>
        {result[2]}
      </span>
    </div>
  );
};

export default Index;
