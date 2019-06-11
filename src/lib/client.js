import uuid from 'uuid/v4';
import Connection from './connection';
import { addBuffer, setCurrentBuffer } from '../actions/buffer';
import {
  addChanlist,
  clearChanlist,
  setChanlistLoading,
} from '../actions/chanlist';
import {
  addChannel,
  setChannelTopic,
  addChannelMember,
  removeChannelMember,
} from '../actions/channel';
import {
  setServerStatus,
  setServerOptions,
  setServerNickname,
} from '../actions/server';
import {
  setUserlistUser,
  renameUserlistUser,
  removeUserlistUser,
} from '../actions/userlist';
import { setCache } from '../actions/cache';

import addMessage from '../actions/message';
import history from './history';
import commands from './commands';

export default class Client extends Connection {
  constructor(getState, dispatch) {
    super(getState, dispatch);

    this.getState = getState;
    this.dispatch = dispatch;

    this.typings = {};

    this.registerEventHandler('connected', this.onConnectedEvent);
    this.registerEventHandler('join', this.onJoinEvent);
    this.registerEventHandler('message', this.onMessageEvent);
    this.registerEventHandler('topic', this.onTopicEvent);
    this.registerEventHandler('userlist', this.onUserlistEvent);
    this.registerEventHandler('wholist', this.onWhoEvent);
    this.registerEventHandler('server options', this.onOptionsEvent);
    this.registerEventHandler('tagmsg', this.onTagmsgEvent);
    this.registerEventHandler('away', this.onAwayEvent);
    this.registerEventHandler('back', this.onBackEvent);
    this.registerEventHandler('part', this.onPartEvent);
    this.registerEventHandler('quit', this.onQuitEvent);
    this.registerEventHandler('channel list start', this.onListStartEvent);
    this.registerEventHandler('channel list', this.onListEvent);
    this.registerEventHandler('channel list end', this.onListEndEvent);

    this.registerEventHandler('raw', e => {
      console.log(e);
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
      const mayHaveSelfTarget = ['action', 'privmsg', 'notice'];

      if (mayHaveSelfTarget.includes(type.toLowerCase())) {
        if (this.nickname === target) {
          if (e.from_server) {
            // target should be active buffer, or first if no active buffer
            /*if (this.buffer != null) {
              return this.buffer;
            }*/
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

  onListStartEvent = () => {
    this.dispatch(clearChanlist());
    this.dispatch(setChanlistLoading(true));
  };

  onListEvent = channels => {
    if (channels === undefined) {
      return;
    }

    channels.forEach(({ channel, topic: data, num_users: users }) => {
      /*
       * some ircd's provide the modes of a channel in the topic, like
       * inspircd/unreal. These are used for badges to indicate moderated
       * or key/invite only channels.
       */
      let [, modes = '', topic] = /^(?:\[\+([^\]]+)\] ?)?([^$]+)$/.exec(data);

      modes = modes.replace(/\s<[^>]+>/g, '').split('');

      topic = topic.replace(
        // eslint-disable-next-line no-control-regex
        /\x02|\x0D|\x1F|\x1E|\x11|\x03\d{1,2}(?:,\d{1,2})?|\x04[0-9a-fA-F]{6}|\x16|\x0f/g,
        '',
      );

      this.dispatch(addChanlist(channel, topic, users, modes));
    });
  };

  onListEndEvent = () => {
    this.dispatch(setChanlistLoading(false));
  };

  onPartEvent = e => {
    const { nick, channel: target, message, time: timestamp } = e;

    const type = 'part';
    const id = uuid();
    const bid = this.bids[target.toLowerCase()];
    const uid = this.uids[nick.toLowerCase()];

    this.dispatch(
      addMessage({
        id,
        uid,
        bid,
        target,
        type,
        nick,
        message,
        timestamp,
      }),
    );
    this.dispatch(removeChannelMember(bid, uid));
  };

  onQuitEvent = e => {
    const { nick, message: data, time: timestamp } = e;

    const id = uuid();

    const uid = this.uids[nick.toLowerCase()];
    const bids = this.getCommonBuffers(uid);

    bids.forEach(bid => {
      this.dispatch(
        addMessage({
          id,
          uid,
          bid,
          data,
          type: 'QUIT',
          nick,
          timestamp,
        }),
      );
      this.dispatch(removeChannelMember(bid, uid));
    });
  };

  onAwayEvent = e => {
    const { self, nick, message } = e;

    const uid = this.uids[nick.toLowerCase()];
    this.dispatch(
      setUserlistUser(uid, {
        nick,
        away: true,
      }),
    );
  };

  onBackEvent = e => {
    const { self, nick, message } = e;

    const uid = this.uids[nick.toLowerCase()];
    this.dispatch(
      setUserlistUser(uid, {
        nick,
        away: false,
      }),
    );
  };

  onOptionsEvent = e => {
    const {
      cap: capabilities,
      options: { NETWORK: network, PREFIX: prefix, CHANTYPES: chantypes },
    } = e;

    this.options = {
      capabilities,
      network,
      prefix,
      chantypes,
    };
  };

  onConnectedEvent = ({ nick }) => {
    this.status = 'connected';
    this.nickname = nick.toLowerCase();

    this.socket.list();
    /*this.socket.join('#ninja');
    this.socket.join('#announcements');
    this.socket.join('#general');*/
    /* this.socket.join('#go');
    this.socket.join('#announcements');
    this.socket.join('#javascript'); */

    // store server + port in cache, rejoin previously joined channels
    const { host, port } = this.socket.options;

    this.dispatch(
      setCache({
        host,
        port,
      }),
    );
  };

  onJoinEvent = e => {
    const { nick, channel: target, ident, hostname, gecos } = e;
    const bid = this.bids[target.toLowerCase()] || uuid();

    if (nick.toLowerCase() === this.nickname) {
      this.socket.who(target);

      this.dispatch(addChannel(bid, target));
      this.dispatch(addBuffer(bid, target, true));

      // store joined channels in cache, remove on part
      return;
    }

    const id = uuid();
    const uid = this.addUser(nick, ident, hostname, gecos);

    this.dispatch(
      addMessage({
        id,
        uid,
        bid,
        target,
        type: 'JOIN',
        nick,
      }),
    );
    this.dispatch(addChannelMember(bid, uid, []));
  };

  onTopicEvent = e => {
    const { channel, topic } = e;
    const bid = this.bids[channel.toLowerCase()];
    this.dispatch(setChannelTopic(bid, topic));
  };

  onMessageEvent = e => {
    const {
      tags,
      nick,
      ident,
      hostname,
      message: data,
      type,
      from_server: fromServer,
    } = e;

    const timestamp = Date.parse(tags['server-time']) || new Date();
    const id = tags['draft/msgid'] || uuid();
    const parent = tags['+draft/reply'] || null;
    const label = tags['draft/label'] || null;

    // simply ignore server messages per now
    if (fromServer) {
      return;
    }

    console.log(e);

    let bid = this.getBufferIdFromTarget(e);

    let { target } = e;

    if (this.nickname === target) {
      target = nick;

      if (bid === undefined || bid === null) {
        bid = uuid();

        this.dispatch(addBuffer(bid, target));
      }

      if (this.settings.notifyPrivateMessages) {
        if (Notification.permission === 'granted') {
          const notification = new Notification(
            `Private message from ${nick}`,
            {
              body: data,
            },
          );

          notification.addEventListener('click', e => {
            history.push(`/message/${nick.toLowerCase()}`, {
              bid,
            });
          });
        }
      }
    }

    if (bid === null) {
      bid = uuid();
    }

    // check if nick has an uid, if not, create one and add to userlist
    const uid = this.addUser(nick, ident, hostname);

    if (
      this.typings[bid] !== undefined &&
      this.typings[bid][uid] !== undefined
    ) {
      clearTimeout(this.typings[bid][uid]);

      this.dispatch({
        type: 'TYPING_DELETE_USER',
        payload: {
          uid,
          bid,
        },
      });
    }
    if (label) {
      const status = 'delivered';
      this.dispatch({
        type: 'MESSAGE_UPDATE',
        payload: {
          label,
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
      return;
    }
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
      },
    });
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

  onUserlistEvent = e => {
    const { channel, users } = e;

    const bid = this.bids[channel.toLowerCase()];

    users.forEach(user => {
      const { nick, ident, hostname, modes } = user;
      const uid = this.addUser(nick, ident, hostname);

      this.dispatch(addChannelMember(bid, uid, modes));
    });
  };

  onWhoEvent = e => {
    const { users } = e;

    users.forEach(user => {
      const {
        nick,
        ident,
        hostname,
        away = false,
        real_name: gecos,
        account = null,
      } = user;

      const uid = this.uids[nick.toLowerCase()] || uuid();

      this.dispatch(
        setUserlistUser(uid, {
          nick,
          ident,
          hostname,
          away,
          gecos,
          account,
        }),
      );
    });
  };

  onTagmsgEvent = e => {
    const {
      nick,
      ident,
      hostname,
      target,
      tags,
      time: timestamp = new Date(),
    } = e;

    const id = tags['draft/msgid'] || uuid();
    const typing = tags['+draft/typing'];

    const uid = this.addUser(nick, ident, hostname);
    const bid = this.bids[target.toLowerCase()];

    if (!bid) {
      return;
    }

    if (typing) {
      if (
        this.typings[bid] !== undefined &&
        this.typings[bid][uid] !== undefined
      ) {
        clearTimeout(this.typings[bid][uid]);
      }

      if (typing === 'active' || typing === 'paused') {
        this.dispatch({
          type: 'TYPING_ADD_USER',
          payload: {
            uid,
            bid,
            timestamp,
          },
        });

        this.typings[bid] = {
          ...(this.typings[bid] || {}),
          [uid]: setTimeout(
            () => {
              this.dispatch({
                type: 'TYPING_DELETE_USER',
                payload: {
                  uid,
                  bid,
                },
              });
            },
            typing === 'paused' ? 30000 : 6000,
          ),
        };
      } else if (typing === 'done') {
        this.dispatch({
          type: 'TYPING_DELETE_USER',
          payload: {
            uid,
            bid,
          },
        });
      }

      return;
    }

    this.dispatch(
      addMessage({ id, uid, bid, target, type: 'tagmsg', tags, timestamp }),
    );
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
    const { network: { cap } } = this.socket;
    const { name } = this.buffers[bid];
    const uid = this.uids[this.nickname.toLowerCase()]
    const id = uuid();
    const parent = tid;
    const type = 'PRIVMSG';
    const nick = this.nickname;
    const timestamp = new Date();
    const target = name;
    const status = 'sent';

    const message = new this.socket.Message('PRIVMSG', name, data);

    if (cap.isEnabled('draft/labeled-response')) {
      message.tags['draft/label'] = id;
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
}
