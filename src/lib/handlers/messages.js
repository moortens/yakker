import uuid from 'uuid/v4';

import { addBuffer } from '../../actions/buffer';
import addMessage from '../../actions/message';
import history from '../history';

export default ({ client, dispatch }) => {
  const {
    addUser,
    setTypingState,
    clearTypingState,
    getBidByName,
    getUidByNick,
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

    const bid = getBidByName(target);

    if (!bid) {
      return;
    }

    if (typing) {
      clearTypingState(bid, uid);

      if (typing === 'active' || typing === 'paused') {
        setTypingState(uid, bid, typing === 'paused' ? 30000 : 6000);
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

    const timestamp = Date.parse(tags['server-time']) || new Date();
    const id = tags['draft/msgid'] || uuid();
    const parent = tags['+draft/reply'] || null;
    const label = tags['draft/label'] || null;

    // simply ignore server messages per now
    if (fromServer) {
      return;
    }

    let bid = client.getBufferIdFromTarget(e);

    let { target } = e;

    if (client.nickname === target) {
      target = nick;

      if (bid === undefined || bid === null) {
        bid = uuid();

        dispatch(addBuffer(bid, target));
      }

      if (client.settings.notifyPrivateMessages) {
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
    const uid = client.addUser(nick, ident, hostname);

    clearTypingState(bid, uid);

    if (label) {
      const status = 'delivered';
      
      dispatch({
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
    
    dispatch({
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

  return {
    tagmsg: onTagmsgEvent,
    message: onMessageEvent,
  };
};
