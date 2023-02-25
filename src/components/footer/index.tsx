import styles from './index.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerDescription}>A way to manage your dnspod.</div>
      <div className={styles.footerCopyrightContainer}>
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
        <div className={styles.footerLin1}>
          <div className={styles.footerLin1Icon}></div>
        </div>
        <div className={styles.footerLin2}>
          <div className={styles.footerLin2Icon}></div>
        </div>
        <div className={styles.footerLin3}>
          <div className={styles.footerLin3Icon}></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
