import React from 'react';
import { useSelector } from 'react-redux';

import BufferList from './BufferList';
import Container from './Container';

import Status from './Status';

import './Sidebar.css';


export default () => {
  const network = useSelector(state => state.server.network);

  return (
    <div className="sidebar">
      {network && <div className="sidebar-network">{network}</div>}
      <BufferList />
      <Status />
    </div>
  );
};
