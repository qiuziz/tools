/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-15 22:48:07
 * @Last Modified by: qiuz
 */

import { ButtonProps } from 'antd/lib/button';

export interface InputNumber {
  queryIndex: string;
  placeholder: string;
}

export type ConditionType = 'string' | 'number' | 'numberRange' | 'dateRange' | 'date' | 'select';

export interface Condition {
  label: string;
  type: ConditionType;
  placeholder?: string;
  queryIndex?: string | Array<string>;
  data?: any[];
  range?: string[];
  cascaderValues?: Array<any>;
  dateValue?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  defaultVlaue?: string | number;
  dataIndex?: string;
  childQueryIndex?: string;
  start?: InputNumber;
  end?: InputNumber;
  initTwoOptions?: ($event: any) => {}; // cascader下拉菜单二级选项
  initThreeOptions?: ($event: any) => {}; // cascader下拉菜单三级选项
}

export type ButtonType = {
  name: string;
  query?: boolean;
  reset?: boolean;
  type?: ButtonProps['type'];
  click?: () => void;
};

export type SearchBoxProps = {
  conditions: Condition[];
  buttonList?: ButtonType[];
  onQueryClick?: (...args: any) => void;
};
