import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Form, Input, InputNumber, Modal, Radio, Select } from '@arco-design/web-react';
import useCheckBeforeRender from '$hooks/useCheckBeforeRender';
import { type Dnspod, DnspodAPI } from '$service/dnspod';
import { createMessageLoading, GlobalMessage } from '$utils/message';
import styles from './index.scss';
import { getDottedRoot } from '$utils/util';
import RecordLine from '$pages/manage/record';
import WaterFall from '$components/waterfall';
import { recordListSorter } from '$pages/manage/util';
import { IconLoading, IconRefresh } from '@arco-design/web-react/icon';

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
  const [originRecordList, setOriginRecordList] = useState<Dnspod.RecordListItem[]>();
  const [subDomain, setSubDomain] = useState(searchQuery.get('subDomain') || '');
  const [init, setInit] = useState(false);

  const recordList = useMemo<Dnspod.RecordListItem[]>(() => {
    if (subDomain === '') {
      return originRecordList || [];
    }
    let result: Dnspod.RecordListItem[] = [];
    if (originRecordList !== undefined) {
      for (const recordListItem of originRecordList) {
        const tmp = recordListItem.Name.split('.');
        if (tmp.length > 0 && tmp[tmp.length - 1] === subDomain) {
          result = result.concat([recordListItem]);
        }
      }
    }
    return result;
  }, [originRecordList, subDomain]);

  useEffect(() => {
    if (init && recordList.length === 0 && subDomain !== '') {
      changeSubdomain('');
    }
  }, [recordList, subDomain, init]);

  const subDomainList = useMemo(() => {
    let nowProcessedSubdomain: string[] = ['', '@'];
    let result: { label: string; value: string; disabled?: boolean }[] = [
      { label: '全部', value: '' },
      { label: '主域名', value: '@' }
    ];
    if (originRecordList === undefined) {
      return result.concat([{ label: '子域名加载中...', value: '.', disabled: true }]);
    }
    if (originRecordList.length > 0) {
      for (const item of originRecordList) {
        const root = getDottedRoot(item.Name);
        if (nowProcessedSubdomain.indexOf(root) < 0) {
          nowProcessedSubdomain = nowProcessedSubdomain.concat([root]);
          result = result.concat([{ label: root, value: root }]);
        }
      }
      const wwwIdx = result.findIndex((item) => item.value === 'www');
      if (wwwIdx > 2) {
        [result[2], result[wwwIdx]] = [result[wwwIdx] as any, result[2] as any];
      }
    }
    return [...result.slice(0, 3), ...result.slice(3).sort((a, b) => (a.value > b.value ? 1 : -1))];
  }, [originRecordList]);

  useEffect(() => {
    doCheck(async () => {
      if (domainName) {
        return true;
      }
      navigate('/');
      return false;
    });
  }, []);

  const getRecordList = async () => {
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
  };

  const getDomainInfo = async () => {
    if (domainName) {
      const [d, e] = await DnspodAPI.getDomain({ Domain: domainName });
      if (e) {
        return;
      }
      if (d?.DomainInfo) {
        setAddModalFormData((prev: any) => ({ ...prev, recordTTL: d.DomainInfo?.TTL || 600 }));
      }
    }
  };

  useEffect(() => {
    getRecordList();
  }, []);

  useEffect(() => {
    getDomainInfo();
  }, []);

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

  const changeSubdomain = useCallback((value: string) => {
    setSubDomain(value);
    if (value === '') {
      setSearchQuery('');
      return;
    }
    setSearchQuery({ subDomain: value });
  }, []);

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
        GlobalMessage.error(d?.Error.Message ?? '状态修改失败');
        return;
      }
      GlobalMessage.error('domainName为空！');
    },
    [domainName]
  );

  const deleteRecord = useCallback(
    async (id: number) => {
      if (domainName) {
        const [d, e] = await DnspodAPI.deleteRecord({ Domain: domainName, RecordId: id });
        if (e) {
          GlobalMessage.error(e);
          return;
        }
        if (d?.RequestId !== undefined && d?.RequestId !== null) {
          await getRecordList();
          GlobalMessage.success('删除成功');
          return;
        }
        GlobalMessage.error(d?.Error.Message ?? '删除失败');
        return;
      }
      GlobalMessage.error('domainName为空！');
    },
    [domainName]
  );

  const [recordToEdit, setRecordToEdit] = useState<Dnspod.RecordListItem>();

  const modifyRecord = useCallback(async (origin: Dnspod.RecordListItem) => {
    setRecordToEdit(origin);
    setModifyModalVisible(true);
  }, []);

  const renderItem = useCallback((item: Dnspod.RecordListItem) => {
    return (
      <div className={styles.listItem} key={item.RecordId}>
        <RecordLine
          data={item}
          setRecordStatus={setRecordStatus}
          deleteRecord={deleteRecord}
          modifyRecord={modifyRecord}
        />
      </div>
    );
  }, []);

  const renderWaterFall = useMemo(
    () => <WaterFall<Dnspod.RecordListItem> dataSource={recordList} render={renderItem} />,
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
        GlobalMessage.error(d?.Error.Message ?? '添加失败');
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
        GlobalMessage.error(d?.Error.Message ?? '修改失败');
        return;
      }
      setModifyModalLoading(false);
      GlobalMessage.error('DomainName或RecordToEdit为空！');
      return;
    } catch (e) {
      return e;
    }
  };

  const resetModifyForm = () => {
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
  };

  useEffect(() => {
    resetModifyForm();
  }, [recordToEdit]);

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
              setAddModalFormData((prev: any) => ({ ...prev, ...a }));
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
            <Form.Item label='主机记录' field='subDomain' rules={[{ required: true }]}>
              <Input placeholder='' defaultValue={subDomain} />
            </Form.Item>
            <Form.Item label='记录类型' required field='recordType' rules={[{ required: true }]}>
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
            <Form.Item label='线路' disabled required field='line' rules={[{ required: true }]}>
              <Select options={['默认']} />
            </Form.Item>
            <Form.Item label='记录值' field='recordValue' rules={[{ required: true }]}>
              <Input placeholder='' />
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
              {(values) => {
                return ['MX', 'HTTPS'].indexOf(values.recordType) > -1 ? (
                  <Form.Item label='优先级' field='recordMX' rules={[{ required: true }]}>
                    <InputNumber precision={0} hideControl />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
            <Form.Item label='TTL' field='recordTTL' rules={[{ required: true }]}>
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
            <Form.Item label='主机记录' field='subDomain' rules={[{ required: true }]}>
              <Input placeholder='' defaultValue={subDomain} />
            </Form.Item>
            <Form.Item label='记录类型' required field='recordType' rules={[{ required: true }]}>
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
            <Form.Item label='线路' disabled required field='line' rules={[{ required: true }]}>
              <Select options={['默认']} />
            </Form.Item>
            <Form.Item label='记录值' field='recordValue' rules={[{ required: true }]}>
              <Input placeholder='' />
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
              {(values) => {
                return ['MX', 'HTTPS'].indexOf(values.recordType) > -1 ? (
                  <Form.Item label='优先级' field='recordMX' rules={[{ required: true }]}>
                    <InputNumber precision={0} hideControl />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
            <Form.Item label='TTL' field='recordTTL' rules={[{ required: true }]}>
              <InputNumber precision={0} hideControl />
            </Form.Item>
          </Form>
          <Button type='default' onClick={resetModifyForm}>
            重置
          </Button>
        </Modal>
      </div>
    </Wrapper>
  );
};
export default ManagePage;
