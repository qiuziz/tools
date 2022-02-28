/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import { useViewport } from 'hooks';
import React, { useEffect, useState } from 'react';
import { arrayGroup } from 'utils';
import { LIST } from './constant';
import './index.less';

const CARD_WIDTH = 153;

export default function SiteMap() {
  const [list, setList] = useState<any[]>([]);
  const [cardStyle, setCardStyle] = useState<{ width: number; height: number }>({
    width: CARD_WIDTH,
    height: CARD_WIDTH
  });

  const go = (url: string) => () => {
    window.open(url, '_blank');
  };
  const { width } = useViewport();

  useEffect(() => {
    // 外层有一个30px的padding 这里需要减去才是实际展示内容宽度
    const contentWidth = width - 60;
    // 根据屏幕宽度等分
    const dividNum = Math.floor(contentWidth / CARD_WIDTH);
    // 需要加上的额外宽度，防止两侧距离不等 内容不居中
    const extraW = Math.floor((contentWidth % CARD_WIDTH) / dividNum);
    const list = arrayGroup(LIST, dividNum);
    // 实际宽高
    const size = CARD_WIDTH + extraW;
    setList(list);
    setCardStyle({
      width: size,
      height: size
    });
  }, [width]);

  return (
    <div className="site-map">
      {list.map((subList: any[]) => {
        return subList.map((site: any) => {
          return (
            <div
              className="site-map-list-btn"
              style={cardStyle}
              key={site.url}
              onClick={go(site.url)}
            >
              <p className="title">{site.title}</p>
              <a href={site.url} target="_blank">
                {site.url}
              </a>
            </div>
          );
        });
      })}
      <a
        className="edit-btn"
        target="_blank"
        href="https://github.com/qiuziz/tools/edit/master/src/pages/site-map/constant.ts"
      >
        <img src="https://gitee.com/qiuz/img/raw/master/20220227001321.png" alt="新增" />
        新增
      </a>
    </div>
  );
}
