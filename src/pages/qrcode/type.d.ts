/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-02-05 16:25:42
 * @Last Modified by: qiuz
 */

import { PageData } from 'utils/indexdb';

export type ColumnItemType = {
  title: string | (() => React.ReactNode);
  dataIndex: string;
  align: 'center' | 'left' | 'right';
  width?: string;
  render?: (text: string, record: any, index: number) => React.ReactNode;
};

export type UpdateStoreFn = (data: any) => Promise<unknown>;
export type GetPageData = (pageNum: number, pageSize: number = 10) => Promise<PageData>;
