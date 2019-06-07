export default {
  alias: ['part', 'close', 'leave'],
  fn: ({ socket }, target, data = '') => {
    if (!target) {
      return;
    }

    const re = /^(#[^\s|$]+)(?:\s([^$]+))?/;

    const [, channel, message] = data.match(re) || [null, target, data];

    socket.part(channel, message);
  },
};
