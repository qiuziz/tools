/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import React, { ReactText, useEffect, useState } from 'react';
import { Button, Input, Switch, Table, Tooltip, message, Modal } from 'antd';
import './index.less';
import QRCode from 'qrcode.react';
import { ColumnItemType, UpdateStoreFn } from './type';
import CopyToClipboard from 'react-copy-to-clipboard';
import { existRedis, handleJsonStr, openDB, readStore, removeStore, setRedis, updateStore, isJson } from 'utils';
import { DeleteOutlined, RightCircleOutlined } from '@ant-design/icons';
import qs from 'qs';
import { SearchBox } from 'components';
import { CONDITIONS } from './constant';
import ParseImg from './parse-img';

let urlStore: {
    getAllData: () => Promise<any>;
    update: UpdateStoreFn;
    remove: (key: ReactText) => Promise<unknown>;
  },
  partStore: { update: UpdateStoreFn };

// 去除字符串中的所有空格
const trim = (str: string) => str.replace(/\s*/g, '');

/**
 * 将需要编码的url进行分段编码展示，可以针对某部分进行编码以及二次编码操作
 */
export default function Qrcode() {
  // 表格数据
  const [dataSource, setDataSource] = useState<any[]>([]);

  // 段数据，用来表示分段
  const [part, setPart] = useState<any[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);

  const [modalVisiable, setModalVisiable] = useState({});

  const [fileName, setFileName] = useState(localStorage.getItem('KEY') || '');

  /**
   * 打开数据库
   */
  useEffect(() => {
    getDataFromIndexedDB();
  }, []);

  /**
   * 从indexed获取数据
   * @param data
   */
  const getDataFromIndexedDB = () => {
    openDB({
      dbName: 'tools_qrcode',
      storeName: ['url_table', 'part_table'],
      storeOption: { keyPath: 'key' }
    }).then((db: IDBDatabase) => {
      // 读取url_table数据
      const getAllData = async () => {
        const list = await readStore({ db, storeName: 'url_table', type: 'getAll' });
        return list.sort((a: any, b: any) => b.key - a.key);
      };
      getAllData().then((res: any = {}) => {
        setDataSource(res);
      });
      // 读取part_table数据
      readStore({ db, storeName: 'part_table', key: 0 }).then((res: any = {}) => {
        const { data = [0, 1, 2] } = res;
        setPart(data);
      });
      // 提供全局操作对象
      urlStore = {
        getAllData,
        remove: (key: ReactText) => removeStore({ db, storeName: 'url_table', key }),
        update: (data: any) => updateStore({ db, storeName: 'url_table', data })
      };
      partStore = {
        update: (data: any) => updateStore({ db, storeName: 'part_table', data })
      };
    });
  };

  /**
   * 修改dataSource 同时更新数据库记录
   * @param data
   */
  const changeDataSoure = (data: any) => {
    setDataSource(data);
    data.forEach((item: any) => {
      urlStore.update(item);
    });
  };

  /**
   * 文本框输入事件
   * @param row 当前行数据
   * @param key 当前输入的端
   * @param rowIndex 当前行在dataSource的索引
   */
  const onTextChange = (row: any, key: number | string, rowIndex: number) => (event: any) => {
    // 去除json格式化后的换行空格等字符
    let value = event.target.value || '';
    const newData = [...dataSource];
    const item = newData[rowIndex];
    row[key] = value;
    newData.splice(rowIndex, 1, {
      ...item,
      ...row
    });
    changeDataSoure(newData);
  };

  /**
   * 编码切换
   * @param row
   * @param key
   * @param rowIndex
   * @param type
   */
  const changeEncode =
    (row: any, key: number, rowIndex: number, type: 'encode' | 'reencode' | 'decode' | 'hide' | 'tourl' = 'encode') =>
    (checked: boolean) => {
      const newData = [...dataSource];
      const item = newData[rowIndex];
      row[key + type] = checked;
      // 再次编码依赖于编码
      if (type === 'encode' && !checked) {
        row[key + 'reencode'] = false;
      }
      if (type === 'decode') {
        row[key] = handleJsonStr(checked ? decodeURIComponent(row[key]) : encodeURIComponent(trim(row[key])));
      }
      if (type === 'tourl') {
        try {
          row[key] = checked ? qs.stringify(JSON.parse(row[key])) : handleJsonStr(JSON.stringify(qs.parse(row[key])));
        } catch (e) {
          console.log('tourl error:', e);
        }
      }
      newData.splice(rowIndex, 1, {
        ...item,
        ...row
      });
      changeDataSoure(newData);
    };

  /**
   * 新增数据
   */
  const addData =
    (data = {}) =>
    () => {
      const newData = [...dataSource];
      let keys = newData.map((i) => i.key);
      // 首次打开没有值，需要设置为-1 原因是Math.max() + 1 为 -Infinity
      if (keys.length < 1) {
        keys = [-1];
      }
      // 向头部增加 保证新增的数据在第一条
      newData.unshift({
        ...data,
        key: Math.max(...keys) + 1
      });
      changeDataSoure(newData);
    };

  /**
   * 复制一条已有数据
   */
  const copyData = () => {
    if (selectedRowKeys.length !== 1) {
      message.error('请选择一条要复制的数据');
      return;
    }
    const [selectedData] = dataSource.filter((item: any) => selectedRowKeys.includes(item.key));
    addData({ ...selectedData })();
  };

  /**
   * 删除行数据
   */
  const deleteData = () => {
    if (selectedRowKeys.length < 1) {
      message.error('请选择需要删除的数据');
      return;
    }
    Modal.confirm({
      title: '确认删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const newData = dataSource.filter((item: any) => !selectedRowKeys.includes(item.key));
        setDataSource(newData);
        // 删除后需要同步删除数据库记录
        selectedRowKeys.forEach((key: ReactText) => {
          urlStore.remove(key);
        });
        setSelectedRowKeys([]);
        message.success('删除成功');
      }
    });
  };

  /**
   * 修改段
   * @param index
   * @param type
   */
  const changePart =
    (index: number = 0, type: 'add' | 'sub' = 'add') =>
    () => {
      let newPart: number[] = [...part];
      if (type === 'add') {
        // 增加的段的key在当前段的基础上加1
        newPart.push(Math.max(...part) + 1);
        setPart(newPart);
        partStore.update({ key: 0, data: newPart });
      } else if (type === 'sub') {
        Modal.confirm({
          title: '确认删除吗？',
          content: '删除后，数据无法恢复',
          onOk: () => {
            const delKey = newPart.splice(index, 1);
            const newData = [...dataSource];
            // 删除时同步删除对应段的记录值
            newData.forEach((item: any) => {
              delete item[delKey[0]];
              delete item[delKey[0] + 'encode'];
              delete item[delKey[0] + 'reencode'];
            });
            changeDataSoure(newData);
            setPart(newPart);
            partStore.update({ key: 0, data: newPart });
          }
        })
      }
    };

  /**
   * 失焦时，json格式化
   * @param row
   * @param key
   * @param rowIndex
   * @param isFocus
   */
  const changeFocus = (row: any, key: number | string, rowIndex: number, isFocus: boolean) => () => {
    if (!isFocus) {
      row[key] = handleJsonStr(row[key]);
    }
    const newData = [...dataSource];
    const item = newData[rowIndex];
    newData.splice(rowIndex, 1, {
      ...item,
      ...row
    });
    changeDataSoure(newData);
  };

  /**
   * 生成操作区按钮
   * @param col
   * @returns
   */
  const renderOpt = (col: number) => (text: string, record: any, rowIndex: number) => {
    return (
      <div className="input-wrap">
        <Switch
          className="btn"
          checkedChildren="解码显示"
          unCheckedChildren="编码显示"
          checked={record[col + 'decode']}
          onChange={changeEncode(record, col, rowIndex, 'decode')}
        />
        <Switch
          className="btn"
          checkedChildren="编码"
          unCheckedChildren="编码"
          checked={record[col + 'encode']}
          onChange={changeEncode(record, col, rowIndex, 'encode')}
        />
        <Switch
          className="btn"
          checkedChildren="再编码"
          unCheckedChildren="再编码"
          disabled={!record[col + 'encode']}
          checked={record[col + 'reencode']}
          onChange={changeEncode(record, col, rowIndex, 'reencode')}
        />

        <Tooltip
          overlayClassName="qrcode-result"
          color="#fff"
          trigger="click"
          title={() => {
            return (
              <>
                <Switch
                  className="btn"
                  checkedChildren="Json转url"
                  unCheckedChildren="Json转url"
                  disabled={!record[col + 'tourl'] && !isJson(record[col])}
                  checked={record[col + 'tourl']}
                  onChange={changeEncode(record, col, rowIndex, 'tourl')}
                />
                <Switch
                  className="btn"
                  checkedChildren="隐藏"
                  unCheckedChildren="隐藏"
                  checked={record[col + 'hide']}
                  onChange={changeEncode(record, col, rowIndex, 'hide')}
                />
              </>
            );
          }}
        >
          <Button size="small" className="btn more">
            更多
            <RightCircleOutlined />
          </Button>
        </Tooltip>
        <Input.TextArea
          rows={7}
          onFocus={changeFocus(record, col, rowIndex, true)}
          onBlur={changeFocus(record, col, rowIndex, false)}
          onChange={onTextChange(record, col, rowIndex)}
          className="input"
          value={text}
        />
      </div>
    );
  };

  /**
   * 表头
   * @param index 列
   * @returns
   */
  const renderTitle = (index: number) => () => {
    return (
      <div className="table-title">
        <>第{index + 1}段</>
        {index > 2 && (
          <Tooltip title="删除">
            <DeleteOutlined className="btn no-mb" onClick={changePart(index, 'sub')} />
          </Tooltip>
        )}
      </div>
    );
  };

  /**
   * 表格列
   */
  const columns: ColumnItemType[] = part.map((col: number, index: number) => {
    return {
      title: renderTitle(index),
      align: 'center',
      key: col,
      dataIndex: `${col}`,
      render: renderOpt(col)
    };
  });

  /**
   * 获取完整的url
   * @param data
   */
  const getFullUrl = (data: any) => {
    const url = part
      .map((key: string) => {
        const value = typeof data[key] === 'string' ? trim(data[key] || '') : '';
        const rValue = !!data[key + 'reencode'] ? encodeURIComponent(value) : value;
        return data[key + 'hide'] ? '' : !!data[key + 'encode'] ? encodeURIComponent(rValue) : rValue;
      })
      .join('');
    return url || '';
  };

  /**
   * 每行增加名称
   * @param text
   * @param record
   * @param rowIndex
   * @returns
   */
  const renderTableRowName = (text: string, record: any, rowIndex: number) => {
    return (
      <Tooltip
        overlayClassName="qrcode-result"
        color="#fff"
        trigger="click"
        placement="left"
        title={() => {
          return (
            <>
              <p>修改名称</p>
              <Input
                onFocus={changeFocus(record, 'name', rowIndex, true)}
                onBlur={changeFocus(record, 'name', rowIndex, false)}
                onChange={onTextChange(record, 'name', rowIndex)}
                className="input"
                value={text}
              />
            </>
          );
        }}
      >
        <div className="input-wrap" style={{ cursor: 'pointer', color: '#1890ff' }}>
          {text || record.key}
        </div>
      </Tooltip>
    );
  };

  columns.unshift({
    title: '名称',
    dataIndex: 'name',
    width: '150px',
    align: 'center',
    render: renderTableRowName
  });

  /**
   * 生成结果展示按钮
   * @param text
   * @param record
   * @param index
   * @returns
   */
  const renderResultBtn = (text: string, record: any, index: number) => {
    const url = getFullUrl(record);
    return (
      <Tooltip
        overlayClassName="qrcode-result"
        color="#fff"
        trigger="click"
        placement="left"
        {...(!url ? { visible: false } : {})}
        title={() => {
          return (
            <>
              <QRCode style={{ cursor: 'pointer' }} value={url} size={200} fgColor="#000000" />
              {url}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <CopyToClipboard text={url} onCopy={() => message.success('复制成功')}>
                  <Button type="primary">复制url</Button>
                </CopyToClipboard>
              </div>
            </>
          );
        }}
      >
        <Button type="primary" disabled={!url}>
          查看结果
        </Button>
      </Tooltip>
    );
  };

  /**
   * 增加二维码展示
   */
  columns.push({
    title: '结果',
    dataIndex: 'qrcode',
    align: 'center',
    render: renderResultBtn
  });

  /**
   * 选择行数据
   * @param keys
   */
  const onSelectChange = (keys: ReactText[]) => {
    setSelectedRowKeys(keys);
  };
  const showModal = (key: string) => () => {
    setModalVisiable({ [key]: true });
  };

  const closeModal = (key: string) => () => {
    setModalVisiable({ [key]: false });
  };

  /**
   * 将当前所有url保存至redis
   */
  const saveUrl = async () => {
    if (!fileName) {
      message.error('请填写Key值');
      return;
    }
    localStorage.setItem('KEY', fileName);
    const { exist } = await existRedis(fileName);
    const saveData = () => {
      const value = dataSource.map((data: any) => {
        return {
          name: data.name,
          url: getFullUrl(data)
        };
      });
      setRedis(fileName, value);
      closeModal('fileName')();
      message.success('保存成功');
    };
    if (exist === 1) {
      Modal.confirm({
        content: '此key已存在，确认覆盖吗？',
        onOk: saveData
      });
      return;
    }
    saveData();
  };

  /**
   * 查询
   * @param params
   */
  const onQueryClick = async (params: any) => {
    const { name: queryName = '', url = '' } = params;
    const list = await urlStore.getAllData();
    const filterData = list.filter((data: any) => {
      const { key, name = '' } = data;
      const keyName = key + name;
      return keyName.includes(queryName) && getFullUrl(data).includes(url);
    });
    setDataSource(filterData);
  };

  return (
    <div className="qrcode-content">
      <SearchBox conditions={CONDITIONS} onQueryClick={onQueryClick} />
      <div className="opt-box">
        <Button className="btn" onClick={addData()}>
          新建一条
        </Button>
        <Button className="btn" onClick={copyData}>
          复制
        </Button>
        <Button className="btn" onClick={changePart()}>
          增加分段
        </Button>
        <Button className="btn" onClick={deleteData}>
          删除记录
        </Button>
        <ParseImg />
        <Button className="btn" onClick={showModal('fileName')}>
          保存URL
        </Button>
        <Tooltip
          overlayClassName="qrcode-result"
          color="#fff"
          trigger="click"
          {...(!fileName ? { visible: false } : {})}
          placement="right"
          title={() => {
            const url = `${window.location.origin}/call-app?key=${fileName}`;
            return (
              <>
                <QRCode style={{ cursor: 'pointer' }} value={url} size={200} fgColor="#000000" />
                {url}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <CopyToClipboard text={url} onCopy={() => message.success('复制成功')}>
                    <Button>复制url</Button>
                  </CopyToClipboard>
                </div>
              </>
            );
          }}
        >
          <Button className="btn">查看已保存</Button>
        </Tooltip>
      </div>

      <Table
        rowKey="key"
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          total: dataSource.length,
          pageSize: 5,
          responsive: true
        }}
      />

      <Modal
        title="唯一Key"
        visible={modalVisiable['fileName']}
        closable={false}
        cancelText="取消"
        okText="保存"
        onCancel={closeModal('fileName')}
        onOk={saveUrl}
      >
        <p>此key是作为数据存储的唯一标识,建议使用你的OA账号作为key</p>
        <Input value={fileName} onChange={(e: any) => setFileName(e.target.value || '')} />
      </Modal>
    </div>
  );
}
