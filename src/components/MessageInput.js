import React, { useState, useRef, useLayoutEffect } from 'react';
import propTypes from 'prop-types';
import { Editor } from 'slate-react';
import { Value, KeyUtils } from 'slate';
import { Emoji } from 'emoji-mart';
import { useDispatch, connect } from 'react-redux';
import isKeyHotkey from 'is-hotkey';

import Container from './Container';
import EmojiPicker from './EmojiPicker';

import './MessageInput.css';
import AliasPopup from './AliasPopup';

const sendMessageToBuffer = (bid, tid, data) => ({
  type: 'WS::SEND',
  payload: {
    bid,
    tid,
    data,
  },
});

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlineHotkey = isKeyHotkey('mod+u');
const isMonospaceHotkey = isKeyHotkey('mod+m');
const isEnterHotkey = isKeyHotkey('enter');
const isUpHotkey = isKeyHotkey('up');
const isDownHotkey = isKeyHotkey('up');

const serializeMarks = ({ type }) => {
  switch (type) {
    case 'bold': {
      return '\x02';
    }
    case 'italic': {
      return '\x1D';
    }

    case 'underline': {
      return '\x1F';
    }

    case 'monospace': {
      return '\x11';
    }

    default:
      return null;
  }
};

const serialize = node => {
  if (node.object === 'document' || node.object === 'block') {
    return node.nodes.map(serialize).join('');
  }
  if (node.object === 'inline') {
    if (node.type === 'emoji') {
      return node.data.get('native');
    }
  } else if (node.object === 'text') {
    /*const leaves = node.getLeaves();

    if (leaves === undefined) {
      return node.text;
    }

    return leaves
      .map(({ marks, text }) => {
        const code = marks.map(serializeMarks).join('');

        return `${code}${text}${code}`;
      })
      .join('');*/
    const { text, marks } = node;

    const code = marks.map(serializeMarks).join('');

    return `${code}${text}${code}`;
  }
  return '';
};

const schema = {
  inlines: {
    emoji: {
      isVoid: true,
    },
  },
  annotations: {
    command: {
      isAtomic: true,
    },
  },
};

const initialValue = {
  object: 'value',
  document: {
    object: 'document',
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [],
      },
    ],
  },
};

class MessageInput extends React.Component {
  state = {
    aliasPopup: false,
    aliasFilter: '',
    value: Value.fromJSON(initialValue),
  };

  editor = null;

  editorRef = editor => {
    this.editor = editor;
  };

  renderAnnotation = (props, editor, next) => {
    console.log('ever here?');
    const { children, annotation, attributes } = props;

    switch (annotation.type) {
      case 'command': {
        return (
          <span {...attributes} className="messageinput-command">
            {children}
          </span>
        );
      }
      default: {
        return next();
      }
    }
  };

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'paragraph': {
        return <p {...attributes}>{children}</p>;
      }

      default: {
        return next();
      }
    }
  };

  renderInline = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'emoji': {
        const id = node.data.get('id');

        return (
          <span contentEditable={false} {...attributes}>
            <Emoji emoji={id} set="twitter" size={16} />
          </span>
        );
      }

      default: {
        return next();
      }
    }
  };

  renderMark = (props, editor, next) => {
    const {
      children,
      mark: { type },
      attributes,
    } = props;

    switch (type) {
      case 'bold': {
        return <strong {...attributes}>{children}</strong>;
      }

      case 'italic': {
        return <em {...attributes}>{children}</em>;
      }

      case 'underline': {
        return <u {...attributes}>{children}</u>;
      }

      case 'monospace': {
        return (
          <span className="message-input-monospace" {...attributes}>
            {children}
          </span>
        );
      }

      default: {
        return next();
      }
    }
  };

  onChange = ({ value }) => {
    const { document } = value;
    const { text } = document.getFirstText();
    
      const re = /^\/([^\s|$]+)?/;

      if (re.test(text)) {
        this.setState(prev => ({ aliasPopup: true }));

        const [, command] = text.match(re);
        if (command) {
          this.setState(prev => ({ aliasFilter: command }));
        }
      } else {
        this.setState({ aliasPopup: false, aliasFilter: '' });
      }
    

    this.setState({ value });
  };

  onKeyDown = (e, editor, next) => {
    const { dispatch, bid, tid } = this.props;
    let mark;
    if (isBoldHotkey(e)) {
      mark = 'bold';
    } else if (isItalicHotkey(e)) {
      mark = 'italic';
    } else if (isUnderlineHotkey(e)) {
      mark = 'underline';
    } else if (isMonospaceHotkey(e)) {
      mark = 'monospace';
    } else if (isEnterHotkey(e)) {
      const {
        value: { document },
      } = editor;

      dispatch(sendMessageToBuffer(bid, tid, serialize(document)));

      editor
        .moveToRangeOfDocument()
        .delete()
        .focus();

      return null;
    } else {
      return next();
    }

    e.preventDefault();
    this.editorRef.current.toggleMark(mark);

    return null;
  };

  insertEmoji = e => {
    const { id, native } = e;

    this.editor
      .insertInline({
        type: 'emoji',
        data: {
          native,
          id,
        },
      })
      .moveToStartOfNextText()
      .focus();
  };

  render() {
    const { aliasPopup, aliasFilter, value } = this.state;

    return (
      <AliasPopup open={aliasPopup} command={aliasFilter}>
        <Container direction="row" className="message-input-container">
          <Editor
            autoFocus
            ref={this.editorRef}
            schema={schema}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            value={value}
            renderInline={this.renderInline}
            renderBlock={this.renderBlock}
            renderMark={this.renderMark}
            renderAnnotation={this.renderAnnotation}
            className="message-input-editor"
            placeholder="Type a message..."
          />
          <EmojiPicker
            onSelect={this.insertEmoji}
            className="message-input-emojipicker"
          />
        </Container>
      </AliasPopup>
    );
  }
}

MessageInput.propTypes = {
  bid: propTypes.string.isRequired,
  tid: propTypes.string,
};

MessageInput.defaultProps = {
  tid: null,
};

export default connect()(MessageInput);
