/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-07-29 19:22:58
 * @Last Modified by: qiuz
 */

export const useClipboard = (e: ClipboardEvent) => {
  if (!(e.clipboardData && e.clipboardData.items)) {
    return;
  }
  let file;
  for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
    const item = e.clipboardData.items[i];
    if (item.kind === 'file') {
      file = item.getAsFile();
    }
  }
  return file;
};
