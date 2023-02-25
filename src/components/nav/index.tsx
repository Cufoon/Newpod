import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Popconfirm } from '@arco-design/web-react';
import { IconSettings } from '@arco-design/web-react/icon';
import { clearAccounts } from '$service/account';
import { createMessageLoading } from '$utils/message';
import { delay } from '$utils/util';
import styles from './index.scss';

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const onClearAccounts = async () => {
    const msl = createMessageLoading(500);
    msl.loading('清除中');
    const isCleared = await clearAccounts();
    if (isCleared) {
      msl.success('清除成功！');
      await delay(200);
      navigate('/setting');
      return;
    }
    msl.error('清除失败！');
  };
  return (
    <header className={styles.appHeader}>
      <div className={styles.appHeaderContainer}>
        <div
          className={styles.appHeaderLogo}
          onClick={() => {
            navigate('/');
          }}
        >
          Newpod
        </div>
        <div className={styles.appHeaderSetting} onClick={() => setVisible(true)}>
          <IconSettings style={{ fontSize: '24px' }} />
        </div>
      </div>
      <Modal
        title='设置'
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        okText='确认'
        cancelText='取消'
        autoFocus={false}
        focusLock={true}
      >
        <Popconfirm
          focusLock
          title='确认要清空所有本地保存的账户吗？'
          onOk={() => onClearAccounts()}
        >
          <Button type='default' status='danger'>
            清除所有账户
          </Button>
        </Popconfirm>
      </Modal>
    </header>
  );
};

export default Nav;
