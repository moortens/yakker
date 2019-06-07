export default {
  alias: ['back'],
  fn: ({ socket }) => {
    socket.raw(new socket.Message('AWAY'));
  },
};
