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
  const { bids, uids } = client;

  const onJoinEvent = e => {
    const { nick, channel: target, ident, hostname, gecos } = e;
    const bid = bids[target.toLowerCase()] || uuid();

    if (nick.toLowerCase() === client.nickname) {
      client.socket.who(target);

      dispatch(addChannel(bid, target));
      dispatch(addBuffer(bid, target, true));

      // store joined channels in cache, remove on part
      return;
    }

    const id = uuid();
    const uid = client.addUser(nick, ident, hostname, gecos);

    dispatch(
      addMessage({
        id,
        uid,
        bid,
        target,
        type: 'JOIN',
        nick,
      }),
    );
    dispatch(addChannelMember(bid, uid, []));
  };

  const onPartEvent = e => {
    const { nick, channel: target, message, time: timestamp } = e;

    const type = 'part';
    const id = uuid();
    const bid = bids[target.toLowerCase()];
    const uid = uids[nick.toLowerCase()];

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
    dispatch(removeChannelMember(bid, uid));
  };

  const onQuitEvent = e => {
    const { nick, message: data, time: timestamp } = e;

    const id = uuid();

    const uid = uids[nick.toLowerCase()];
    const buffers = client.getCommonBuffers(uid);

    buffers.forEach(bid => {
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
      dispatch(removeChannelMember(bid, uid));
    });
  };

  const onAwayEvent = e => {
    const { nick } = e;

    const uid = uids[nick.toLowerCase()];
    dispatch(
      setUserlistUser(uid, {
        nick,
        away: true,
      }),
    );
  };

  const onBackEvent = e => {
    const { nick } = e;

    const uid = uids[nick.toLowerCase()];
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
