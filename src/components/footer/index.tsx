import styles from './index.scss';

const middleDescription: React.CSSProperties = {
  textAlign: 'center'
};

const middleCopyright: React.CSSProperties = {
  justifyContent: 'center'
};

const Footer: React.FC<{ middle?: boolean }> = ({ middle }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerDescription} style={middle ? middleDescription : undefined}>
        A way to manage your dnspod.
      </div>
      <div className={styles.footerCopyrightContainer} style={middle ? middleCopyright : undefined}>
        <div className={styles.footerName}>Newpod</div>
        <div className={styles.footerCopyright}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 800 800'>
            <path
              d='M530 310C160 50 160 750 530 490'
              fill='none'
              stroke='#fff'
              strokeWidth='100'
              strokeLinecap='round'
            />
            <circle cx='400' cy='400' r='320' fill='none' stroke='#fff' strokeWidth='80' />
          </svg>
        </div>
        <div className={styles.footerLin}>Cufoon</div>
      </div>
    </footer>
  );
};

export default Footer;
