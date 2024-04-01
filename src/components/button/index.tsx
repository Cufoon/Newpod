import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.scss';

interface Props {
  color?: string;
  children?: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  loading?: boolean;
}

const Index: React.FC<Props> = ({
  color = 'rgb(22, 93, 255)',
  children,
  onClick,
  loading = false
}) => {
  const click = (event: React.MouseEvent<HTMLDivElement>) => {
    if (loading) {
      return;
    }
    onClick?.(event);
  };

  return (
    <div
      onClick={click}
      className={styles.wrapper}
      style={{ color: color, borderColor: color }}
    >
      {loading && (
        <FontAwesomeIcon
          className={styles.rotateIcon}
          icon={['fas', 'spinner']}
        />
      )}
      {children}
    </div>
  );
};

export default Index;
