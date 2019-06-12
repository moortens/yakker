import uuid from 'uuid/v4';
import { escapeRegExp } from 'lodash';

import { addBuffer } from '../../actions/buffer';
import addMessage from '../../actions/message';

export default ({ client, dispatch }) => {
  const {
    addUser,
    setTypingState,
    clearTypingState,
    getBufferIdFromTarget,
    getUidByNick,
    shouldNotifyOnPrivateMessage,
    shouldNotifyOnAllMessages,
    shouldNotifyOnMentions,
    spawnNativeNotification,
  } = client;

  const onTagmsgEvent = event => {
    const {
      nick,
      ident,
      hostname,
      target,
      tags,
      time: timestamp = new Date(),
    } = event;

    const id = tags['draft/msgid'] || uuid();
    const typing = tags['+draft/typing'];

    let uid = getUidByNick(nick);
    if (uid === undefined) {
      uid = addUser(nick, ident, hostname);
    }

    const bid = getBufferIdFromTarget(event);

    if (!bid) {
      return;
    }

    if (typing) {
      clearTypingState(bid, uid);

      if (typing === 'active' || typing === 'paused') {
        setTypingState(bid, uid, typing === 'paused' ? 30000 : 6000);
      }

      return;
    }

    dispatch(
      addMessage({ id, uid, bid, target, type: 'tagmsg', tags, timestamp }),
    );
  };

  const onMessageEvent = e => {
    const {
      tags,
      nick,
      ident,
      hostname,
      message: data,
      type,
      from_server: fromServer,
    } = e;

    // simply ignore server messages per now
    if (fromServer) {
      return;
    }

    const timestamp = Date.parse(tags['server-time']) || new Date();
    const id = tags['draft/msgid'] || uuid();
    const parent = tags['+draft/reply'] || null;
    const label = tags['draft/label'] || null;

    let bid = getBufferIdFromTarget(e);
    let { target } = e;

    if (client.nickname === target) {
      target = nick;

      if (bid === undefined || bid === null) {
        bid = uuid();

        dispatch(addBuffer(bid, target));
      }

      if (shouldNotifyOnPrivateMessage()) {
        spawnNativeNotification({
          title: `Private message from ${nick}`,
          body: data,
          bid,
          url: `/message/${nick.toLowerCase()}`,
        });
      }
    } else {
      if (bid === null) {
        bid = uuid();
      }

      const re = new RegExp(
        `(?:\\s|^|@)${escapeRegExp(client.nickname)}(?::|\\s|$)`,
        'iu',
      );

      if (shouldNotifyOnMentions() && re.test(data)) {
        spawnNativeNotification({
          title: `You were mentioned by ${nick}`,
          body: data,
          bid,
          url: `/channel/${target.toLowerCase()}`,
        });
      } else if (shouldNotifyOnAllMessages()) {
        spawnNativeNotification({
          title: `New message in ${target.toLowerCase()}`,
          body: data,
          bid,
          url: `/channel/${target.toLowerCase()}`,
        });
      }
    }

    // check if nick has an uid, if not, create one and add to userlist
    let uid = getUidByNick(nick);
    if (uid === undefined) {
      uid = addUser(nick, ident, hostname);
    }

    clearTypingState(bid, uid);

    let action = {
      type: 'MESSAGE_ADD',
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
        status: 'recieved',
      },
    };

    if (label && nick === client.nickname) {
      action = Object.assign({}, action, {
        ...action,
        type: 'MESSAGE_UPDATE',
        payload: {
          ...action.payload,
          status: 'delivered',
        },
      });
    }

    dispatch(action);
  };

  return {
    tagmsg: onTagmsgEvent,
    message: onMessageEvent,
  };
};
