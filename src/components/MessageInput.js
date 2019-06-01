import React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { Emoji } from 'emoji-mart';
import { connect } from 'react-redux';
import isHotKey from 'is-hotkey';
import './MessageInput.css';
import 'emoji-mart/css/emoji-mart.css';
import Container from './Container';
import EmojiPicker from './EmojiPicker';

class MessageInput extends React.Component {
  schema = {
    inlines: {
      emoji: {
        isVoid: true,
      },
    },
  };

  initialValue = {
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

  state = {
    value: Value.fromJSON(this.initialValue),
  };

  container = React.createRef();

  refe = editor => {
    this.editor = editor;
  };

  onChange = ({ value }) => this.setState({ value });

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'paragraph': {
        return <p {...attributes}>{children}</p>;
      }

      case 'emoji': {
        const id = node.data.get('id');
        return (
          <span {...props.attributes} contentEditable={false}>
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

  serializeMarks = ({ type }) => {
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

  serialize = node => {
    if (node.object === 'document' || node.object === 'block') {
      return node.nodes.map(this.serialize).join('');
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
          const code = marks.map(this.serializeMarks).join('');

          return `${code}${text}${code}`;
        })
        .join('');
    }
  };

  onKeyDown = (e, editor, next) => {
    /* refactor */
    if (isHotKey('mod+b', e)) {
      e.preventDefault();
      editor.toggleMark('bold');
    } else if (isHotKey('mod+i', e)) {
      e.preventDefault();
      editor.toggleMark('italic');
    } else if (isHotKey('mod+u', e)) {
      e.preventDefault();
      editor.toggleMark('underline');
    } else if (isHotKey('mod+m', e)) {
      e.preventDefault();
      editor.toggleMark('monospace');
    } else if (isHotKey('enter', e)) {
      const {
        value: { document },
      } = this.state;
      const { buffer } = this.props;

      this.props.sendMessageToBuffer(buffer, this.serialize(document));

      this.setState(
        {
          value: Value.fromJSON(this.initialValue),
        },
        () => {
          this.editor.focus();
        },
      );

      return null;
    }
    return next();
  };

  render() {
    return (
      <Container direction="row" className="message-input-container">
        <div
          className="message-input-editor-container"
          onClick={() => this.editor.focus()}
          ref={this.container}
        >
          <Editor
            autoFocus
            schema={this.schema}
            ref={this.refe}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={this.state.value}
            renderNode={this.renderNode}
            renderMark={this.renderMark}
            className="message-input-editor"
            placeholder="Message #general"
            plugins={this.plugins}
          />
        </div>
        <EmojiPicker onSelect={this.insertEmoji} />
      </Container>
    );
  }
}

const mapStateToProps = (state, { bid }) => {
  const {
    buffer: { entities },
  } = state;

  console.log(entities, bid)
  return {
    buffer: entities[bid].name,
  };
};

const mapDispatchToProps = dispatch => ({
  sendMessageToBuffer: (target, data) => {
    dispatch({
      type: 'WS::SEND',
      payload: {
        target,
        data,
      },
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageInput);
