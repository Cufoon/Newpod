import styles from './info-line.scss';

interface Props {
  title: string | number | JSX.Element;
  content: string | number | JSX.Element;
}

const Index: React.FC<Props> = ({ title, content }) => {
  return (
    <div className={styles.infoLine}>
      <span className={styles.infoLineTitle}>{title}</span>
      <span className={styles.infoLineContent}>{content}</span>
    </div>
  );
};

export default Index;
