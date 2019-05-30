/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from './Container';

import {
  setSettingsAutoConnectOnLoad,
  setSettingsAutoJoinPreviousChannels,
  setSettingsCacheDetails,
  setSettingsDisplayUnreadIndicator,
  setSettingsDisplayUnreadSidebar,
  setSettingsNotifyAllMessages,
  setSettingsNotifyMentions,
  setSettingsNotifyPrivateMessages,
} from '../actions/settings';

import './Settings.css';

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
    <Container direction="column">
      <header className="settings-header">Settings</header>

      <div className="settings-account">Account</div>
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

      <div className="settings-account">Messages</div>
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

      <div className="settings-account">Notifications</div>

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
    </Container>
  );
};

export default Settings;
