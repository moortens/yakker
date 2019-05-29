import { createSelector } from 'reselect';

export const channelUserCountSelector = createSelector(
  (state, bid) => {
    const users = state.channels.users[bid];

    if (users === undefined) {
      return [];
    }

    return Object.values(users);
  },
  users => users.length,
);

export const channelTopicSelector = createSelector(
  (state, bid) => {
    const topic = state.channels.topics[bid];

    if (topic === undefined) {
      return '';
    }

    return topic;
  },
  topic => topic,
);

export const selectChannelDetails = createSelector(
  (state, bid) => {
    const { channel = '' } = state.channels.entities[bid] || {};

    return channel;
  },
  channelTopicSelector,
  channelUserCountSelector,
  (name, topic, count) => ({
    name,
    topic,
    count,
  }),
);
