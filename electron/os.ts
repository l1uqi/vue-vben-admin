import os from 'os';

const exec = require('child_process').exec;

const macRegex = /(?:[a-z0-9]{1,2}[:-]){5}[a-z0-9]{1,2}/i;

const zeroRegex = /(?:[0]{1,2}[:-]){5}[0]{1,2}/;

// 操作系统的平台
const platform = os.platform();
// CPU架构
const arch = os.arch();
// 返回一个包含所有CPU核心信息的数组
const cpus = os.cpus();
// 总内存
const totalmem = os.totalmem();
// 空闲内存
const freemem = os.freemem();
// 操作系统默认的临时目录路径
const tmpdir = os.tmpdir();
// 用户信息
const userInfo = os.userInfo();

function unique(arr) {
  return Array.from(new Set(arr));
}

const getMAC = () => {
  const list = os.networkInterfaces();
  const macList = [];
  for (const [_, parts] of Object.entries(list)) {
    if (!parts) continue;
    for (const part of parts) {
      if (zeroRegex.test(part.mac) === false) {
        macList.push(part.mac);
      }
    }
  }
  return unique(macList);
};

export const getMacAddress = () => {
  return new Promise((resolve, _) => {
    let macList = [];
    const cmdStr1 = 'getmac';
    const cmdPath = './';
    // 子进程名称
    let workerProcess;
    runExec(cmdStr1);
    function runExec(cmdStr) {
      workerProcess = exec(cmdStr, { cwd: cmdPath });
      // 打印正常的后台可执行程序输出
      workerProcess.stdout.on('data', function (data) {
        data
          .toString('utf8')
          .trim()
          .split('\n')
          .forEach(function (v, _) {
            if (v.toLowerCase().match(macRegex)) {
              macList = macList.concat(v.toLowerCase().match(macRegex));
            }
          });
      });

      workerProcess.on('close', () => {
        resolve(macList.length === 0 ? getMAC() : macList.join(',').replace(/-/g, ':'));
      });
    }
  });
};

export const getOsInfo = async () => {
  const mac = await getMacAddress();
  return {
    platform,
    arch,
    cpus,
    freemem,
    tmpdir,
    totalmem,
    userInfo,
    mac,
  };
};
