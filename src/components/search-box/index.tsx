/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-15 22:47:39
 * @Last Modified by: qiuz
 */

import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from 'antd';
import './index.less';
import { ButtonType, Condition, ConditionType, SearchBoxProps } from './type';
import { isEmpty, isFunction } from 'lodash';

const defaultButtonList: ButtonType[] = [
  {
    name: '查询',
    query: true,
    type: 'primary'
  },
  {
    name: '重置',
    reset: true
  }
];

export default function SearchBox(props: SearchBoxProps) {
  const [queryData, setQueryData] = useState({});
  const { conditions = [], buttonList = defaultButtonList, onQueryClick } = props;

  const handleDefaultValue = () => {
    conditions.forEach((cond: Condition) => {
      if (cond.defaultVlaue && !queryData[cond.queryIndex as string]) {
        queryData[cond.queryIndex as string] = cond.defaultVlaue;
        setQueryData({ ...queryData });
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleDefaultValue, []);

  const onChange = (key: string, type: ConditionType) => (data: any) => {
    if (type === 'string') {
      const { target = {} } = data;
      const { value } = target;
      queryData[key] = value;
    }
    if (type === 'select') {
      queryData[key] = data;
    }
    setQueryData({ ...queryData });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.code === 'Enter') {
      buttonList.forEach((btn: ButtonType) => {
        btn.query && btnClick(btn)();
      });
    }
  };

  const renderConditionType = (condition: any = {}) => {
    let content = <></>;
    const {
      type = '',
      className = '',
      queryIndex = '',
      data = [],
      defaultValue = '',
      placeholder = ''
    } = condition;
    switch (type) {
      case 'string':
        content = (
          <Input
            className={`condition-box-type ${type} ${className}`}
            type="text"
            onKeyPress={handleEnter}
            placeholder={placeholder || '请输入'}
            value={queryData[queryIndex]}
            onChange={onChange(queryIndex, type)}
          />
        );
        break;
      case 'select':
        content = (
          <Select
            className={`condition-box-type ${type} ${className}`}
            value={queryData[queryIndex]}
            style={{ width: '100%' }}
            placeholder={placeholder || '请选择'}
            defaultValue={defaultValue}
            onChange={onChange(queryIndex, type)}
          >
            {data.map((option: any, index: number) => {
              return (
                <Select.Option
                  key={index}
                  className="condition-box-type-select-option"
                  value={option.value}
                >
                  {option.label}
                </Select.Option>
              );
            })}
          </Select>
        );
        break;
      default:
        break;
    }
    return content;
  };

  const btnClick = (btn: ButtonType) => () => {
    if (btn.query && !isEmpty(queryData)) {
      isFunction(btn.click) ? btn.click() : isFunction(onQueryClick) && onQueryClick(queryData);
    }
    if (btn.reset) {
      setQueryData({});
    }
  };

  return (
    <div className="search-box-wrap">
      {conditions.map((condition: Condition, index: number) => {
        return (
          <div key={index} className="condition-box">
            <label className="condition-box-text">{condition.label}</label>
            <div className="condition-box-area">{renderConditionType(condition)}</div>
          </div>
        );
      })}
      <div className="search-box-wrap-btn-list">
        {(buttonList as ButtonType[]).map((btn: ButtonType, index: number) => {
          return (
            <div key={index} className="search-box-wrap-btn-list-btn">
              <Button type={btn.type} onClick={btnClick(btn)}>
                {btn.name}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
