import React from 'react';

import './KeyBindings.css';

const isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

const bindings = [
  {
    category: 'General',
    keys: [
      { shortcut: ['esc'], description: 'Close window' },
    ],
  },
  {
    category: 'Messages',
    keys: [
      { shortcut: ['enter \u23ce'], description: 'Sends message' },
      { shortcut: ['mod', 'b'], description: 'Bold text' },
      { shortcut: ['mod', 'i'], description: 'Italic text' },
      { shortcut: ['mod', 'u'], description: 'Underlined text' },
      { shortcut: ['mod', 'shift', 's'], description: 'Strikethrough text' },
      { shortcut: ['alt', 't'], description: 'Opens message thread' },
    ],
  },
];

const displayBindings = () => {
  return bindings.map(({ category, keys }) => {
    const children = keys.map(({ shortcut, description }) => {
      const key = shortcut.map(k => {
        let text = k;
        if (text === 'mod') {
          if (isMac) {
            text = '\u2318';
          } else {
            text = 'ctrl';
          }
        } 
        return (<div className="keybindings-key">{text}</div>)
      });

      return (
        <div key={shortcut} className="keybindings-shortcut">
          {key}
          <div className="keybindings-description">{description}</div>
        </div>
      );
    });

    return (
      <div>
        <div className="keybindings-category">{category}</div>
        {children}
      </div>
    );
  });
};

const KeyBindings = () => (
  <div className="keybindings-container">{displayBindings()}</div>
);

export default KeyBindings;
