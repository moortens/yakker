export default {
  alias: ['away'],
  fn: ({ socket }, target, data) => {
    if (!target) {
      return new Error('No buffer, wtf?')
    }
  
    socket.raw(new socket.Message('AWAY', data));
  },
};

