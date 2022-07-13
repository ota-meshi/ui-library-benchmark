const channel = new MessageChannel();

export function queueTask(callback: () => void): void {
  channel.port1.onmessage = callback;
  channel.port2.postMessage(null);
}
