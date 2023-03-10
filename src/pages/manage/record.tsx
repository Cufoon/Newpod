import type { Dnspod } from '$service/dnspod';
import Status from '$components/status';
import InfoLine from './info-line';
import styles from './record.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Popconfirm } from '@arco-design/web-react';
import Button from '$components/button';
import { useRef, useState } from 'react';

interface Props {
  data: Dnspod.RecordListItem;
  setRecordStatus: (id: number, status: string) => Promise<any>;
  modifyRecord: (origin: Dnspod.RecordListItem) => Promise<any>;
  deleteRecord: (id: number) => Promise<any>;
}

const RecordLine: React.FC<Props> = ({ data, setRecordStatus, modifyRecord, deleteRecord }) => {
  const [checked, setChecked] = useState(false);
  const [changeStatusLoading, setChangeStatusLoading] = useState(false);
  const [deleteRecordLoading, setDeleteRecordLoading] = useState(false);

  const timerIdRef = useRef<NodeJS.Timeout>();
  const onChangeStatus = async () => {
    if (timerIdRef.current !== undefined) {
      return;
    }
    setChangeStatusLoading(true);
    const nextStatus = data.Status === 'ENABLE' ? 'DISABLE' : 'ENABLE';
    timerIdRef.current = setTimeout(async () => {
      await setRecordStatus(data.RecordId, nextStatus);
      timerIdRef.current = undefined;
      setChangeStatusLoading(false);
      setDeleteRecordLoading(false);
    }, 20);
  };

  const onModifyRecord = async () => {
    await modifyRecord(data);
  };

  const onDeleteRecord = async () => {
    if (timerIdRef.current !== undefined) {
      return;
    }
    setDeleteRecordLoading(true);
    timerIdRef.current = setTimeout(async () => {
      await deleteRecord(data.RecordId);
      timerIdRef.current = undefined;
      setChangeStatusLoading(false);
      setDeleteRecordLoading(false);
    }, 20);
  };

  return (
    <div
      className={styles.record}
      style={{ borderColor: checked ? 'rgb(22, 93, 255)' : undefined }}
    >
      <div className={styles.recordHeader}>
        <span>{data.Name}</span>
        <span>{data.Type}</span>
      </div>
      <div className={styles.recordBody}>
        <div className={styles.recordBodyValue}>
          <div className={styles.recordBodyValueWrapper}>
            <div className={styles.recordBodyValueHeader}>?????????</div>
            <div className={styles.recordBodyValueBody}>{data.Value}</div>
            <div className={styles.recordBodyValueLook}>
              <div
                className={styles.recordBodyValueLookButton}
                onClick={() => {
                  Modal.info({
                    icon: null,
                    title: '???????????????',
                    content: <div className={styles.recordBodyValueBody}>{data.Value}</div>
                  });
                }}
              >
                ????????????
              </div>
            </div>
          </div>
        </div>
        <div className={styles.recordBodyStatus}>
          <div className={styles.recordBodyStatusItem}>
            <Status status={data.Status} />
          </div>
          {data.Weight && (
            <div className={styles.recordBodyStatusItem}>
              <InfoLine
                icon={
                  <FontAwesomeIcon style={{ fontSize: '16px' }} icon={['fas', 'scale-balanced']} />
                }
                content={`?????? ${data.Weight}%`}
                color={'hsl(255,38%,65%)'}
              />
            </div>
          )}
          {data.MX && data.MX !== 0 ? (
            <div className={styles.recordBodyStatusItem}>
              <InfoLine
                icon={<FontAwesomeIcon style={{ fontSize: '16px' }} icon={['fas', 'trophy']} />}
                content={`????????? ${data.MX}`}
                color={'hsl(255,38%,65%)'}
              />
            </div>
          ) : null}
          <div className={styles.recordBodyStatusItem}>
            <InfoLine
              icon={<FontAwesomeIcon icon={['fas', 'circle-arrow-down']} />}
              content={`${data.TTL}???`}
              color={'hsl(255,38%,65%)'}
            />
          </div>
          <div className={styles.recordBodyStatusItem}>
            <InfoLine
              icon={<FontAwesomeIcon icon={['fas', 'clock']} />}
              content={data.UpdatedOn}
              color={'hsl(219,38%,65%)'}
            />
          </div>
        </div>
      </div>
      <div className={styles.recordFooter}>
        <div className={styles.recordFooterLeft}>
          <div
            className={styles.recordFooterCheck}
            style={{ color: checked ? 'rgb(22, 93, 255)' : undefined }}
            onClick={() => setChecked((prev) => !prev)}
          >
            <FontAwesomeIcon icon={checked ? ['fas', 'square-check'] : ['far', 'square']} />
          </div>
        </div>
        <div className={styles.recordFooterRight}>
          <div className={styles.recordFooterItem}>
            <Popconfirm
              title='??????????????????'
              content='?????????????????????'
              onOk={() => {
                onDeleteRecord();
              }}
            >
              <Button loading={deleteRecordLoading} color={'hsl(0, 38%, 60%)'}>
                ??????
              </Button>
            </Popconfirm>
          </div>
          <div className={styles.recordFooterItem}>
            <Popconfirm
              title={data.Status === 'ENABLE' ? '????????????' : '????????????'}
              content={'??????????????????????????????'}
              onOk={() => {
                onChangeStatus();
              }}
            >
              <Button
                loading={changeStatusLoading}
                color={data.Status === 'ENABLE' ? 'hsl(39, 38%, 60%)' : 'hsl(120, 38%, 60%)'}
              >
                {data.Status === 'ENABLE' ? '????????????' : '????????????'}
              </Button>
            </Popconfirm>
          </div>
          <div className={styles.recordFooterItem}>
            <Button onClick={() => onModifyRecord()}>??????</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecordLine;
