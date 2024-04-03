import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Button,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Form
} from '@arco-design/web-react';
import useCheckBeforeRender from '$hooks/useCheckBeforeRender';
import { type Dnspod, DnspodAPI } from '$service/dnspod';
import { createMessageLoading, GlobalMessage } from '$utils/message';
import styles from './index.module.scss';
import { getDottedRoot } from '$utils/util';
import RecordLine from '$pages/manage/record';
import WaterFall from '$components/waterfall';
import {
  isEmailRecord,
  notExceptedSubDomain,
  recordListSorter
} from '$pages/manage/util';
import { IconLoading, IconRefresh } from '@arco-design/web-react/icon';
import useKeepOrderSet from '$hooks/useKeepOrderSet';
import cx from 'classnames';
import ButtonMine from '$components/button';

interface FormData {
  subDomain: string;
  recordType: string;
  line: string;

  recordValue: string;
  recordMX: number;
  recordTTL: number;
}

const ManagePage: React.FC = () => {
  const navigate = useNavigate();
  const [doCheck, Wrapper] = useCheckBeforeRender();
  const { domainName } = useParams();
  const [searchQuery, setSearchQuery] = useSearchParams();
  const [originRecordList, setOriginRecordList] =
    useState<Dnspod.RecordListItem[]>();
  const [subDomain, setSubDomain] = useState(
    searchQuery.get('subDomain') || ''
  );
  const [init, setInit] = useState(false);

  const recordList = useMemo<Dnspod.RecordListItem[]>(() => {
    if (subDomain === '') {
      return originRecordList || [];
    }
    let result: Dnspod.RecordListItem[] = [];
    if (originRecordList !== undefined) {
      if (subDomain === 'cufoon-newpod-mail-service') {
        for (const recordListItem of originRecordList) {
          if (
            isEmailRecord(
              recordListItem.Name,
              recordListItem.Type,
              recordListItem.Value
            )
          ) {
            result = result.concat([recordListItem]);
          }
        }
        return result;
      }
      if (subDomain === 'cufoon-newpod-cert-application') {
        for (const recordListItem of originRecordList) {
          const tmp = recordListItem.Name.split('.');
          if (tmp.length > 0 && tmp[0] === '_acme-challenge') {
            result = result.concat([recordListItem]);
          }
        }
        return result;
      }
      for (const recordListItem of originRecordList) {
        const tmp = recordListItem.Name.split('.');
        if (tmp.length > 0) {
          const tmpSubDomain = tmp[tmp.length - 1];
          if (
            tmpSubDomain === subDomain &&
            !isEmailRecord(
              tmpSubDomain,
              recordListItem.Type,
              recordListItem.Value
            ) &&
            notExceptedSubDomain(tmpSubDomain)
          ) {
            result = result.concat([recordListItem]);
          }
        }
      }
    }
    return result;
  }, [originRecordList, subDomain]);

  const subDomainList = useMemo(() => {
    let nowProcessedSubdomain: string[] = ['', '@'];
    let result: { label: string; value: string; disabled?: boolean }[] = [
      { label: '全部', value: '' },
      { label: '主域名', value: '@' },
      { label: '邮箱', value: 'cufoon-newpod-mail-service' },
      { label: '证书', value: 'cufoon-newpod-cert-application' }
    ];
    if (originRecordList === undefined) {
      return result.concat([
        { label: '子域名加载中...', value: '.', disabled: true }
      ]);
    }
    if (originRecordList.length > 0) {
      for (const item of originRecordList) {
        const root = getDottedRoot(item.Name);
        if (
          notExceptedSubDomain(root) &&
          nowProcessedSubdomain.indexOf(root) < 0
        ) {
          nowProcessedSubdomain = nowProcessedSubdomain.concat([root]);
          result = result.concat([{ label: root, value: root }]);
        }
      }
      const wwwIdx = result.findIndex((item) => item.value === 'www');
      if (wwwIdx > 2) {
        [result[2], result[wwwIdx]] = [result[wwwIdx], result[2]];
      }
    }
    return [
      ...result.slice(0, 3),
      ...result.slice(3).sort((a, b) => (a.value > b.value ? 1 : -1))
    ];
  }, [originRecordList]);

  useEffect(() => {
    doCheck(async () => {
      if (domainName) {
        return true;
      }
      navigate('/');
      return false;
    });
  }, [doCheck, domainName, navigate]);

  const getRecordList = useCallback(async () => {
    if (domainName) {
      const msl = createMessageLoading();
      msl.loading('加载解析记录');
      const [d, e] = await DnspodAPI.getRecordListOfDomain(domainName);
      if (e) {
        msl.error('加载失败');
        return;
      }
      if (d) {
        if (d.RecordList) {
          let tmp: Dnspod.RecordListItem[] = [];
          for (const recordListItem of d.RecordList) {
            if (recordListItem.Type === 'NS' && recordListItem.Name === '@') {
              continue;
            }
            tmp = tmp.concat([recordListItem]);
          }
          setOriginRecordList(tmp.sort(recordListSorter));
        } else {
          setOriginRecordList([]);
        }
        setInit(true);
        msl.hide();
        return;
      }
      msl.error('加载失败');
    }
  }, [domainName]);

  const getDomainInfo = useCallback(async () => {
    if (domainName) {
      const [d, e] = await DnspodAPI.getDomain({ Domain: domainName });
      if (e) {
        return;
      }
      if (d?.DomainInfo) {
        setAddModalFormData((prev) => ({
          ...prev,
          recordTTL: d.DomainInfo?.TTL || 600
        }));
      }
    }
  }, [domainName]);

  useEffect(() => {
    getRecordList();
  }, [getRecordList]);

  useEffect(() => {
    getDomainInfo();
  }, [getDomainInfo]);

  const [inRefresh, setInRefresh] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout>();
  const onRefresh = () => {
    if (timerIdRef.current !== undefined) {
      return;
    }
    setInRefresh(true);
    timerIdRef.current = setTimeout(async () => {
      await getRecordList();
      timerIdRef.current = undefined;
      setInRefresh(false);
    }, 20);
  };

  const changeSubdomain = useCallback(
    (value: string) => {
      setSubDomain(value);
      if (value === '') {
        setSearchQuery('');
        return;
      }
      setSearchQuery({ subDomain: value });
    },
    [setSearchQuery]
  );

  const setRecordStatus = useCallback(
    async (id: number, status: string) => {
      if (domainName) {
        const [d, e] = await DnspodAPI.setRecordStatus({
          Domain: domainName,
          RecordId: id,
          Status: status
        });
        if (e) {
          GlobalMessage.error(e);
          return;
        }
        if (d?.RequestId !== undefined && d?.RequestId !== null) {
          await getRecordList();
          GlobalMessage.success('状态修改成功');
          return;
        }
        GlobalMessage.error(d?.Error?.Message ?? '状态修改失败');
        return;
      }
      GlobalMessage.error('domainName为空！');
    },
    [domainName, getRecordList]
  );

  const deleteRecord = useCallback(
    async (id: number) => {
      if (domainName) {
        const [d, e] = await DnspodAPI.deleteRecord({
          Domain: domainName,
          RecordId: id
        });
        if (e) {
          GlobalMessage.error(e);
          return;
        }
        if (d?.RequestId !== undefined && d?.RequestId !== null) {
          await getRecordList();
          GlobalMessage.success('删除成功');
          return;
        }
        GlobalMessage.error(d?.Error?.Message ?? '删除失败');
        return;
      }
      GlobalMessage.error('domainName为空！');
    },
    [domainName, getRecordList]
  );

  const [recordToEdit, setRecordToEdit] = useState<Dnspod.RecordListItem>();

  const modifyRecord = useCallback(async (origin: Dnspod.RecordListItem) => {
    setRecordToEdit(origin);
    setModifyModalVisible(true);
  }, []);

  const [
    multiSelectedId,
    isMultiMode,
    { insert: multiAdd, delete: multiDelete, clear: clearMultiSelectedId }
  ] = useKeepOrderSet<number>();

  const [multiDeleteRecordLoading, setMultiDeleteRecordLoading] =
    useState(false);
  const [
    multiChangeRecordStateLoadingDisable,
    setMultiChangeRecordStateLoadingDisable
  ] = useState(false);
  const [
    multiChangeRecordStateLoadingEnable,
    setMultiChangeRecordStateLoadingEnable
  ] = useState(false);

  const multiDeleteRecord = async () => {
    const len = multiSelectedId.length;
    if (len > 0) {
      setMultiDeleteRecordLoading(true);
      for (let i = 0; i < len; i++) {
        const item = multiSelectedId[i];
        if (item !== undefined) {
          await deleteRecord(item);
        }
      }
      clearMultiSelectedId();
      setMultiDeleteRecordLoading(false);
    }
  };

  const multiChangeRecordStateDisable = async () => {
    const len = multiSelectedId.length;
    if (len > 0) {
      setMultiChangeRecordStateLoadingDisable(true);
      for (let i = 0; i < len; i++) {
        const item = multiSelectedId[i];
        if (item !== undefined) {
          await setRecordStatus(item, 'DISABLE');
        }
      }
      clearMultiSelectedId();
      setMultiChangeRecordStateLoadingDisable(false);
    }
  };

  const multiChangeRecordStateEnable = async () => {
    const len = multiSelectedId.length;
    if (len > 0) {
      setMultiChangeRecordStateLoadingEnable(true);
      for (let i = 0; i < len; i++) {
        const item = multiSelectedId[i];
        if (item !== undefined) {
          await setRecordStatus(item, 'ENABLE');
        }
      }
      clearMultiSelectedId();
      setMultiChangeRecordStateLoadingEnable(false);
    }
  };

  useEffect(() => {
    console.log('isMultiMode', isMultiMode, multiSelectedId);
  }, [isMultiMode, multiSelectedId]);

  const renderItem = useCallback(
    (item: Dnspod.RecordListItem) => {
      return (
        <div className={styles.listItem} key={item.RecordId}>
          <RecordLine
            data={item}
            multiAdd={multiAdd}
            multiDelete={multiDelete}
            setRecordStatus={setRecordStatus}
            deleteRecord={deleteRecord}
            modifyRecord={modifyRecord}
          />
        </div>
      );
    },
    [deleteRecord, modifyRecord, multiAdd, multiDelete, setRecordStatus]
  );

  const renderWaterFall = useMemo(
    () => (
      <WaterFall<Dnspod.RecordListItem>
        dataSource={recordList}
        render={renderItem}
      />
    ),
    [recordList, renderItem]
  );

  const [addForm] = Form.useForm<FormData>();
  const [addModalLoading, setAddModalLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalFormData, setAddModalFormData] = useState<FormData>({
    subDomain,
    recordType: 'A',
    line: '默认',
    recordMX: 10,
    recordTTL: 600,
    recordValue: ''
  });

  const onAddModalOK = async () => {
    try {
      const values = await addForm.validate();
      setAddModalLoading(true);
      if (domainName !== undefined) {
        const [d, e] = await DnspodAPI.addRecord({
          Domain: domainName,
          RecordType: values.recordType,
          RecordLine: values.line,
          Value: values.recordValue,
          SubDomain: values.subDomain,
          MX: values.recordMX,
          TTL: values.recordTTL
        });
        if (e) {
          GlobalMessage.error(e);
          setAddModalLoading(false);
          return;
        }
        if (d?.RecordId !== undefined && d?.RecordId !== null) {
          await getRecordList();
          GlobalMessage.success('添加成功');
          setAddModalVisible(false);
          setAddModalLoading(false);
          return;
        }
        GlobalMessage.error(d?.Error?.Message ?? '添加失败');
        setAddModalLoading(false);
        return;
      }
      setAddModalLoading(false);
      GlobalMessage.error('DomainName为空！');
      return;
    } catch (e) {
      return e;
    }
  };

  const [modifyForm] = Form.useForm<FormData>();
  const [modifyModalLoading, setModifyModalLoading] = useState(false);
  const [modifyModalVisible, setModifyModalVisible] = useState(false);

  const onModifyModalOK = async () => {
    try {
      const values = await modifyForm.validate();
      setModifyModalLoading(true);
      if (domainName !== undefined && recordToEdit !== undefined) {
        const [d, e] = await DnspodAPI.modifyRecord({
          Domain: domainName,
          RecordType: values.recordType,
          RecordLine: values.line,
          Value: values.recordValue,
          SubDomain: values.subDomain,
          MX: values.recordMX,
          TTL: values.recordTTL,
          RecordId: recordToEdit.RecordId
        });
        if (e) {
          GlobalMessage.error(e);
          setModifyModalLoading(false);
          return;
        }
        if (d?.RecordId !== undefined && d?.RecordId !== null) {
          await getRecordList();
          GlobalMessage.success('修改成功');
          setModifyModalVisible(false);
          setModifyModalLoading(false);
          return;
        }
        setModifyModalLoading(false);
        GlobalMessage.error(d?.Error?.Message ?? '修改失败');
        return;
      }
      setModifyModalLoading(false);
      GlobalMessage.error('DomainName或RecordToEdit为空！');
      return;
    } catch (e) {
      return e;
    }
  };

  const resetModifyForm = useCallback(() => {
    if (recordToEdit) {
      modifyForm.setFieldsValue({
        subDomain: recordToEdit.Name,
        recordType: recordToEdit.Type,
        line: '默认',
        recordMX: recordToEdit.MX,
        recordTTL: recordToEdit.TTL,
        recordValue: recordToEdit.Value
      });
    } else {
      modifyForm.clearFields();
    }
  }, [modifyForm, recordToEdit]);

  useEffect(() => {
    resetModifyForm();
  }, [recordToEdit, resetModifyForm]);

  useEffect(() => {
    if (
      init &&
      recordList.length === 0 &&
      subDomain !== '' &&
      subDomain !== '@' &&
      notExceptedSubDomain(subDomain)
    ) {
      changeSubdomain('');
    }
  }, [recordList, subDomain, init, changeSubdomain]);

  return (
    <Wrapper>
      <div className={styles.container}>
        <div className={styles.filterBar}>
          <div className={styles.filterLeft}>
            <Radio.Group
              className={styles.filterRadio}
              size='large'
              type='button'
              name='position'
              value={subDomain}
              onChange={changeSubdomain}
              options={subDomainList}
            />
          </div>
          <div className={styles.filterRight}>
            <Button type='primary' onClick={() => setAddModalVisible(true)}>
              添加解析记录
            </Button>
            <div className={styles.filterRefresh} onClick={onRefresh}>
              {(inRefresh && <IconLoading />) || <IconRefresh />}
            </div>
          </div>
        </div>
        {renderWaterFall}
        <div
          className={cx(
            styles.multiWrapper,
            isMultiMode && styles.multiWrapperDisplay
          )}
        >
          <div className={cx(styles.multi, isMultiMode && styles.multiDisplay)}>
            <div className={styles.multiItem}>
              <Popconfirm
                title='删除解析记录'
                content='确定要批量删除记录吗？'
                onOk={() => {
                  multiDeleteRecord();
                }}
              >
                <ButtonMine
                  loading={multiDeleteRecordLoading}
                  color={'hsl(0, 38%, 60%)'}
                >
                  删除
                </ButtonMine>
              </Popconfirm>
            </div>
            <div className={styles.multiItem}>
              <Popconfirm
                title={'暂停解析'}
                content={'确定要进行此批量暂停解析操作吗？'}
                onOk={() => {
                  multiChangeRecordStateDisable();
                }}
              >
                <ButtonMine
                  loading={multiChangeRecordStateLoadingDisable}
                  color={'hsl(39, 38%, 60%)'}
                >
                  {'暂停解析'}
                </ButtonMine>
              </Popconfirm>
            </div>
            <div className={styles.multiItem}>
              <Popconfirm
                title={'继续解析'}
                content={'确定要进行此批量继续解析操作吗？'}
                onOk={() => {
                  multiChangeRecordStateEnable();
                }}
              >
                <ButtonMine
                  loading={multiChangeRecordStateLoadingEnable}
                  color={'hsl(120, 38%, 60%)'}
                >
                  {'继续解析'}
                </ButtonMine>
              </Popconfirm>
            </div>
          </div>
          <Modal
            title='添加解析记录'
            visible={addModalVisible}
            onOk={onAddModalOK}
            confirmLoading={addModalLoading}
            onCancel={() => setAddModalVisible(false)}
          >
            <Form
              form={addForm}
              disabled={addModalLoading}
              initialValues={addModalFormData}
              onValuesChange={(a) => {
                setAddModalFormData((prev) => ({
                  ...prev,
                  ...a
                }));
              }}
              labelCol={{
                span: 4,
                style: { flexBasis: 90 }
              }}
              wrapperCol={{
                span: 20,
                style: { flexBasis: 'calc(100% - 90px)' }
              }}
            >
              <Form.Item
                label='主机记录'
                field='subDomain'
                rules={[{ required: true }]}
              >
                <Input placeholder='' defaultValue={subDomain} />
              </Form.Item>
              <Form.Item
                label='记录类型'
                required
                field='recordType'
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    'A',
                    'AAAA',
                    'CNAME',
                    'TXT',
                    'MX',
                    'CAA',
                    'NS',
                    'HTTPS',
                    'SRV',
                    'SPF',
                    'SVCB'
                  ]}
                />
              </Form.Item>
              <Form.Item
                label='线路'
                disabled
                required
                field='line'
                rules={[{ required: true }]}
              >
                <Select options={['默认']} />
              </Form.Item>
              <Form.Item
                label='记录值'
                field='recordValue'
                rules={[{ required: true }]}
              >
                <Input placeholder='' />
              </Form.Item>
              <Form.Item noStyle shouldUpdate>
                {(values) => {
                  return ['MX', 'HTTPS'].indexOf(values.recordType) > -1 ? (
                    <Form.Item
                      label='优先级'
                      field='recordMX'
                      rules={[{ required: true }]}
                    >
                      <InputNumber precision={0} hideControl />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>
              <Form.Item
                label='TTL'
                field='recordTTL'
                rules={[{ required: true }]}
              >
                <InputNumber precision={0} hideControl />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title='修改解析记录'
            visible={modifyModalVisible}
            onOk={onModifyModalOK}
            confirmLoading={modifyModalLoading}
            onCancel={() => setModifyModalVisible(false)}
          >
            <Form
              form={modifyForm}
              disabled={modifyModalLoading}
              labelCol={{
                span: 4,
                style: { flexBasis: 90 }
              }}
              wrapperCol={{
                span: 20,
                style: { flexBasis: 'calc(100% - 90px)' }
              }}
            >
              <Form.Item
                label='主机记录'
                field='subDomain'
                rules={[{ required: true }]}
              >
                <Input placeholder='' defaultValue={subDomain} />
              </Form.Item>
              <Form.Item
                label='记录类型'
                required
                field='recordType'
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    'A',
                    'AAAA',
                    'CNAME',
                    'TXT',
                    'MX',
                    'CAA',
                    'NS',
                    'HTTPS',
                    'SRV',
                    'SPF',
                    'SVCB'
                  ]}
                />
              </Form.Item>
              <Form.Item
                label='线路'
                disabled
                required
                field='line'
                rules={[{ required: true }]}
              >
                <Select options={['默认']} />
              </Form.Item>
              <Form.Item
                label='记录值'
                field='recordValue'
                rules={[{ required: true }]}
              >
                <Input placeholder='' />
              </Form.Item>
              <Form.Item noStyle shouldUpdate>
                {(values) => {
                  return ['MX', 'HTTPS'].indexOf(values.recordType) > -1 ? (
                    <Form.Item
                      label='优先级'
                      field='recordMX'
                      rules={[{ required: true }]}
                    >
                      <InputNumber precision={0} hideControl />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>
              <Form.Item
                label='TTL'
                field='recordTTL'
                rules={[{ required: true }]}
              >
                <InputNumber precision={0} hideControl />
              </Form.Item>
            </Form>
            <Button type='default' onClick={resetModifyForm}>
              重置
            </Button>
          </Modal>
        </div>
      </div>
    </Wrapper>
  );
};
export default ManagePage;
