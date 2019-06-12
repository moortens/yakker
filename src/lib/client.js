import uuid from 'uuid/v4';
import Connection from './connection';
import history from './history';
import {
  setServerStatus,
  setServerOptions,
  setServerNickname,
} from '../actions/server';
import { setUserlistUser } from '../actions/userlist';

import commands from './commands';
import registerEventHandlers from './handlers';

export default class Client extends Connection {
  constructor(getState, dispatch) {
    super(getState, dispatch);

    this.getState = getState;
    this.dispatch = dispatch;

    this.typings = {};

    const handlers = registerEventHandlers({ client: this, dispatch });

    handlers.forEach(handler => {
      Object.keys(handler).forEach(event => {
        this.registerEventHandler(event, handler[event]);
      });
    });

    const {
      settings: { autoConnectOnLoad = false },
    } = this.getState();

    if (autoConnectOnLoad) {
      const {
        cache: { host, port, nickname },
      } = this.getState();

      if (host === null || port === null || nickname === null) {
        return;
      }

      this.connect({
        host,
        port,
        nickname,
        nick: nickname,
        username: nickname,
        gecos: nickname,
      });
    }
  }

  set options(options) {
    this.dispatch(setServerOptions(options));
  }

  get options() {
    const { server } = this.getState();
    return server;
  }

  set nickname(nickname) {
    this.dispatch(setServerNickname(nickname));
  }

  get nickname() {
    const {
      server: { nickname },
    } = this.getState();

    return nickname;
  }

  set status(status = 'disconnected') {
    this.dispatch(setServerStatus(status));
  }

  get status() {
    const {
      server: { status },
    } = this.getState();

    return status;
  }

  get settings() {
    const { settings } = this.getState();

    return settings;
  }

  get buffers() {
    const {
      buffer: { entities },
    } = this.getState();

    return entities;
  }

  get uids() {
    const {
      userlist: { ids },
    } = this.getState();

    return ids;
  }

  get bids() {
    const {
      buffer: { ids },
    } = this.getState();

    return ids;
  }

  getBufferIdFromTarget = e => {
    // hack
    // since IRC heuristics are a pain, this little helper function
    // performs some magic. It automatically figures out which buffer
    // a message belongs to
    let { target = null } = e;

    if (e.type !== undefined) {
      const { nick, type } = e;
      const mayHaveSelfTarget = ['action', 'privmsg', 'notice', 'tagmsg'];

      if (mayHaveSelfTarget.includes(type.toLowerCase())) {
        if (this.nickname === target) {
          if (e.from_server) {
            // target should be active buffer, or first if no active buffer
            /* if (this.buffer != null) {
              return this.buffer;
            } */
          }
          target = nick;
        }
      }
    } else if (target === null) {
      const { channel = null } = e;

      // no target nor channel mentioned, so we return null
      if (channel === null) {
        return null;
      }

      target = channel;
    }

    return this.bids[target.toLowerCase()];
  };

  getCommonBuffers = uid => {
    const {
      channels: { users },
    } = this.getState();

    const bids = [];

    Object.keys(users).forEach(bid => {
      if (users[bid][uid]) {
        bids.push(bid);
      }
    });

    return bids;
  };

  getUidByNick = nick => {
    return this.uids[nick.toLowerCase()];
  };

  getBidByName = name => {
    return this.bids[name.toLowerCase()];
  };

  // should be renamed something better
  addUser = (nick, ident, hostname, gecos = null) => {
    let uid = this.uids[nick.toLowerCase()];

    if (uid === null || uid === undefined) {
      uid = uuid();

      this.dispatch(setUserlistUser(uid, { nick, ident, hostname, gecos }));
    }

    return uid;
  };

  parse({ bid, data, tid = null }) {
    const { name } = this.buffers[bid];

    const re = /\/([^\s|$]+)(?:\s([^$]+))?/;

    if (re.test(data)) {
      // we got a command
      const [, command, trailing] = data.match(re);

      const fn = commands[command.toLowerCase()];
      if (!fn) {
        return;
      }

      Reflect.apply(fn, undefined, [this, name, trailing]);

      return;
    }

    this.privmsg({ bid, data, tid });
  }

  privmsg({ bid, data, tid = null }) {
    const {
      network: { cap },
    } = this.socket;
    const { name } = this.buffers[bid];
    const uid = this.uids[this.nickname.toLowerCase()];
    const id = uuid();
    const parent = tid;
    const type = 'PRIVMSG';
    const nick = this.nickname;
    const timestamp = new Date();
    const target = name;
    let status = 'sent';

    const message = new this.socket.Message('PRIVMSG', name, data);

    if (cap.isEnabled('draft/labeled-response')) {
      message.tags['draft/label'] = id;
    } else {
      status = 'delivered';
    }

    if (tid !== null) {
      message.tags['+draft/reply'] = tid;
    }

    this.socket.raw(message);

    this.dispatch({
      type: 'MESSAGE_ADD',
      payload: {
        uid,
        bid,
        id,
        target,
        data,
        type,
        nick,
        parent,
        timestamp,
        status,
      },
    });
  }

  sendTypingNotification({ bid }) {
    const { name: target } = this.buffers[bid];

    const message = new this.socket.Message('TAGMSG', target);
    message.tags['+draft/typing'] = 'active';

    this.socket.raw(message);
  }

  setTypingState = (bid, uid, timeout) => {
    this.dispatch({
      type: 'TYPING_ADD_USER',
      payload: {
        uid,
        bid,
      },
    });

    this.typings[bid] = {
      ...(this.typings[bid] || {}),
      [uid]: setTimeout(() => {
        this.dispatch({
          type: 'TYPING_DELETE_USER',
          payload: {
            uid,
            bid,
          },
        });
      }, timeout),
    };
  };

  getTypingState = (bid, uid) => {
    if (
      this.typings[bid] !== undefined &&
      this.typings[bid][uid] !== undefined
    ) {
      return this.typings[bid][uid];
    }
    return null;
  };

  clearTypingState = (bid, uid) => {
    const state = this.getTypingState(bid, uid);

    if (state) {
      clearTimeout(state);

      this.dispatch({
        type: 'TYPING_DELETE_USER',
        payload: {
          uid,
          bid,
        },
      });
    }
  };

  isCapabilityEnabled = cap => {
    return this.socket.network.cap.isEnabled(cap);
  };

  shouldNotifyOnPrivateMessages = () => this.settings.notifyPrivateMessages;

  shouldNotifyOnMentions = () => this.settings.notifyMentions;

  shouldNotifyOnAllMessages = () => this.settings.notifyAllMessages;

  spawnNativeNotification = ({ title, body, url, bid }) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, { body });

      notification.addEventListener('click', () => {
        history.push(url, {
          bid,
        });
      });
    }
  };
}
