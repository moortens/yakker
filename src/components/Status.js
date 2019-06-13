import React from 'react';
import { Link } from 'react-router-dom';

import { Settings, Keyboard } from './Icons';

import './Status.css';

const Status = () => {
  return (
    <div className="status-container">
      <Link to="/settings">
        <Settings />
      </Link>
      <Link to="/shortcuts">
        <Keyboard />
      </Link>
    </div>
  );
};

export default Status;
