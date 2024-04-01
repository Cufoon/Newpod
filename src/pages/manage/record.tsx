import React, { useRef, useState } from 'react';
import cx from 'classnames';
import Modal from '@arco-design/web-react/es/Modal';
import PopConfirm from '@arco-design/web-react/es/Popconfirm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '$components/button';
import Status from '$components/status';
import InfoLine from './info-line';
import styles from './record.module.scss';

import type { Dnspod } from '$service/dnspod';

interface Props {
  data: Dnspod.RecordListItem;
  multiAdd: (v: number) => void;
  multiDelete: (v: number) => void;
  setRecordStatus: (id: number, status: string) => Promise<unknown>;
  modifyRecord: (origin: Dnspod.RecordListItem) => Promise<unknown>;
  deleteRecord: (id: number) => Promise<unknown>;
}

const RecordLine: React.FC<Props> = ({
  data,
  multiAdd,
  multiDelete,
  setRecordStatus,
  modifyRecord,
  deleteRecord
}) => {
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
            <div className={styles.recordBodyValueHeader}>记录值</div>
            <div className={styles.recordBodyValueBody}>{data.Value}</div>
            <div className={styles.recordBodyValueLook}>
              <div
                className={styles.recordBodyValueLookButton}
                onClick={() => {
                  Modal.info({
                    icon: null,
                    title: '记录值详情',
                    content: (
                      <div className={styles.recordBodyValueBody}>
                        {data.Value}
                      </div>
                    )
                  });
                }}
              >
                查看详情
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
                  <FontAwesomeIcon
                    style={{ fontSize: '16px' }}
                    icon={['fas', 'scale-balanced']}
                  />
                }
                content={`权重 ${data.Weight}%`}
                color={'hsl(255,38%,65%)'}
              />
            </div>
          )}
          {data.MX && data.MX !== 0 ? (
            <div className={styles.recordBodyStatusItem}>
              <InfoLine
                icon={
                  <FontAwesomeIcon
                    style={{ fontSize: '16px' }}
                    icon={['fas', 'trophy']}
                  />
                }
                content={`优先级 ${data.MX}`}
                color={'hsl(255,38%,65%)'}
              />
            </div>
          ) : null}
          <div className={styles.recordBodyStatusItem}>
            <InfoLine
              icon={<FontAwesomeIcon icon={['fas', 'circle-arrow-down']} />}
              content={`${data.TTL}秒`}
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
            onClick={() => {
              if (checked) {
                multiDelete(data.RecordId);
              } else {
                multiAdd(data.RecordId);
              }
              setChecked((prev) => {
                return !prev;
              });
            }}
          >
            <FontAwesomeIcon
              icon={checked ? ['fas', 'square-check'] : ['far', 'square']}
            />
          </div>
        </div>
        <div
          className={cx(
            styles.recordFooterRight,
            checked && styles.recordFooterRightChecked
          )}
        >
          <div className={styles.recordFooterItem}>
            <PopConfirm
              disabled={checked}
              title='删除解析记录'
              content='确定要删除吗？'
              onOk={() => onDeleteRecord()}
            >
              <Button loading={deleteRecordLoading} color={'hsl(0, 38%, 60%)'}>
                删除
              </Button>
            </PopConfirm>
          </div>
          <div className={styles.recordFooterItem}>
            <PopConfirm
              disabled={checked}
              title={data.Status === 'ENABLE' ? '暂停解析' : '继续解析'}
              content={'确定要进行此操作吗？'}
              onOk={() => onChangeStatus()}
            >
              <Button
                loading={changeStatusLoading}
                color={
                  data.Status === 'ENABLE'
                    ? 'hsl(39, 38%, 60%)'
                    : 'hsl(120, 38%, 60%)'
                }
              >
                {data.Status === 'ENABLE' ? '暂停解析' : '继续解析'}
              </Button>
            </PopConfirm>
          </div>
          <div className={styles.recordFooterItem}>
            <Button onClick={() => !checked && onModifyRecord()}>修改</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecordLine;
