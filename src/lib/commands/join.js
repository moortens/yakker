export default {
  alias: ['join', 'open'],
  fn: ({ socket }, target, data) => {
    if (!target) {
      return;
    }

    const [channel, key = undefined] = data.split(' ', 2);

    socket.join(channel, key);
  },
};
