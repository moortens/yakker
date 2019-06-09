import React from 'react';
import propTypes from 'prop-types';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { Emoji } from 'emoji-mart';
import { connect } from 'react-redux';
import isKeyHotkey from 'is-hotkey';

import Container from './Container';
import EmojiPicker from './EmojiPicker';
import AliasPicker from './AliasPicker';

import TypingMiddleware from './input/TypingMiddleware';

import './MessageInput.css';
import ColorPicker from './ColorPicker';

const plugins = [TypingMiddleware()];

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
const isTabHotkey = isKeyHotkey('tab');
const isCtrlKHotKey = isKeyHotkey('ctrl+k');

const serializeMarks = ({ type, data }) => {
  switch (type) {
    case 'bold': {
      return ['\x02'];
    }
    case 'italic': {
      return ['\x1D'];
    }

    case 'underline': {
      return ['\x1F'];
    }

    case 'monospace': {
      return ['\x11'];
    }

    case 'color': {
      const color = data.get('color');

      return ['\x03', color];
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
    /*
      
      NOTE: this is here, due to the fact that slate 0.46-0.47 has an error 
      with toggleMark and splitting blocks. Since the introduction of annotations
      in 0.47 slate also changed the output. Fix this when we upgrade, below is
      working code fo 0.45.

  
  const leaves = node.getLeaves();

    if (leaves === undefined) {
      return node.text;
    }

    return leaves
      .map(({ marks, text }) => {
        const serializedMarks = marks.map(serializeMarks);

        const startCode = serializedMarks
          .map(([code, color]) => {
            if (color) {
              return `${code}${color}`;
            }
            return color;
          })
          .join('');
        const endCode = serializedMarks.map(([code]) => code).join('');

        return `${startCode}${text}${endCode}`;
      })
      .join('');

*/
    const { text, marks } = node;

    const serializedMarks = marks.map(serializeMarks);

    const startCode = serializedMarks
      .map(([code, color]) => {
        if (color) {
          return `${code}${color}`;
        }
        return color;
      })
      .join('');
    const endCode = serializedMarks.map(([code]) => code).join('');

    return `${startCode}${text}${endCode}`;
  }
  return '';
};

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
        marks: [],
      },
    ],
  },
};

class MessageInput extends React.Component {
  state = {
    colorPicker: false,
    aliasPicker: false,
    aliasFilter: '',
    command: null,
    value: Value.fromJSON(initialValue),
  };

  editor = null;

  editorRef = editor => {
    this.editor = editor;
  };

  renderBlock = (props, _editor, next) => {
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

  renderInline = (props, _editor, next) => {
    const { attributes, node } = props;

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

  renderMark = (props, _editor, next) => {
    const {
      children,
      mark: { type, data },
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

      case 'color': {
        const color = data.get('color');

        return (
          <span className={`foreground-${color}`} {...attributes}>
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
      this.setState({ aliasPicker: true });

      const [, command] = text.match(re);
      if (command) {
        this.setState({ aliasFilter: command });
      }
    } else {
      this.setState({ aliasPicker: false, aliasFilter: '' });
    }

    this.setState({ value });
  };

  onKeyDown = (e, editor, next) => {
    const { dispatch, bid, tid } = this.props;

    let mark;
    if (isTabHotkey(e)) {
      const {
        value: { document },
      } = editor;
      const { aliasPicker, command } = this.state;

      if (aliasPicker && command) {
        const { alias } = command;
        const { text } = document.getFirstText();

        e.preventDefault();

        this.setState({ aliasPicker: false, aliasFilter: '' }, () => {
          editor
            .deleteBackward(text.length)
            .insertText(alias)
            .focus();
        });

        return null;
      }
    } else if (isCtrlKHotKey(e)) {
      const { colorPicker } = this.state;
      this.setState({ colorPicker: !colorPicker });

      e.preventDefault();

      return null;
    } else if (isBoldHotkey(e)) {
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

      if (this.state.colorPicker) {
        e.preventDefault();
        return null;
      }

      dispatch(sendMessageToBuffer(bid, tid, serialize(document)));

      editor
        .moveToRangeOfDocument()
        .delete()
        .focus();

      e.preventDefault();

      return null;
    } else {
      return next();
    }

    e.preventDefault();
    this.editor.toggleMark(mark);

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

  onItemChange = command => {
    this.setState({ command });
  };

  onColorSelect = color => {
    this.setState({ colorPicker: false });

    const {
      value: { marks },
    } = this.editor;

    marks
      .filter(mark => mark.type === 'color')
      .forEach(mark => this.editor.removeMark(mark));

    this.editor
      .addMark({
        type: 'color',
        data: {
          color,
        },
      })
      .focus();
  };

  render() {
    const { bid } = this.props;
    const { colorPicker, aliasPicker, aliasFilter, value } = this.state;

    return (
      <ColorPicker open={colorPicker} onItemChange={() => null}>
        <AliasPicker
          open={aliasPicker}
          command={aliasFilter}
          onItemChange={this.onItemChange}
        >
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
              plugins={plugins}
              className="message-input-editor"
              placeholder="Type a message..."
              bid={bid}
            />
            <EmojiPicker
              onSelect={this.insertEmoji}
              className="message-input-emojipicker"
            />
          </Container>
        </AliasPicker>
      </ColorPicker>
    );
  }
}

MessageInput.propTypes = {
  dispatch: propTypes.func.isRequired,
  bid: propTypes.string.isRequired,
  tid: propTypes.string,
};

MessageInput.defaultProps = {
  tid: null,
};

export default connect()(MessageInput);
