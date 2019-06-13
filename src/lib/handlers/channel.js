import uuid from 'uuid/v4';

import { setChannelTopic, addChannelMember } from '../../actions/channel';
import { setUserlistUser } from '../../actions/userlist';

export default ({
  client: { getBufferIdFromTarget, addUser, getUidByNick },
  dispatch,
}) => {
  const onTopicEvent = e => {
    const { topic } = e;
    const bid = getBufferIdFromTarget(e);
    dispatch(setChannelTopic(bid, topic));
  };

  const onUserlistEvent = e => {
    const { users } = e;

    const bid = getBufferIdFromTarget(e);

    users.forEach(user => {
      const { nick, ident, hostname, modes } = user;

      let uid = getUidByNick(nick);

      if (!uid) {
        uid = addUser(nick, ident, hostname);
      }

      dispatch(addChannelMember(bid, uid, modes));
    });
  };

  const onWhoEvent = e => {
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

      const uid = getUidByNick(nick) || uuid();

      dispatch(
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

  return {
    topic: onTopicEvent,
    userlist: onUserlistEvent,
    wholist: onWhoEvent,
  };
};
