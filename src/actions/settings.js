export const setSettingsCacheDetails = payload => ({
  type: 'SETTINGS_CACHE_DETAILS',
  payload,
});

export const setSettingsAutoConnectOnLoad = payload => ({
  type: 'SETTINGS_AUTO_CONNECT_ON_LOAD',
  payload,
});

export const setSettingsAutoJoinPreviousChannels = payload => ({
  type: 'SETTINGS_AUTO_JOIN_PREVIOUS_CHANNELS',
  payload,
});

export const setSettingsNotifyMentions = payload => ({
  type: 'SETTINGS_NOTIFY_MENTIONS',
  payload,
});

export const setSettingsNotifyPrivateMessages = payload => ({
  type: 'SETTINGS_NOTIFY_PRIVATE_MESSAGES',
  payload,
});

export const setSettingsNotifyAllMessages = payload => ({
  type: 'SETTINGS_NOTIFY_ALL_MESSAGES',
  payload,
});

export const setSettingsDisplayUnreadSidebar = payload => ({
  type: 'SETTINGS_DISPLAY_UNREAD_SIDEBAR',
  payload,
});

export const setSettingsDisplayUnreadIndicator = payload => ({
  type: 'SETTINGS_DISPLAY_UNREAD_INDICATOR',
  payload,
});
