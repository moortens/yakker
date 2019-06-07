import Client from '../lib/client';

export default () => {
  return store => next => {
    let client = null;
    return action => {
      const { type, payload = {} } = action;
      switch (type) {
        case '@@INIT_STORE': {
          const { getState, dispatch } = store;
          client = new Client(getState, dispatch);

          break;
        }

        case 'WS::CONNECT': {
          const { host, port, nickname } = payload;

          client.connect({
            host,
            port,
            nick: nickname,
            username: nickname,
            gecos: nickname,
          });

          break;
        }

        case 'WS::SEND': {
          client.parse(payload);

          break;
        }

        case 'WS::JOIN': {
          client.join(payload.channel);

          break;
        }

        default:
          break;
      }

      return next(action);
    };
  };
};
