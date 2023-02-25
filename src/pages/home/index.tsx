import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, List } from '@arco-design/web-react';
import { type Dnspod, DnspodAPI } from '$service/dnspod';
import { createMessageLoading } from '$utils/message';
import InfoLine from './info-line';
import Status from '$components/status';
import styles from './index.scss';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [domainCountInfo, setDomainCountInfo] = useState<Dnspod.DomainCountInfo>();
  const [domainList, setDomainList] = useState<Dnspod.DomainListItem[]>([]);
  const getDomainList = async () => {
    const msl = createMessageLoading();
    msl.loading('加载账户下域名...');
    const [d, e] = await DnspodAPI.getDomainList();
    if (e) {
      msl.error(e);
      return;
    }
    if (d) {
      setDomainCountInfo(d.DomainCountInfo);
      setDomainList(d.DomainList || []);
      msl.hide();
      return;
    }
    msl.error('请求出错');
  };

  useEffect(() => {
    getDomainList();
  }, []);

  useEffect(() => {
    console.log('domainCountInfo', domainCountInfo);
  }, [domainCountInfo]);

  return (
    <div className={styles.homeContainer}>
      <List
        className={styles.homeList}
        throttleDelay={300}
        size='large'
        dataSource={domainList}
        grid={{
          justify: 'center',
          align: 'center',
          xs: 24,
          sm: 12,
          md: 12,
          lg: 8,
          xl: 6,
          xxl: 4
        }}
        render={(item, index) => {
          return (
            <div
              key={index}
              className={styles.homeListItem}
              onClick={() => {
                navigate(`/manage/${item.Name}/record`);
              }}
            >
              <div className={styles.homeListItemContent}>
                <div className={styles.homeDomainNameLine}>
                  <div className={styles.homeDomainName}>{item.Name}</div>
                  <Image
                    className={styles.homeDomainLogo}
                    width={32}
                    height={32}
                    src={`https://${item.Name}/favicon-32x32.png`}
                    error={
                      <img
                        style={{ background: '#000', borderRadius: '100%' }}
                        width={32}
                        height={32}
                        src='/favicon-32x32.png'
                        alt='favicon'
                      />
                    }
                  />
                </div>
                <InfoLine title={'Punycode'} content={item.Punycode} />
                <InfoLine title={'NS状态'} content={(item.DNSStatus && '状态错误') || '状态正常'} />
                {item.EffectiveDNS.map((ii, idx) => {
                  return <InfoLine key={ii} title={`DNS服务器${idx + 1}`} content={ii} />;
                })}
                <InfoLine title={'记录总数'} content={item.RecordCount} />
                <InfoLine title={'最后更新时间'} content={item.UpdatedOn} />
                <div style={{ width: '100%', color: 'rgb(136, 136, 136)' }}>{`备注：${
                  item.Remark || '你没有留备注'
                }`}</div>
                <div className={styles.homeDomainStatusLine}>
                  <Status status={item.Status} />
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default HomePage;
