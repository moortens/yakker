import {
  addChanlist,
  clearChanlist,
  setChanlistLoading,
} from '../../actions/chanlist';

export default ({ dispatch }) => {
  const onListStartEvent = () => {
    dispatch(clearChanlist());
    dispatch(setChanlistLoading(true));
  };

  const onListEvent = channels => {
    if (channels === undefined) {
      return;
    }

    channels.forEach(({ channel, topic: data, num_users: users }) => {
      /*
       * some ircd's provide the modes of a channel in the topic, like
       * inspircd/unreal. These are used for badges to indicate moderated
       * or key/invite only channels.
       */
      let modes = [];
      let topic = null;

      const modeRegExp = /^(?:\[\+([^\]]+)\] ?)?([^$]+)$/;
      if (modeRegExp.test(data)) {
        const [, matchedModes = '', matchedTopic] = modeRegExp.exec(data);

        modes = matchedModes.replace(/\s<[^>]+>/g, '').split('');
        topic = matchedTopic;
      } else {
        topic = data;
      }

      topic = topic.replace(
        // eslint-disable-next-line no-control-regex
        /\x02|\x0D|\x1F|\x1E|\x11|\x03\d{1,2}(?:,\d{1,2})?|\x04[0-9a-fA-F]{6}|\x16|\x0f/g,
        '',
      );

      dispatch(addChanlist(channel, topic, users, modes));
    });
  };

  const onListEndEvent = () => {
    dispatch(setChanlistLoading(false));
  };

  return {
    'channel list start': onListStartEvent,
    'channel list': onListEvent,
    'channel list end': onListEndEvent,
  };
};
