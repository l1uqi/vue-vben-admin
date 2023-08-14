import { IDownload } from './types';
import http from 'http';
import https from 'https';
import fs from 'fs';

interface downloadParams {
  url: string;
  destination: string;
  onSuccess?: (string) => void;
  onError?: (string) => void;
  onProgress?: (percent: string) => void;
}

export const download = (params: downloadParams) => {
  const { url, destination, onSuccess, onError, onProgress } = params;
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  const file = fs.createWriteStream(destination + '/BDCP.msi');
  const protocol = url.startsWith('https') ? https : http;
  let totalSize = 0;
  let downloadedSize = 0;
  protocol
    .get(url, (response) => {
      totalSize = parseInt(response.headers['content-length'], 10);
      response.pipe(file);

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (onProgress) {
          const percent = ((downloadedSize / totalSize) * 100).toFixed(2);
          onProgress(percent);
        }
      });

      file.on('finish', () => {
        file.close();
        if (onSuccess) {
          onSuccess(`文件已下载到：${destination}`);
        }
      });
    })
    .on('error', (err) => {
      fs.unlink(destination, () => {}); // 删除文件（如果存在）
      if (onError) {
        onError(`文件下载失败：${err.message}`);
      }
    });
};

export const downloadFile = (task: IDownload) => {
  console.log(task);
};
