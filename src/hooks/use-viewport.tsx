/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-30 12:07:49
 * @Last Modified by: qiuz
 */

import React from 'react';

export const viewportContext = React.createContext({} as { width: number; height: number });
export const ViewportProvider = ({ children }: any) => {
  // 顺带监听下高度，备用
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  React.useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);
  return <viewportContext.Provider value={{ width, height }}>{children}</viewportContext.Provider>;
};

export const useViewport = () => {
  const { width, height } = React.useContext(viewportContext);
  return { width, height };
};
