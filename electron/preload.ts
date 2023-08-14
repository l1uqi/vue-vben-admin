const { ipcRenderer, contextBridge } = require('electron');

const topDivStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  height: '25px',
  width: '90%',
  display: 'flex',
  zIndex: '9999',
};

const operatingStyle = {
  top: '0',
  right: '0',
  width: '80px',
  height: '25px',
  position: 'absolute',
  zIndex: '10000',
};

const emitter = {};

// 添加可拖拽区域
const initTopDrag = () => {
  const topDiv = document.createElement('div'); // 创建节点
  topDiv.innerHTML = '<div style="pointer-events: none; flex:1;-webkit-app-region:drag" />';
  Object.assign(topDiv.style, topDivStyle);
  document.body.insertBefore(topDiv, document.body.firstChild);
};

// 新增窗口操作按钮
const increaseWindowOperating = () => {
  const operating = document.createElement('div'); // 创建节点
  Object.assign(operating.style, operatingStyle);
  operating.innerHTML =
    '<span style="margin: 6px; width: 12px;display: inline-block;height: 12px;border: 1px solid rgb(80, 161, 71);text-align: center;overflow: hidden;line-height: 12px;border-radius: 25px;background: rgb(97, 196, 87);" id="minSize"><svg t="1657696143457" style="display: none;width: 10px;height: 10px;" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="854" width="200" height="200"><path d="M791.333 465.446l-558.668 0c-25.73 0-46.554 20.847-46.554 46.554s20.823 46.554 46.554 46.554l558.666 0c25.732 0 46.555-20.847 46.555-46.554s-20.823-46.554-46.554-46.554z" p-id="855"></path></svg></span><span class="amber-tools-header-right-min" style="margin: 6px;width: 12px;display: inline-block;height: 12px;border: 1px solid rgb(199, 156, 62);text-align: center;overflow: hidden;line-height: 12px;border-radius: 25px;background: rgb(244,191,77);" id="maxSize"><svg t="1657697605627" style="display: none;width:10px;height:10px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="998" width="200" height="200"><path d="M856 376H648V168c0-8.8-7.2-16-16-16H168c-8.8 0-16 7.2-16 16v464c0 8.8 7.2 16 16 16h208v208c0 8.8 7.2 16 16 16h464c8.8 0 16-7.2 16-16V392c0-8.8-7.2-16-16-16z m-480 16v188H220V220h360v156H392c-8.8 0-16 7.2-16 16z m204 52v136H444V444h136z m224 360H444V648h188c8.8 0 16-7.2 16-16V444h156v360z" p-id="999"></path></svg></span><span class="amber-tools-header-right-min" style="margin: 6px;width: 12px;display: inline-block;height: 12px;border: 1px solid rgb(214, 73, 54);text-align: center;overflow: hidden;line-height: 12px;border-radius: 25px;background: rgb(255, 87, 64);" id="windowClose"><svg t="1657698038498" style="display: none;width: 10px;height:10px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1142" width="200" height="200"><path d="M572.16 512l183.466667-183.04a42.666667 42.666667 0 1 0-60.586667-60.586667L512 451.84l-183.04-183.466667a42.666667 42.666667 0 0 0-60.586667 60.586667l183.466667 183.04-183.466667 183.04a42.666667 42.666667 0 0 0 0 60.586667 42.666667 42.666667 0 0 0 60.586667 0l183.04-183.466667 183.04 183.466667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667z" p-id="1143"></path></svg></span';
  document.body.insertBefore(operating, document.body.firstChild);
  registerOperatingMethod();
};

const registerOperatingMethod = () => {
  const minSize = document.querySelector('#minSize');
  const maxSize = document.querySelector('#maxSize');
  const windowClose = document.querySelector('#windowClose');
  minSize.onclick = () => {
    const window = {
      type: 'minimize',
    };
    ipcRenderer.send('window', window);
  };
  maxSize.onclick = () => {
    const window = {
      type: 'maximize',
    };
    ipcRenderer.send('window', window);
  };
  windowClose.onclick = () => {
    const window = {
      type: 'close',
    };
    ipcRenderer.send('window', window);
  };
};

// 最大化窗口
const maximize = () => {
  const window = {
    type: 'maximize',
  };
  ipcRenderer.send('window', window);
};

// 最小化窗口
const minimize = () => {
  const window = {
    type: 'minimize',
  };
  ipcRenderer.send('window', window);
};

// 窗口关闭
const closeWindow = () => {
  const window = {
    type: 'close',
  };
  ipcRenderer.send('window', window);
};

// 打开页面
const openWindow = (url) => {
  const window = {
    type: 'create',
    payload: {
      url: url,
    },
  };
  ipcRenderer.send('window', window);
};

// 设置桌面通知
const setNotifacations = (params) => {
  const notifacation = {
    type: 'send',
    payload: params,
  };
  ipcRenderer.send('notifacation', notifacation);
};

// 文件下载
const downloadFile = (params) => {
  const { url, destination, callback } = params;
  const timeStr = new Date().getTime();
  const download = {
    type: 'download',
    id: timeStr,
    payload: {
      url,
      destination,
    },
  };
  if (callback) {
    emitter[timeStr] = callback;
  }
  ipcRenderer.send('download', download);
};

// 注册回调方法
const resigerCallback = () => {
  ipcRenderer.on('message-to-renderer', (event, arg) => {
    const callback = emitter[arg.id];
    if (callback) {
      callback[arg.method](arg.data);
    }
    if (callback['onSuccess']) {
      delete emitter[arg.id];
    }
  });
};

// 获取系统信息
const getOsInfo = (callback) => {
  const timeStr = new Date().getTime();
  const info = {
    type: 'info',
    id: timeStr,
  };
  if (callback) {
    emitter[timeStr] = callback;
  }
  ipcRenderer.send('os', info);
};

window.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
  initTopDrag();
  resigerCallback();
});

contextBridge.exposeInMainWorld('ElectronAPI', {
  increaseWindowOperating,
  notifacation: {
    send: setNotifacations,
  },
  downloadFile,
  window: {
    maximize,
    minimize,
    closeWindow,
    openWindow,
  },
  os: {
    info: getOsInfo,
  },
});
