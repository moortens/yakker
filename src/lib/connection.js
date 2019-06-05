import IRC from 'irc-framework';
import { setServerStatus } from '../actions/server';

export default class Connection {
  socket = null;

  config = {
    /*host: '51.68.134.68',
    port: 7002,*/
    
    /*host: '127.0.0.1',
    port: 8080,*/
    path: '/webirc/websocket/',
    
    tls: false,
    nick: null,
    username: null,
    gecos: null,
    enable_echomessage: true,
  };

  constructor(getState, dispatch) {
    this.getState = getState;
    this.dispatch = dispatch;

    this.handlers = {};
  }

  connect(opts = {}) {
    const config = Object.assign({}, this.config, opts);

    this.socket = new IRC.Client(config);

    this.socket.requestCap('message-tags');
    this.socket.requestCap('draft/labeled-response');

    this.socket.connect();

    Object.keys(this.handlers).forEach(event => {
      this.socket.on(event, this.handlers[event]);
    });

    this.dispatch(setServerStatus('connecting'));
  }

  join(channel) {
    this.socket.join(channel);
  }

  registerEventHandler = (event, fn) => {
    if (typeof fn !== 'function') {
      throw new TypeError('use() extensions only accepts functions');
    }

    this.handlers[event] = fn;
  };
}
