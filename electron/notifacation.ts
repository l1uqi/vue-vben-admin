import { Notification } from 'electron';
import { INotifacation } from './types';

export const sendNotifacation = (msg: INotifacation) => {
  return new Promise((resolve, reject) => {
    const is = Notification.isSupported();
    const params = msg.payload;
    if (is) {
      const notify = new Notification({
        ...params,
      });
      notify.on('click', () => {
        resolve({
          event: 'click',
        });
      });
      notify.on('close', () => {
        resolve({
          event: 'close',
        });
      });
      notify.show();
    } else {
      console.error('当前环境不支持桌面通知');
      reject({
        event: 'error',
      });
    }
  });
};
