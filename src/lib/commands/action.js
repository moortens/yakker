export default {
  alias: ['me', 'action'],
  fn: ({ socket }, target, data) => {
    if (!target) {
      return new Error('No buffer, wtf?')
    }
  
    socket.action(target, data);
  },
};

