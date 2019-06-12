import IRC from 'irc-framework';
import { setServerStatus } from '../actions/server';

export default class Connection {
  socket = null;

  config = {
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

  send({ bid, data, tid = null }) {
    const { name: target } = this.buffers[bid];

    const message = new this.socket.Message('PRIVMSG', target, data);

    if (tid !== null) {
      message.tags['+draft/reply'] = tid;
    }

    this.socket.raw(message);
  }
}
