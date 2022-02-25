const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // app.use(
  //   '/upload',
  //   createProxyMiddleware({
  //     target: 'http://127.0.0.1:8002',
  //     changeOrigin: true
  //   })
  // );
  // app.use(
  //   '/redis',
  //   createProxyMiddleware({
  //     // target: 'http://127.0.0.1:8002',
  //     changeOrigin: true
  //   })
  // );
  // app.use(
  //   '/doc',
  //   createProxyMiddleware({
  //     target: 'http://127.0.0.1:8002',
  //     changeOrigin: true
  //   })
  // );
};
