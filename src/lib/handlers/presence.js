import uuid from 'uuid/v4';
import { addBuffer } from '../../actions/buffer';
import {
  addChannel,
  addChannelMember,
  removeChannelMember,
} from '../../actions/channel';
import { setUserlistUser } from '../../actions/userlist';
import addMessage from '../../actions/message';

export default ({ client, dispatch }) => {
  const { getUidByNick, getBufferIdFromTarget, addUser, uids } = client;

  const onJoinEvent = e => {
    const { nick, channel: target, ident, hostname, gecos, time } = e;
    const bid = client.getBufferIdFromTarget(e) || uuid();
    
    const timestamp = new Date(time) || new Date();
    const type = 'join';

    if (nick.toLowerCase() === client.nickname) {
      client.socket.who(target);

      dispatch(addChannel(bid, target));
      dispatch(addBuffer(bid, target, true));

      // store joined channels in cache, remove on part
      return;
    }

    const id = uuid();
    let uid = getUidByNick(nick);
    if (uid === undefined) {
      uid = addUser(nick, ident, hostname);
    }

    dispatch(
      addMessage({
        id,
        uid,
        bid,
        target,
        type,
        nick,
        timestamp,
      }),
    );
    dispatch(addChannelMember(bid, uid, []));
  };

  const onPartEvent = e => {
    const { nick, channel: target, message: data, time } = e;

    const type = 'part';

    const id = uuid();
    const bid = getBufferIdFromTarget(e);
    const uid = getUidByNick(nick);

    if (!uid || !bid) {
      return;
    }

    const timestamp = new Date(time) || new Date();

    dispatch(
      addMessage({
        id,
        uid,
        bid,
        target,
        type,
        nick,
        data,
        timestamp,
      }),
    );
    dispatch(removeChannelMember(bid, uid));
  };

  const onQuitEvent = e => {
    const { nick, message: data, time } = e;

    const type = 'quit';

    const id = uuid();
    const uid = getUidByNick(nick);

    if (!uid) {
      return;
    }

    const buffers = client.getCommonBuffers(uid);
    const timestamp = new Date(time) || new Date();

    buffers.forEach(bid => {
      dispatch(
        addMessage({
          id,
          uid,
          bid,
          data,
          type,
          nick,
          timestamp,
        }),
      );
      dispatch(removeChannelMember(bid, uid));
    });
  };

  const onAwayEvent = e => {
    const { nick } = e;

    const uid = getUidByNick(nick);
    dispatch(
      setUserlistUser(uid, {
        nick,
        away: true,
      }),
    );
  };

  const onBackEvent = e => {
    const { nick } = e;

    const uid = getUidByNick(nick);
    dispatch(
      setUserlistUser(uid, {
        nick,
        away: false,
      }),
    );
  };

  return {
    join: onJoinEvent,
    part: onPartEvent,
    quit: onQuitEvent,
    away: onAwayEvent,
    back: onBackEvent,
  };
};
