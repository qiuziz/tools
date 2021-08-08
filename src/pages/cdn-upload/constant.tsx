/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-02-20 16:24:06
 * @Last Modified by: qiuz
 */

import React from 'react';
import { message } from 'antd';
import copy from 'copy-to-clipboard';

export const columns = [
  {
    title: '预览',
    width: '150px',
    dataIndex: 'thumbUrl',
    align: 'center' as 'center',
    render: (value: string) => <img height="100" src={value} alt={value} />
  },
  {
    title: '图片链接',
    dataIndex: 'url'
  },
  {
    title: '操作',
    width: '200px',
    align: 'center' as 'center',
    dataIndex: 'url',
    fixed: 'right' as 'right',
    render: (value: string) => (
      <>
        <a href={value} target="_blank" rel="noreferrer noopener">
          查看大图
        </a>
        <a
          style={{
            marginLeft: '10px'
          }}
          onClick={() => {
            copy(value);
            message.success('复制成功: ' + value);
          }}
        >
          复制链接
        </a>
      </>
    )
  }
];
