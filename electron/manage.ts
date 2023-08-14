import { app, BrowserWindow } from 'electron';
import { CustomWindow, WindowState } from './types';

export const windows = {
  openWindows: [] as CustomWindow[],
  nextId: 1,
  getCurrentWindow: function (): BrowserWindow | undefined {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      return focusedWindow;
    }
  },
  addWindow: function (window: Electron.BrowserWindow): void {
    windows.openWindows.push({
      id: windows.nextId.toString(),
      win: window,
      state: {},
    });

    window.on('focus', function () {
      windows.getState(window).lastFocused = Date.now();
    });

    window.on('close', function () {
      window.setBrowserView(null);
    });

    window.on('closed', function () {
      windows.removeWindow(window);
      if (windows.openWindows.length === 0 && process.platform !== 'darwin') {
        app.quit();
      }
    });

    window.show();

    windows.nextId++;
  },
  removeWindow: function (window: Electron.BrowserWindow): void {
    const index = windows.openWindows.findIndex((w) => w.win === window);
    if (index !== -1) {
      windows.openWindows.splice(index, 1);
    }

    if (windows.openWindows.length === 0) {
      console.log('窗口已全部销毁.');
    }
  },
  getAll: function (): Electron.BrowserWindow[] {
    return windows.openWindows.map((w) => w.win);
  },
  getState: function (window: Electron.BrowserWindow): WindowState {
    const customWindow = windows.openWindows.find((w) => w.win === window);
    if (customWindow) {
      return customWindow.state;
    } else {
      return {};
    }
  },
};
