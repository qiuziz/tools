/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import { Button, message, Modal, Upload } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import './index.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import { UploadOutlined } from '@ant-design/icons';
import jsQR from 'jsqr';
import { useClipboard } from 'hooks';

/**
 * 解析二维码图片
 */
export default function ParseImg() {
  const [modalVisiable, setModalVisiable] = useState(false);

  const [decodeUrl, setDecodeUrl] = useState('');

  const [clipboardImg, setClipboardImg] = useState('');

  useEffect(() => {}, []);

  /**
   * 监听粘贴事件
   * 使用useCallback保证页面re-render时此函数内存地址不变，这样才能removeListener
   * 如果需要更新外部数据，依赖需要传入，否则数据不会更新导致数据出错
   */
  const pasteListener = useCallback((e: ClipboardEvent) => {
    const file = useClipboard(e);
    if (!file) return message.error('请先复制图片');
    parseImg(file as File);
  }, []);

  /**
   * 文件变动
   * @param info
   * @returns
   */
  const onFileChange = (info: any) => {
    const { file } = info;
    if (!file) return;
    parseImg(file);
  };

  /**
   * 解析图片
   * @param file
   */
  const parseImg = (file: File) => {
    const image: HTMLImageElement = document.createElement('img');
    image.src = URL.createObjectURL(file);
    setClipboardImg(image.src);
    image.onload = () => {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      const imageData: ImageData = context.getImageData(0, 0, image.width, image.height);
      const { data } = jsQR(imageData.data, image.width, image.height) || {};
      if (!data) return message.error('解析失败，请确认图片包含二维码');
      setDecodeUrl(data);
      message.success('二维码识别成功');
    };
  };

  const toggleModal =
    (show = false) =>
    () => {
      setModalVisiable(show);
      show ? document.addEventListener('paste', pasteListener) : document.removeEventListener('paste', pasteListener);
    };

  return (
    <div className="parse-img-content">
      <Button className="btn" onClick={toggleModal(true)}>
        识别二维码
      </Button>
      <Modal visible={modalVisiable} title="识别二维码" footer={null} onCancel={toggleModal()}>
        <div className="flex-center-colum">
          <span
            className="flex-center-colum decode-qrcode-text"
            style={{
              marginBottom: 30
            }}
          >
            支持解析剪贴板图片或者上传二维码
            <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 10 }}>右键复制图片或者截图，不支持直接复制文件(浏览器安全限制)</span>
          </span>
          {clipboardImg && (
            <div className="decode-show">
              <img className="decode-show-img" src={clipboardImg} alt="" />
              <CopyToClipboard text={decodeUrl} onCopy={() => message.success('复制成功')}>
                <div className="decode-show-url">{decodeUrl}</div>
              </CopyToClipboard>
            </div>
          )}
          <Upload beforeUpload={() => false} onChange={onFileChange} showUploadList={false}>
            <Button type="primary" icon={<UploadOutlined />}>
              选择图片 或 Ctrl + V
            </Button>
          </Upload>
        </div>
      </Modal>
    </div>
  );
}
