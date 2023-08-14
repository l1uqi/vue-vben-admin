import { BrowserWindow, screen } from 'electron';
import { WindowBounds } from './types';
import path from 'path';

// const URL = is_dev
//   ? `${process.env.VITE_DEV_SERVER_URL}` // vite 启动的服务器地址
//   : `file://${join(__dirname, '../dist/index.html')}`; // vite 构建后的静态文件地址
const URL = 'http://localhost:5173/';

console.log(process.env.VITE_DEV_SERVER_URL);

export const maximizeWindow = (window: BrowserWindow) => {
  if (window.isMaximized()) {
    window.restore();
  } else {
    window.maximize();
  }
};

export const minimizeWindow = (window: BrowserWindow) => {
  window.minimize();
};

export const closeWindow = (window: BrowserWindow) => {
  window.close();
};

export const createWindow = (url?: string) => {
  const bounds: WindowBounds = {
    x: 0,
    y: 0,
    width: parseInt(`${screen.getPrimaryDisplay().workAreaSize.width * 0.85}`, 10),
    height: parseInt(`${screen.getPrimaryDisplay().workAreaSize.height * 0.85}`, 10),
    maximized: true,
  };
  return createWindowWithBounds(bounds, url || URL);
};

const createWindowWithBounds = (bounds: WindowBounds, url: string): BrowserWindow => {
  const newWin = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    minWidth: process.platform === 'win32' ? 400 : 320,
    minHeight: 350,
    movable: true,
    // frame: false,
    frame: false,
    show: false,
    center: true,
    resizable: true,
    // transparent: true,
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, './build/icons/icon.ico'),
    backgroundColor: '#fff',
  });

  newWin.loadURL(url);

  newWin.once('ready-to-show', () => {
    newWin.show();
  });

  global.windows.addWindow(newWin);

  return newWin;
};
