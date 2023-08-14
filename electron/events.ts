import { ipcMain } from 'electron';
import { IWindow } from './types';
import { createWindow, maximizeWindow, minimizeWindow, closeWindow } from './window';
import { sendNotifacation } from './notifacation';
import { download } from './download';
import { getOsInfo } from './os';

const WINDOWS = 'window';

const NOTIFACATION = 'notifacation';

const DOWNLOAD = 'download';

const OS = 'os';

export const registerEvents = () => {
  ipcMain.on(WINDOWS, (event, data: IWindow) => {
    const currentWindow = global.windows.getCurrentWindow();
    if (data.type === 'create') {
      return createWindow(data.payload.url);
    }
    if (data.type === 'maximize') {
      return maximizeWindow(currentWindow);
    }
    if (data.type === 'minimize') {
      return minimizeWindow(currentWindow);
    }
    if (data.type === 'close') {
      return closeWindow(currentWindow);
    }
  });

  ipcMain.on(NOTIFACATION, async (event, data) => {
    if (data.type === 'send') {
      const res = await sendNotifacation(data);
      // 通知回调, 如果未来需要的话
      if (res.event === 'click') console.log('用户点击了通知', res);
      if (res.event === 'close') console.log('用户关闭了通知', res);
    }
  });

  ipcMain.on(DOWNLOAD, (event, data) => {
    if (data.type === 'download') {
      download({
        url: data.payload.url,
        destination: data.payload.destination,
        onProgress(percent) {
          // 通知渲染进程
          event.sender.send('message-to-renderer', {
            id: data.id,
            method: 'onProgress',
            data: {
              percent,
            },
          });
        },
        onSuccess(res) {
          event.sender.send('message-to-renderer', {
            id: data.id,
            method: 'onSuccess',
            data: res,
          });
        },
      });
    }
  });

  ipcMain.on(OS, async (event, data) => {
    if (data.type === 'info') {
      const info = await getOsInfo();
      event.sender.send('message-to-renderer', {
        id: data.id,
        method: 'onSuccess',
        data: {
          info,
        },
      });
    }
  });
};
