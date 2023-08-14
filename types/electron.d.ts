interface Callback {
  onSuccess?: (string) => void;
  onError?: (string) => void;
  onProgress?: (percent: string) => void;
}

interface downloadParams {
  url: string;
  destination: string;
  callback?: Callback;
}

declare namespace ElectronAPI {
  namespace os {
    function info(params: Callback): void;
  }
  namespace window {
    function maximize(): void;
    function minimize(): void;
    function close(): void;
    function openWindow(url: string): void;
  }
  namespace notifacation {
    function send(notifacation: { title: string; subtitle?: string; body?: string }): void;
  }
  function downloadFile(params: downloadParams): void;
  function increaseWindowOperating(): void;
}
