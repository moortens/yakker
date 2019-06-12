import uuid from 'uuid/v4';

import { setChannelTopic, addChannelMember } from '../../actions/channel';
import { setUserlistUser } from '../../actions/userlist';

export default ({ client, dispatch }) => {
  const onTopicEvent = e => {
    const { channel, topic } = e;
    const bid = client.bids[channel.toLowerCase()];
    dispatch(setChannelTopic(bid, topic));
  };

  const onUserlistEvent = e => {
    const { channel, users } = e;

    const bid = client.bids[channel.toLowerCase()];

    users.forEach(user => {
      const { nick, ident, hostname, modes } = user;
      const uid = client.addUser(nick, ident, hostname);

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

      const uid = client.uids[nick.toLowerCase()] || uuid();

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
