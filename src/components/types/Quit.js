import React from 'react';

const Quit = ({ message }) => (
  <div>
    {message.nick} quit {message.data}
  </div>
);

export default Quit;
