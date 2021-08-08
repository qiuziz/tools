/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-02-05 16:25:42
 * @Last Modified by: qiuz
 */

export type ColumnItemType = {
  title: string | (() => React.ReactNode);
  dataIndex: string;
  align: 'center' | 'left' | 'right';
  width?: string;
  render?: (text: string, record: any, index: number) => React.ReactNode;
};


export type UpdateStoreFn = (data: any) => Promise<unknown>;
