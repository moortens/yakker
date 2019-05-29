import React from 'react';
import twemoji from 'twemoji';

import escape from 'lodash/escape';
import './TextFormatter.css';

export default class TextFormatter extends React.Component {
  getBlockType = char => {
    if (char === '\x02') {
      return 'bold';
    }
    if (char === '\x1d') {
      return 'italic';
    }
    if (char === '\x1f') {
      return 'underline';
    }
    return null;
  };

  formatter = data => {
    const flags = {
      bold: false,
      italic: false,
      underline: false,
    };

    // Converts the characters "&", "<", ">", '"', and "'" in string
    // to their corresponding HTML entities.
    const text = escape(data);

    let __html = text
      .split('')
      .map(char => {
        const blockType = this.getBlockType(char);

        if (blockType !== null) {
          if (!flags[blockType]) {
            flags[blockType] = true;

            return `<span class="text-${blockType}">`;
          }
          flags[blockType] = false;

          return '</span>';
        }
        return char;
      })
      .join('');

    __html += Object.keys(flags)
      .filter(item => flags[item])
      .map(item => '</span>')
      .join('');

    // Provides support for the standard Unicode emojis
    __html = twemoji.parse(__html, {
      className: 'text-emoji',
    });

    return {
      __html,
    };
  };

  render() {
    const { text, ...attributes } = this.props;

    return (
      <div dangerouslySetInnerHTML={this.formatter(text)} {...attributes} />
    );
  }
}
