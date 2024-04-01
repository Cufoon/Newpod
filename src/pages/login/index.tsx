import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import Button from '@arco-design/web-react/es/Button';
import Form from '@arco-design/web-react/es/Form';
import Input from '@arco-design/web-react/es/Input';
import { IconLock, IconTag, IconUser } from '@arco-design/web-react/icon';
import Footer from '$components/footer';
import {
  addAccount,
  getCurrentAccount,
  setCurrentAccountWithoutStore
} from '$service/account';
import { DnspodAPI } from '$service/dnspod';
import { createMessageLoading, GlobalMessage } from '$utils/message';
import { delay, getRandomStr } from '$utils/util';
import styles from './index.module.scss';

interface UserFormData {
  userMark: string;
  userId: string;
  userKey: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<UserFormData>();

  const onFinish = async (values: UserFormData) => {
    const msl = createMessageLoading();
    msl.loading('检测中');
    const newAccount = {
      mark: getRandomStr(5),
      id: values.userId,
      key: values.userKey,
      localId: uuidV4()
    };
    setCurrentAccountWithoutStore(newAccount);
    const [data, err] = await DnspodAPI.getDomainList();
    if (err) {
      msl.error(err);
      return;
    }
    if (data) {
      if (data.Error) {
        msl.error('你的id和密钥似乎不正确!');
        return;
      }
      const isAdded = await addAccount(newAccount);
      if (isAdded) {
        msl.success('配置成功！');
        await delay(500);
        msl.hide();
        navigate('/');
        return;
      }
    }
    msl.error('配置错误');
  };

  useEffect(() => {
    (async () => {
      const currentAccount = await getCurrentAccount();
      if (currentAccount) {
        GlobalMessage.info('你本地已有账户');
        navigate('/');
      }
    })();
  }, [navigate]);

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.titleLine}>
          <div className={styles.icon} />
          <div className={styles.title}>Newpod</div>
        </div>
        <div className={styles.titleHint}>
          红豆生南国，春来发几枝。愿君多采撷，此物最相思。
        </div>
        <Form
          form={form}
          className={styles.form}
          size='large'
          layout='vertical'
          onSubmit={onFinish}
        >
          <Form.Item field='userMark' className={styles.formItem}>
            <Input
              prefix={<IconTag />}
              className={styles.formInput}
              placeholder='账户备注(为空则随机生成)'
            />
          </Form.Item>
          <Form.Item
            field='userId'
            rules={[
              {
                required: true,
                message: '请输入你的SecretId!'
              }
            ]}
            className={styles.formItem}
          >
            <Input
              prefix={<IconUser />}
              autoComplete='username'
              className={styles.formInput}
              placeholder='SecretId'
            />
          </Form.Item>
          <Form.Item
            field='userKey'
            rules={[
              {
                required: true,
                message: '请输入你的SecretKey!'
              }
            ]}
            className={styles.formItem}
          >
            <Input
              prefix={<IconLock />}
              className={styles.formInput}
              autoComplete='password'
              type='password'
              placeholder='SecretKey'
            />
          </Form.Item>
          <Form.Item className={styles.formItem}>
            <Button
              type='primary'
              htmlType='submit'
              className={styles.formSubmit}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer middle />
    </div>
  );
};

export default LoginPage;
