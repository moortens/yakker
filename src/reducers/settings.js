import config from '../config.json';

const defaultState = {
  cacheConnectionDetails: false,

  autoConnectOnLoad: true,
  autoJoinPreviousChannels: false,

  notifyMentions: false,
  notifyAllMessages: false,
  notifyPrivateMessages: false,

  displayUnreadInSidebar: false,
  displayUnreadIndicator: false,

  embedUntrustedImages: false,

  networks: [],
};

const initialState = {
  ...defaultState,
  ...config,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SETTINGS_CACHE_DETAILS': {
      return Object.assign({}, state, {
        ...state,
        cacheConnectionDetails: payload,
      });
    }

    case 'SETTINGS_AUTO_CONNECT_ON_LOAD': {
      return Object.assign({}, state, {
        ...state,
        autoConnectOnLoad: payload,
      });
    }

    case 'SETTINGS_AUTO_JOIN_PREVIOUS_CHANNELS': {
      return Object.assign({}, state, {
        ...state,
        autoJoinPreviousChannels: payload,
      });
    }

    case 'SETTINGS_NOTIFY_MENTIONS': {
      return Object.assign({}, state, {
        ...state,
        notifyMentions: payload,
      });
    }

    case 'SETTINGS_NOTIFY_ALL_MESSAGES': {
      return Object.assign({}, state, {
        ...state,
        notifyAllMessages: payload,
      });
    }

    case 'SETTINGS_NOTIFY_PRIVATE_MESSAGES': {
      return Object.assign({}, state, {
        ...state,
        notifyPrivateMessages: payload,
      });
    }

    case 'SETTINGS_DISPLAY_UNREAD_SIDEBAR': {
      return Object.assign({}, state, {
        ...state,
        displayUnreadInSidebar: payload,
      });
    }

    case 'SETTINGS_DISPLAY_UNREAD_INDICATOR': {
      return Object.assign({}, state, {
        ...state,
        displayUnreadIndicator: payload,
      });
    }

    case 'SETTINGS_EMBED_UNTRUSTED_IMAGES': {
      return Object.assign({}, state, {
        ...state,
        embedUntrustedImages: payload,
      });
    }

    default: {
      return state;
    }
  }
};
