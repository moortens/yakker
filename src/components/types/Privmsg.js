import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import classnames from 'classnames';
import TextFormatter from '../TextFormatter';
import Container from '../Container';
import Avatar from '../Avatar';
import { Reply, Smile } from '../Icons';

import './Privmsg.css';

const Privmsg = ({ message, continouous, match, bid, tid, thread, ...props }) => {
  const klass = classnames({
    'privmsg-sent': message.status === 'sent',
  });

  return (
    <Container direction="row" className={klass}>
      <div className="privmsg-gutter">
        {!continouous && <Avatar text={message.nick} />}
      </div>
      <Container direction="column">
        {!continouous && (
          <div className="privmsg-header">
            <span className="privmsg-user">{message.nick}</span>
            {message.nick === message.gecos || message.gecos === null ? null : (
              <TextFormatter text={message.gecos} className="privmsg-gecos" />
            )}
            <span className="privmsg-time">
              {message.timestamp.toLocaleTimeString('default', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          </div>
        )}
        <Container direction="row">
          <TextFormatter
            className="privmsg-data"
            text={message.data}
            {...props}
          />
          <div className="privmsg-actions">
            {!thread && (
              <Link
                to={{
                  pathname: `${match.url}/thread/${message.id}`,
                  state: {
                    tid,
                    bid,
                  },
                }}
                className="privmsg-reply-action"
              >
                <Reply />
              </Link>
            )}
            <Link to="/" className="privmsg-reply-action">
              <Smile />
            </Link>
          </div>
        </Container>
      </Container>
    </Container>
  );
};

export default withRouter(Privmsg);
