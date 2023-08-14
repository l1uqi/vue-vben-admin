import { app } from 'electron';
import { registerEvents } from './events';
import { createWindow } from './window';
import { windows } from './manage';

global.windows = windows;

app.whenReady().then(() => {
  createWindow();
  registerEvents();
});
