/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-06-09 17:51:57
 * @Last Modified by: qiuz
 */

/**
 *
 * @param {设置返回结果} opt
 */
function getRenderData(opt) {
  return Object.assign(
    {
      code: 0,
      msg: '',
      data: null
    },
    opt
  );
}

module.exports = {
  getRenderData
}
