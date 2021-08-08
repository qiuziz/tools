/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-06-10 00:31:40
 * @Last Modified by: qiuz
 */

const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const fs = require('fs');
const path = require('path');
const koaBody = require('koa-body');

const app = new Koa({
  proxy: true
});

const router = new Router();

const templatePath = `./index.html`;
let template = '';
if (fs.existsSync(templatePath)) {
  template = fs.readFileSync(templatePath, 'utf-8');
}

app.use(
  koaBody({
    formidable: {
      //设置文件的默认保存目录，不设置则保存在系统临时目录下  os
      uploadDir: path.resolve(__dirname, '../temp')
    },
    multipart: true // 支持文件上传,默认不不支持
  })
);

const port = process.env.NODE_ENV === 'development' ? 8002 : 8001;


router.use('/upload', require('./route/cdn-upload'));
router.use('/redis', require('./route/redis'));

app.use(koaStatic(path.join(__dirname, '..')));

router.all('*', async (ctx, next) => {
  ctx.body = template;
});


app.use(router.routes()).use(router.allowedMethods());
app.timeout = 5 * 60 * 1000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
