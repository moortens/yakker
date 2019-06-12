import { setCache } from '../../actions/cache';

export default ({ client, dispatch }) => {
  const { registerEventHandler } = client;

  const onConnectedEvent = ({ nick }) => {
    client.status = 'connected';
    client.nickname = nick.toLowerCase();

    client.socket.list();

    // store server + port in cache, rejoin previously joined channels
    const { host, port } = client.socket.options;

    dispatch(
      setCache({
        host,
        port,
      }),
    );
  };

  const onOptionsEvent = e => {
    const {
      cap: capabilities,
      options: { NETWORK: network, PREFIX: prefix, CHANTYPES: chantypes },
    } = e;

    client.options = {
      capabilities,
      network,
      prefix,
      chantypes,
    };
  };

  return {
    connected: onConnectedEvent,
    'server options': onOptionsEvent,
  };
};
