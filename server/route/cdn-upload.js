/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-06-09 17:55:10
 * @Last Modified by: qiuz
 */

const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const {getRenderData} = require('../util/utils');

const router = new Router();

const TEMP_DIR = 'temp';

execSync(`mkdir -p ${TEMP_DIR}`);
// CDN文件访问地址统一前缀
const HOST = ``;
// 上传目录
const UPLOAD_SITE = process.env.NODE_ENV === 'development' ? 'esftest' : 'esf';
// 压缩文件名
const TAR_NAME = 'img';
const TAR_EXT = '.tar.gz';

const uploadToCdn = (file, site) => {
  return new Promise((resolve, reject) => {
    try {
      execSync(
        `curl -F "file=@${file}" http://qiuz.site/fileupload -F "site=${
          site || UPLOAD_SITE
        }" -v > upload.log 2>&1`,
        { stdio: [0, 1, 2] }
      );
      execSync(`rm -rf ${file}`);
      resolve(file);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const checkFileExists = (url) => {
  // TODO：云平台 curl 一直是挂起状态 不返回 等待后续解决
  // return execSync(
  //   `curl -LI ${url} -o /dev/null -w '%{http_code}\\n' -s`
  // )
  return '404';
};

const renameFile = (file) => {
  const fpath = file.path.replace(/\\/g, '/');
  const ext = path.extname(file.name);
  const name = path.basename(file.name, ext);
  let sha1 = execSync(`sha1sum ${fpath}`);
  sha1 = sha1.toString().slice(0, 8);
  fs.mkdirSync(`${TEMP_DIR}/${sha1}/`, { recursive: true });
  const fname = sha1 + '/' + name;
  let nextPath = fpath;
  if (file.size > 0 && fpath) {
    const arr = fpath.split('/');
    arr[arr.length - 1] = fname;
    nextPath = arr.join('/');
    //重命名文件
    fs.renameSync(fpath, nextPath);
  }
  return {
    url: `${HOST}/${UPLOAD_SITE}/${TAR_NAME}/${fname}`,
    name,
    uid: ext.slice(1),
    filePath: nextPath.replace(/(.*)\/(.*)/, '$1')
  };
};

router.post('/url/save', async (ctx, next) => {
  const params = ctx.request.body || {};
  const { fileName, jsonData } = params;
  const json = `${fileName}.json`;
  fs.writeFileSync(json, jsonData);
  try {
    await uploadToCdn(json, `${process.env.NODE_ENV === 'development' ? 'esftest' : 'esf'}/img/url`);
    ctx.body = getRenderData({
      data: {
        content: '保存成功'
      }
    });
  } catch (error) {
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: '保存失败' + error
      }
    });
  }
});

router.post('/log', (ctx, next) => {
  if (!fs.existsSync('upload.log')) {
    ctx.body = getRenderData({
      data: {
        content: '暂无数据'
      }
    });
  } else {
    const log = fs.readFileSync('upload.log', 'utf8');
    ctx.body = getRenderData({
      data: {
        content: log
      }
    });
  }
});

router.post('/', async (ctx, next) => {
  let files = ctx.request.files.files; //得到文件对象
  if (!files) {
    ctx.status = 500;
    ctx.body = getRenderData({
      code: 1,
      msg: '上传文件不能为空'
    });
    return;
  }
  try {
    files = Array.isArray(files) ? files : [files];
    const fileList = [];
    for (const file of files) {
      const filepath = renameFile(file);
      fileList.push(filepath);
    }
    const mvListSet = new Set();
    const data = fileList.map((f) => {
      const code = checkFileExists(f.url).toString('utf-8', 0, 3);
      if (code !== '200') {
        mvListSet.add(f.filePath);
      } else {
        f.exists = 1;
        execSync(`rm -rf ${f.filePath}`);
      }
      delete f.filePath;
      return f;
    });
    const mvListStr = [...mvListSet].join(' ');
    if (mvListStr.length > 0) {
      execSync(`mkdir -p ${TEMP_DIR}/img`);
      execSync(`mv ${mvListStr} ${TEMP_DIR}/img`);
      const tarTarget = `${TAR_NAME}${TAR_EXT}`;
      execSync(
        `cd ${TEMP_DIR} && tar -czf ${tarTarget} ./img && rm -rf ./img && mv ${tarTarget} ../`
      );
      execSync(`rm -rf ${mvListStr}`);
      await uploadToCdn(tarTarget);
      fs.appendFileSync('upload.log', JSON.stringify(fileList, null, 4));
      fs.appendFileSync('upload.log', '\r\n' + new Date().toLocaleString());
    }
    ctx.body = getRenderData({
      data
    });
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = getRenderData({
      code: 1,
      msg: error
    });
  }
});

module.exports = router.routes();
