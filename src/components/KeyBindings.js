import React from 'react';
import styled from 'styled-components';
import { darken, lighten } from 'polished';

import { Title } from './Typography';

const isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

const bindings = [
  {
    category: 'General',
    keys: [{ shortcut: ['esc'], description: 'Close window' }],
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

const Key = styled.div`
  border: 1px outset ${({ theme }) => theme.keybindings.colors.outset};
  box-shadow: 1px 1px 1px 1px ${({ theme }) => theme.keybindings.colors.shadow};
  background-color: ${({ theme }) => theme.keybindings.colors.background};
  border-radius: 4px;
  padding: 10px;

  width: auto;
  height: auto;
  box-sizing: border-box;
  margin-right: 5px;
  font-family: monospace;
  font-size: 1.2rem;
`;

const Shortcut = styled.div`
  display: flex;

  align-items: center;
  margin-top: 5px;

  :hover {
    ${Key} {
      border: 1px inset
        ${({ theme }) =>
          lighten(theme.keybindings.darken, theme.keybindings.colors.outset)};
      background-color: ${({ theme }) =>
        darken(theme.keybindings.darken, theme.keybindings.colors.background)};
      box-shadow: 1px 1px 1px 1px
        ${({ theme }) =>
          darken(theme.keybindings.darken, theme.keybindings.colors.shadow)};
    }
  }
`;

const Description = styled.div`
  font-size: 1.6rem;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 15px;
`;

const displayBindings = () => {
  return bindings.map(({ category, keys }) => {
    const children = keys.map(({ shortcut, description }) => {
      return (
        <Shortcut key={shortcut}>
          {shortcut.map(k => {
            let text = k;
            if (text === 'mod') {
              if (isMac) {
                text = '\u2318';
              } else {
                text = 'ctrl';
              }
            }
            return <Key>{text}</Key>;
          })}
          <Description>{description}</Description>
        </Shortcut>
      );
    });

    return (
      <div>
        <Title mt={10} mb={15}>
          {category}
        </Title>
        {children}
      </div>
    );
  });
};

const KeyBindings = () => <Container>{displayBindings()}</Container>;

export default KeyBindings;
