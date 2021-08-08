/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-06-09 18:01:51
 * @Last Modified by: qiuz
 */

const Router = require('koa-router');
const { getRenderData } = require('../util/utils');

const redisConfig = [];

const RedisControl = require('../util/redis.class')(redisConfig);

const router = new Router();

router.get('/get', async (ctx, next) => {
  const { key } = ctx.query;
  if (!key) {
    ctx.status = 500;
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: 'key不能为空'
      }
    });
  }
  console.log(`redis get ${key}......`);
  try {
    const data = await RedisControl.getByKey(key);
    ctx.body = getRenderData({
      data
    });
  } catch (err) {
    ctx.status = 500;
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: err
      }
    });
  }
});

router.post('/set', async (ctx, next) => {
  const { key, val } = ctx.request.body.data;
  if (!key || !val) {
    ctx.status = 500;
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: '入参错误'
      }
    });
  }
  try {
    const data = await RedisControl.setKeyValue(key, val);
    console.log(`redis set ${key} ${val} success`);
    ctx.body = getRenderData({
      data
    });
  } catch (err) {
    ctx.status = 500;
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: err
      }
    });
  }
});

router.get('/del', async (ctx, next) => {
  const { key } = ctx.query;
  if (!key) {
    ctx.status = 500;
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: 'key不能为空'
      }
    });
  }
  try {
    const data = await RedisControl.delByKey(key);
    console.log(`redis del ${key} success:`, data);
    ctx.body = getRenderData({
      data
    });
  } catch (err) {
    ctx.status = 500;
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: err
      }
    });
  }
});

router.get('/exists', async (ctx, next) => {
  const { key } = ctx.query;
  if (!key) {
    ctx.status = 500;
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: 'key不能为空'
      }
    });
  }
  try {
    const exist = await RedisControl.existsByKey(key);
    ctx.body = getRenderData({
      data: {
        exist
      }
    });
  } catch (err) {
    ctx.status = 500;
    ctx.body = getRenderData({
      data: {
        code: 1,
        msg: err
      }
    });
  }
});

module.exports = router.routes();
