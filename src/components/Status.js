import React from 'react';

import './Status.css';
import { useSelector } from 'react-redux';
import { Settings, Keyboard } from './Icons';
import { Link } from 'react-router-dom';

const Status = () => {
  const nick = useSelector(state => state.server.nickname);

  return (
    <div className="status-container">
      <Link to="/settings"><Settings /></Link>
      <Link to="/shortcuts"><Keyboard /></Link>
    </div>
  );
};

export default Status;
