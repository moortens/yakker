export const connectToNetwork = (host, port, nickname) => ({
  type: 'WS::CONNECT',
  payload: {
    host,
    port,
    nickname,
  },
});