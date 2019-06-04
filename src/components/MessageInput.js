import React, { useState, useRef } from 'react';
import propTypes from 'prop-types';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { Emoji } from 'emoji-mart';
import { useDispatch } from 'react-redux';
import isKeyHotkey from 'is-hotkey';

import Container from './Container';
import EmojiPicker from './EmojiPicker';

import './MessageInput.css';

const schema = {
  inlines: {
    emoji: {
      isVoid: true,
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

const renderNode = (props, editor, next) => {
  const { attributes, children, node } = props;

  switch (node.type) {
    case 'paragraph': {
      return <p {...attributes}>{children}</p>;
    }

    case 'emoji': {
      const id = node.data.get('id');
      return (
        <span {...attributes} contentEditable={false}>
          <Emoji emoji={id} set="twitter" size={16} />
        </span>
      );
    }

    default: {
      return next();
    }
  }
};

const renderMark = (props, editor, next) => {
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
    const leaves = node.getLeaves();

    if (leaves === undefined) {
      return node.text;
    }

    return leaves
      .map(({ marks, text }) => {
        const code = marks.map(serializeMarks).join('');

        return `${code}${text}${code}`;
      })
      .join('');
  }
  return '';
};

const MessageInput = ({ bid, tid }) => {
  const [currentValue, setCurrentValue] = useState(
    Value.fromJSON(initialValue),
  );
  const editorRef = useRef(null);
  const dispatch = useDispatch();

  const onKeyDown = (e, editor, next) => {
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
      editor.moveToRangeOfDocument().delete();
      editor.focus();

      return null;
    } else {
      return next();
    }
    e.preventDefault();

    editor.toggleMark(mark);

    return null;
  };

  const insertEmoji = e => {
    const { id, native } = e;

    editorRef.current
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

  return (
    <Container direction="row" className="message-input-container">
      <Editor
        autoFocus
        ref={editorRef}
        schema={schema}
        onKeyDown={onKeyDown}
        onChange={({ value }) => setCurrentValue(value)}
        value={currentValue}
        renderNode={renderNode}
        renderMark={renderMark}
        className="message-input-editor"
        placeholder="Type a message..."
      />
      <EmojiPicker
        onSelect={insertEmoji}
        className="message-input-emojipicker"
      />
    </Container>
  );
};

MessageInput.propTypes = {
  bid: propTypes.string.isRequired,
  tid: propTypes.string,
};

MessageInput.defaultProps = {
  tid: null,
};

export default MessageInput;
