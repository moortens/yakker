import React from 'react';

const Join = ({ message }) => (
  <div>
    {message.nick} joined {message.target}
  </div>
);

export default Join;
