export interface IWindow {
  type: 'create' | 'close' | 'minimize' | 'maximize';
  payload: {
    [key: string]: any;
  };
}

export interface INotifacation {
  type: 'send';
  payload: {
    [key: string]: any;
  };
}

export interface IDownload {
  url: string;
  fileName: string;
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  maximized: boolean;
}

export interface WindowState {
  lastFocused?: number;
}

export interface CustomWindow {
  id: string;
  win: Electron.BrowserWindow;
  state: WindowState;
}
