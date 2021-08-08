import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
const { SubMenu } = Menu;

interface MenuField {
  url: string;
  key: string;
  name: string;
  children: MenuField[];
}

//此组件的意义就是将数据抽离出来，通过传递数据去渲染
class CustomMenu extends React.Component<any> {
  state = {
    openKeys: [],
    selectedKeys: [this.props.current ?? '47'],
    defaultNodeList: []
  };
  componentWillReceiveProps(nextProps: any) {
    if (nextProps.menus !== this.props.menus) {
      const paths = findMenuPath(nextProps.menus, this.state.selectedKeys[0]);
      this.setState({ openKeys: paths.slice(0, -1).map((item) => item.key.toString()) });
    }
  }

  onOpenChange = (openKeys: any) => {
    console.info('openKeys:', openKeys);
    this.setState({
      openKeys
    });
  };
  renderMenuItem = (item: any) => {
    return (
      <Menu.Item key={item.key} onClick={() => this.viewContent(item)}>
        <span>{item.title}</span>
      </Menu.Item>
    );
  };
  renderSubMenu = (item: any) => {
    return (
      <Menu.SubMenu
        key={item.key}
        title={
          <span>
            <span>{item.title}</span>
          </span>
        }
      >
        {item.children &&
          item.children.map((child: any) => {
            return child.children && child.children.length > 0
              ? this.renderSubMenu(child)
              : this.renderMenuItem(child);
          })}
      </Menu.SubMenu>
    );
  };
  viewContent = (item: { url: string }) => {
    console.log(item);

    item.url && window.history.pushState('', '', item.url);
  };

  handleMenuClick = (key: string | number) => {
    this.setState({ selectedKeys: [key] });
    const menuPaths = findMenuPath(this.props.menus, key);
    this.props.onMenuChange(menuPaths);
  };

  render() {
    const { openKeys, selectedKeys } = this.state;
    return (
      <Menu
        mode="inline"
        onOpenChange={this.onOpenChange}
        onClick={({ key }) => this.handleMenuClick(key)}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        style={{ height: '100%' }}
      >
        {this.props.menus &&
          this.props.menus.map((item: any) => {
            return item.children && item.children.length > 0
              ? this.renderSubMenu(item)
              : this.renderMenuItem(item);
          })}
      </Menu>
    );
  }
}

export const findMenuPath = (menus: MenuField[], key: string | number) => {
  let ret: MenuField[] = [];
  const step = (
    menus: MenuField[],
    targetKey: string | number,
    menuPaths: MenuField[]
  ): boolean => {
    let findRet = false;
    for (const item of menus) {
      if (item.key == targetKey) {
        menuPaths.push(item);
        ret = menuPaths;
        return true;
      }
      if (item.children && item.children.length) {
        menuPaths.push(item);
        findRet = step(item.children, targetKey, menuPaths);
        if (findRet) {
          break;
        } else {
          menuPaths.pop();
        }
      }
    }
    return findRet;
  };
  step(menus, key, []);
  return ret;
};

export default withRouter(CustomMenu);
