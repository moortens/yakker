import React from 'react';
import PropTypes from 'prop-types';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import TextFormatter from '../TextFormatter';
import Container from '../Container';

import '../Message.css';

export default class Privmsg extends React.Component {
  state = {
    showReplies: false,
  };

  static propTypes = {
    message: PropTypes.object.isRequired,
    continouous: PropTypes.bool,
    replies: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    continouous: false,
    replies: [],
  };

  toggleReplies = () => {
    const { showReplies } = this.state;
    this.setState({
      showReplies: !showReplies,
    });
  };

  showReplyThread = () => {
    const { replies } = this.props;

    return replies.map(message => <Privmsg message={message} />);
  };

  showNumberOfReplies = () => {
    const { showReplies } = this.state;
    const { replies } = this.props;

    // number of replies
    const amount = replies.length;

    // get the unique users
    const users = [...new Set(replies.map(item => item.nick))];

    if (amount === 0) {
      return null;
    }

    return (
      <div className="message-reply">
        <span className="message-reply-icon">
          <Icon icon={faCommentDots} />
        </span>
        {!showReplies && (
          <a
            href="#"
            onClick={this.toggleReplies}
            className="message-reply-text"
          >
            {amount} 
{' '}
{amount > 1 ? 'replies' : 'reply'}
            ...
          </a>
        )}
        {showReplies && this.showReplyThread()}
      </div>
    );
  };

  render() {
    const { message, continouous, replies, ...props } = this.props;

    return (
      <Container direction="row">
        <div className="message-gutter">
          {!continouous && (
            <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=40" />
          )}
        </div>
        <div className="message-container">
          {!continouous && (
            <div className="message-user">
              <span>{message.nick}</span>
{' '}
              <span className="message-time">
                {message.timestamp.getHours()}
:{message.timestamp.getMinutes()}
              </span>
            </div>
          )}
          <TextFormatter
            className="message-data"
            text={message.data}
            {...props}
          />
          {this.showNumberOfReplies()}
        </div>
      </Container>
    );
  }
}
