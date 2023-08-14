<template>
  <PageWrapper title="测试首页">
    <div class="lg:flex">
      <a-button @click="minimize">最小化</a-button>
      <a-button @click="maximized">最大化</a-button>
      <a-button @click="close">关闭</a-button>
      <a-button @click="sendNotifacation">发送通知</a-button>
      <a-button @click="openWindow('https://localhost:3100/')">打开新窗口</a-button>
      <a-button
        @click="
          download(
            'https://86024b6aa8bad6b0d64fa92d19cb5689.dlied1.cdntips.net/dldir1.qq.com/weixin/Windows/WeChatSetup.exe?mkey=64d5d20bdca86fa0&f=9947&cip=220.168.73.85&proto=https',
          )
        "
        >文件下载</a-button
      >
      <a-button @click="getOsInfo">获取系统信息</a-button>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  const maximized = () => {
    // eslint-disable-next-line no-undef
    ElectronAPI.window.maximize();
  };

  const minimize = () => {
    // eslint-disable-next-line no-undef
    ElectronAPI.window.minimize();
  };

  const close = () => {
    // eslint-disable-next-line no-undef
    ElectronAPI.window.close();
  };

  const openWindow = (url: string) => {
    // eslint-disable-next-line no-undef
    ElectronAPI.window.openWindow(url);
  };

  const sendNotifacation = () => {
    // eslint-disable-next-line no-undef
    ElectronAPI.notifacation.send({
      title: '测试',
      body: '测试通知内容',
    });
  };

  const download = (url: string) => {
    // eslint-disable-next-line no-undef
    ElectronAPI.downloadFile({
      url,
      destination: 'D:\\erp-test\\',
      callback: {
        onProgress: (data) => {
          console.log('onProgress', data);
        },
      },
    });
  };

  const getOsInfo = () => {
    // eslint-disable-next-line no-undef
    ElectronAPI.os.info({
      onSuccess: (data) => {
        console.log('ElectronAPI.os.info', data.info);
      },
    });
  };
</script>
