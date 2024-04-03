import styles from './info-line.module.scss';

interface Props {
  icon: string | number | React.JSX.Element;
  content: string | number | React.JSX.Element;
  color: string;
}

const Index: React.FC<Props> = ({ icon, content, color }) => {
  return (
    <div className={styles.infoLine} style={{ borderColor: color }}>
      <span className={styles.infoLineIcon} style={{ background: color }}>
        {icon}
      </span>
      <span className={styles.infoLineText} style={{ color: color }}>
        {content}
      </span>
    </div>
  );
};

export default Index;
