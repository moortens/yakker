/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setSettingsAutoConnectOnLoad,
  setSettingsAutoJoinPreviousChannels,
  setSettingsCacheDetails,
  setSettingsDisplayUnreadIndicator,
  setSettingsDisplayUnreadSidebar,
  setSettingsNotifyAllMessages,
  setSettingsNotifyMentions,
  setSettingsNotifyPrivateMessages,
  setSettingsEmbedUntrustedImages,
  setSettingsShareTypingStatus,
} from '../actions/settings';

import { VerticalBox } from './Box';
import { Header, SubTitle } from './Typography';

const Settings = () => {
  const [notification, setNotification] = useState('disabled');

  const dispatch = useDispatch();

  const {
    cacheConnectionDetails,
    autoConnectOnLoad,
    autoJoinPreviousChannels,
    notifyMentions,
    notifyAllMessages,
    notifyPrivateMessages,
    displayUnreadInSidebar,
    displayUnreadIndicator,
    embedUntrustedImages,
    shareTypingStatus,
  } = useSelector(state => state.settings);

  useEffect(() => {
    if (!('Notification' in window)) {
      setNotification('disabled');
    } else {
      setNotification(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
      return;
    }

    Notification.requestPermission(permission => {
      setNotification(permission);
    });
  };

  return (
    <VerticalBox>
      <Header>Settings</Header>

      <SubTitle>Account</SubTitle>
      <label>
        <input
          type="checkbox"
          checked={cacheConnectionDetails}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsCacheDetails(checked))
          }
        />
        Cache connection options for later visits
      </label>

      <label>
        <input
          type="checkbox"
          checked={autoConnectOnLoad}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsAutoConnectOnLoad(checked))
          }
        />
        Automatically connect on load
      </label>

      <label>
        <input
          type="checkbox"
          checked={autoJoinPreviousChannels}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsAutoJoinPreviousChannels(checked))
          }
        />
        Automatically rejoin the channels you were in last
      </label>

      <SubTitle>Messages</SubTitle>
      <label>
        <input
          type="checkbox"
          checked={displayUnreadInSidebar}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsDisplayUnreadSidebar(checked))
          }
        />
        Show unread messages in sidebar
      </label>
      <label>
        <input
          type="checkbox"
          checked={displayUnreadIndicator}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsDisplayUnreadIndicator(checked))
          }
        />
        Show unread messages indicator in chat
      </label>
      <label>
        <input
          type="checkbox"
          checked={embedUntrustedImages}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsEmbedUntrustedImages(checked))
          }
        />
        Embed images in chat
      </label>
      <label>
        <input
          type="checkbox"
          checked={shareTypingStatus}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsShareTypingStatus(checked))
          }
        />
        Share typing status
      </label>

      <SubTitle>Notifications</SubTitle>

      {notification === 'denied' && <div>You denied notifications</div>}
      {notification === 'default' && (
        <button type="button" onClick={() => requestNotificationPermission()}>
          Turn on notifications
        </button>
      )}

      <label>
        <input
          type="checkbox"
          disabled={notification === 'denied'}
          checked={notifyPrivateMessages}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsNotifyPrivateMessages(checked))
          }
        />
        Notify on private messages
      </label>

      <label>
        <input
          type="checkbox"
          disabled={notification === 'denied'}
          checked={notifyMentions}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsNotifyMentions(checked))
          }
        />
        Notify on @highlight
      </label>
      <label>
        <input
          type="checkbox"
          disabled={notification === 'denied'}
          checked={notifyAllMessages}
          onChange={({ target: { checked } }) =>
            dispatch(setSettingsNotifyAllMessages(checked))
          }
        />
        Notify on every message
      </label>
    </VerticalBox>
  );
};

export default Settings;
