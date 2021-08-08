import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';

//此组件的意义就是将数据抽离出来，通过传递数据去渲染
class CustomMenu extends React.Component<any> {
  state = {
    openKeys: [],
    selectedKeys: ['4'],
    defaultNodeList: []
  };

  handleClick = (e: any) => {
    console.log('click ', e);
    this.setState({ selectedKeys: [`${e.key}`] });
    this.props.onSelect(`${e.key}`);
  };

  render() {
    const { openKeys, selectedKeys } = this.state;
    return (
      <Menu theme="dark" mode="horizontal" onClick={this.handleClick} selectedKeys={selectedKeys}>
        {this.props.menus &&
          this.props.menus.map((item: { key: string; name: string }) => {
            return <Menu.Item key={item.key}>{item.name}</Menu.Item>;
          })}
      </Menu>
    );
  }
}

export default withRouter(CustomMenu);
