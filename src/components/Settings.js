/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import Container from './Container';

import './Settings.css';

const Settings = () => {
  const requestNotificationPermission = () => {
    Notification.requestPermission(permission => {
      if (permission === "granted") {
        const not = new Notification("Hello!");
      }
    });
  };


  return (
    <Container direction="column">
      <header className="settings-header">Settings</header>

      <div className="settings-account">Account</div>
      <label>
        <input type="checkbox" onChange={() => null} />
        Cache connection options for later visits
      </label>

      <div className="settings-account">Messages</div>
      <label>
        <input type="checkbox" onChange={() => null} />
        Show unread messages in sidebar
      </label>
      <label>
        <input type="checkbox" onChange={() => null} />
        Show unread messages indicator in chat
      </label>

      <div className="settings-account">Notifications</div>
      <button type="button" onClick={requestNotificationPermission}>Turn on notifications</button>
      <label>
        <input type="checkbox" onChange={() => null} />
        Notify on private messages
      </label>

      <label>
        <input type="checkbox" onChange={() => null} />
        Notify on @highlight
      </label>
      <label>
        <input type="checkbox" onChange={() => null} />
        Notify on every message
      </label>
    </Container>
  );
};

export default Settings;
