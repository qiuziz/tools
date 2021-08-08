/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import { useRouterParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Resource } from 'service';
import './index.less';

export default function Doc() {

  const [md, setMd] = useState('');

  const { name } = useRouterParams();

  useEffect(() => {
    Resource.doc.get({type: name}).then((res: any) => {
      setMd(res);
    });
  }, []);

  return (
    <div className="doc-content">
      <ReactMarkdown remarkPlugins={[gfm]} children={md} />
    </div>
  );
}
