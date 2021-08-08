/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-02-05 23:39:57
 * @Last Modified by: qiuz
 */

const getTransaction = (db: IDBDatabase, storeName: string, mode?: IDBTransactionMode) => {
  const res = db.transaction([storeName], mode);
  res.onerror = (ev) => {
    console.warn(ev);
  };
  return res;
};

export const openDB = ({
  dbName,
  version = 1,
  storeName = [''],
  storeOption = { autoIncrement: true }
}: {
  dbName: string;
  version?: number;
  storeName?: string[];
  storeOption?: IDBObjectStoreParameters;
}): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    let db: IDBDatabase;
    if (!dbName) reject('db name shoudle be string');

    const request = window.indexedDB.open(dbName, version);

    request.onerror = function (event) {
      console.warn('open db fail:', event);
      reject(event);
    };

    request.onsuccess = function (event) {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = function (event: any) {
      db = event.target.result;
      let objectStore;
      storeName.forEach((name: string) => {
        if (!db.objectStoreNames.contains(name)) {
          objectStore = db.createObjectStore(name, storeOption);
        }
      });
    };
  });

export const addStore = ({
  db,
  storeName,
  data = {}
}: {
  db: IDBDatabase;
  storeName: string;
  data: any;
}) =>
  new Promise((resolve, reject) => {
    if (!db) reject('db is null');
    if (!storeName) reject('storeName is null');
    const request = getTransaction(db, storeName, 'readwrite').objectStore(storeName).add(data);

    request.onsuccess = function (event) {
      resolve(event);
    };

    request.onerror = function (event) {
      console.warn('new data fail');
      reject(event);
    };
  });

export const updateStore = ({
  db,
  storeName,
  data = {}
}: {
  db: IDBDatabase;
  storeName: string;
  data: any;
}) =>
  new Promise(async (resolve, reject) => {
    if (!db) reject('db is null');
    if (!storeName) reject('storeName is null');
    const res = await readStore({ db, storeName, key: data.key });
    const request = getTransaction(db, storeName, 'readwrite')
      .objectStore(storeName)
      [res ? 'put' : 'add'](data);

    request.onsuccess = function (event) {
      resolve(event);
    };

    request.onerror = function (event) {
      console.warn('update data fail');
      reject(event);
    };
  });

export const readStore = ({
  db,
  storeName,
  key,
  type = 'get'
}: {
  db: IDBDatabase;
  storeName: string;
  key?: string | number;
  type?: 'get' | 'getAll';
}): Promise<any> =>
  new Promise((resolve, reject) => {
    if (!db) reject('db is null');
    if (!storeName) reject('storeName is null');
    const transaction = getTransaction(db, storeName);
    const objectStore = transaction.objectStore(storeName);
    const request =
      type === 'getAll' ? objectStore.getAll() : objectStore.get(key as string | number);

    request.onerror = function (event) {
      console.warn('read data fail');
      reject(event);
    };

    request.onsuccess = function (event) {
      if (request.result) {
        resolve(request.result);
      } else {
        resolve(undefined);
      }
    };
  });

export const removeStore = ({
  db,
  storeName,
  key
}: {
  db: IDBDatabase;
  storeName: string;
  key?: string | number;
}): Promise<any> =>
  new Promise((resolve, reject) => {
    if (!db) reject('db is null');
    if (!storeName) reject('storeName is null');
    const transaction = getTransaction(db, storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(key as string | number);

    request.onsuccess = function (event) {
      resolve(event);
    };
    request.onerror = function (event) {
      console.warn('remove data fail');
      reject(event);
    };
  });

export const getAllKeys = ({
  db,
  storeName
}: {
  db: IDBDatabase;
  storeName: string;
}): Promise<any> =>
  new Promise((resolve, reject) => {
    if (!db) reject('db is null');
    if (!storeName) reject('storeName is null');
    const transaction = getTransaction(db, storeName);
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAllKeys();

    request.onsuccess = function (event) {
      resolve(request.result);
    };
    request.onerror = function (event) {
      console.warn('get all keys fail');
      reject(event);
    };
  });

export type PageData = {
  code: number;
  total: number;
  data: any[];
};

export const getDataByPage = ({
  db,
  storeName,
  pageNum,
  pageSize = 10
}: {
  db: IDBDatabase;
  storeName: string;
  pageNum: number;
  pageSize?: number;
}): Promise<PageData> =>
  new Promise(async (resolve, reject) => {
    if (!db) reject('db is null');
    if (!storeName) reject('storeName is null');
    const allKeys: any[] = await getAllKeys({ db, storeName });
    if (allKeys.length < 1) {
      resolve({ code: 0, data: [], total: 0 });
      return;
    }
    const transaction = getTransaction(db, storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const count = pageSize || 10;
    let keysList = [];
    const allKeysReverse = allKeys.reverse();
    for (let i = 0, len = allKeysReverse.length; i < len; i += count) {
      keysList.push(allKeysReverse.slice(i, i + count));
    }
    const currentKeys = keysList[(pageNum || 1) - 1];
    const start = Math.min(...currentKeys);
    const end = Math.max(...currentKeys);
    const boundKeyRange = IDBKeyRange.bound(start, end);
    const rowData: any[] = [];
    const request = objectStore.openCursor(boundKeyRange);
    request.onsuccess = function (event: any) {
      const cursor = event.target.result;
      if (!cursor) {
        resolve({ code: 0, total: allKeys.length, data: rowData.reverse() });
        return;
      }
      rowData.push(cursor.value);
      cursor.continue();
    };
    request.onerror = function (event) {
      console.warn('read data fail');
      reject({ code: 1, error: event });
    };
  });
