/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import { Button, message, Upload, Modal, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import './index.less';
import { InboxOutlined } from '@ant-design/icons';
import { addStore, getDataByPage, isNumber, openDB } from 'utils';
import copy from 'copy-to-clipboard';
import { Resource } from 'service';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { columns } from './constant';
import { useClipboard } from 'hooks';

const { Dragger } = Upload;

let uploadStore: any, getUploadCommitList: any;

let loading = false;

export default function CDNImgUpload() {
  const [visible, setVisible] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [uploadList, setUploadList] = useState([]);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState('');

  const [fileList, setFileList] = useState<any>([]);

  const pasteListener = useCallback((e: ClipboardEvent) => {
    const file = useClipboard(e);
    if (!file) return message.error('获取剪贴板图片失败');
    const time = new Date().getTime();
    const uid = `from-clipboard-${time}`;
    Object.assign(file, { uid });
    const rcFile = {
      lastModified: file.lastModified,
      lastModifiedDate: (file as any).lastModifiedDate,
      name: time + '.png',
      size: file.size,
      type: file.type,
      percent: 0,
      uid: uid,
      originFileObj: file as RcFile
    };
    upload([rcFile]);
  }, []);

  useEffect(() => {
    openDB({
      dbName: 'widgets_cdn_img_config',
      storeName: ['upload_commit'],
      storeOption: { keyPath: 'key', autoIncrement: true }
    }).then((db: IDBDatabase) => {
      getUploadCommitList = (
        params: { pageNum: number; pageSize?: number } = { pageNum: 1, pageSize: 10 }
      ) => getDataByPage({ db, storeName: 'upload_commit', ...params });
      // 提供全局操作对象
      uploadStore = {
        add: (data: any) => addStore({ db, storeName: 'upload_commit', data })
      };
    });
    document.addEventListener('paste', pasteListener);
    return () => document.removeEventListener('paste', pasteListener);
  }, []);

  const getLog = () => {
    Resource.cdn.post({ type: 'log' }, {}).then((res) => {
      const { content }: any = res;
      setLog(content);
      setVisible(true);
    });
  };

  const onFileHandle = (type: 'preview' | 'look') => (file: UploadFile) => {
    const { url = '' } = file;
    if (!url) return true;
    if (type === 'preview') {
      copy(url);
      message.success('复制成功: ' + url);
    } else if (type === 'look') {
      window.open(url);
      return Promise.resolve(false);
    }
  };

  const beforeUpload = (file: UploadFile) => {
    file.status = 'uploading';
    // 这里需要先将文件列表传给Upload组件，以显示loading动画
    setFileList([...fileList, file]);
    return false;
  };

  const onFileChange = (info: any) => {
    const { fileList } = info;
    console.log(info);
    upload(fileList);
  };

  const upload = (fileList: UploadFile[]) => {
    if (loading) return false;
    loading = true;
    const formData = new FormData();
    fileList.forEach((file: UploadFile) => {
      const { originFileObj, name, uid } = file;
      if (!file.url) {
        formData.append('files', originFileObj as RcFile, name + '.' + uid);
      }
    });
    Resource.cdn
      .upload({}, formData)
      .then((res: any) => {
        if (res && res.length > 0) {
          const result = {};
          res.forEach((f: any) => (result[f.uid] = f));
          fileList.forEach((file: UploadFile) => {
            const remoteFile = result[file.uid];
            if (remoteFile) {
              file.status = 'success';
              file.url = remoteFile.url;
              if (remoteFile.exists === 1) {
                message.info(
                  <span>
                    CDN已存在: <a href={remoteFile.url}>{remoteFile.url}</a>
                  </span>,
                  10
                );
              }
              // 如果直接存储，Upload组件内部还没有生成thumbUrl base64，所以这里等待100ms再执行保存操作
              setTimeout(() => {
                uploadStore && uploadStore.add({ url: remoteFile.url, thumbUrl: file.thumbUrl });
              }, 100);
            }
          });
          res.filter((f: any) => f.exists !== 1).length > 0 && message.success(`上传成功`);
          setFileList(fileList);
        }
      })
      .catch((err) => {
        const errorMsg = '上传失败，请重试';
        fileList.forEach((file: UploadFile) => {
          file.status = 'error';
          file.error = errorMsg;
        });
        setFileList(fileList);
        message.error(errorMsg);
        console.error(err);
      })
      .finally(() => {
        loading = false;
      });
  };

  const getUploadCommit = async (page: number = 1) => {
    const res = await getUploadCommitList({ pageNum: isNumber(page) ? page : 1 });
    const { data = [], total } = res || {};
    setUploadList(data);
    setHistoryModal(true);
    setTotal(total);
  };

  const renderItemRight = (file: UploadFile) => {
    return file.error ? (
      '删除'
    ) : file.url ? (
      <div>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onFileHandle('preview')(file);
          }}
        >
          复制链接
        </span>
        <span style={{ marginLeft: 10 }}>查看</span>
      </div>
    ) : (
      ' '
    );
  };

  return (
    <div className="cdn-content">
      <div className="cdn-content-upload-wrap">
        <div className="cdn-content-upload">
          <Dragger
            className="cdn-content-upload-drag"
            name="file"
            multiple
            action="/upload"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={onFileChange}
            listType="picture"
            showUploadList={{
              showRemoveIcon: true,
              removeIcon: renderItemRight
            }}
            onRemove={onFileHandle('look')}
            onPreview={onFileHandle('preview')}
          >
            <InboxOutlined className="cdn-content-upload-drag-icon" />
            <p className="cdn-content-upload-drag-text">点击或拖动文件到该区域上传文件</p>
            <p className="cdn-content-upload-drag-hint">
              支持 <span style={{ color: 'red', fontStyle: 'italic' }}>屏幕截图</span> 在此粘贴上传
              <br />
              支持单次、批量上传至CDN
              <br />
              上传完成后，可能需要等待几分钟CDN更新
            </p>
          </Dragger>
        </div>
      </div>
      <div className="option-btn">
        <Button className="btn" type="primary" onClick={getUploadCommit as any}>
          上传记录
        </Button>
        <Button className="btn" type="primary" onClick={getLog}>
          日志
        </Button>
      </div>

      <Modal
        className="cdn-upload-modal"
        footer={false}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <div className="log-content">{log}</div>
      </Modal>

      <Modal
        title="上传记录"
        width="80%"
        destroyOnClose
        visible={historyModal}
        footer={null}
        onCancel={() => setHistoryModal(false)}
      >
        <Table
          scroll={{ x: '100%' }}
          rowKey="key"
          dataSource={uploadList}
          columns={columns}
          pagination={{ total, onChange: getUploadCommit }}
        />
      </Modal>
    </div>
  );
}
