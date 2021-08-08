const redis = require('redis');

class Redis {
  constructor(options = {}, params = {}) {
    this.options = Object.assign({}, options);
    this.params = params;
    this.init();
  }
  init() {
    this.client = redis.createClient(this.options);
    this.client.on('error', function (error) {
      console.error(error);
    });
  }
  // 查询
  getByKey(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  // 增加/修改
  setKeyValue(key, value) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  // 删除
  delByKey(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  // 是否存在
  existsByKey(key) {
    return new Promise((resolve, reject) => {
      this.client.exists(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  }
}

let instance = null;
module.exports = function (options, params) {
  if (instance) {
    return instance;
  }
  instance = new Redis(options, params);
  return instance;
};
