import React, { useState, useRef, useCallback } from 'react';
import propTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';

import './AliasPopup.css';

const data = [
  {
    alias: '/join #channel',
    description: 'Join a channel with the given name',
  },
  {
    alias: '/away message',
    description: 'Set your status to away',
  },
  {
    alias: '/back',
    description: 'Marks you as no longer away',
  },
  {
    alias: '/me',
    description: 'Write an action',
  },
];

const AliasPopup = ({ children, open, command }) => {
  const referenceNode = useRef();

  return (
    <Manager>
      <Popper placement="top-start">
        {({ ref, style, placement }) => {
          const styles = {
            ...style,
            display: 'none',
          };

          if (referenceNode.current) {
            const { width } = referenceNode.current.getBoundingClientRect();
            styles.display = 'block';
            styles.width = width;
          }

          if (!open) {
            return null;
          }

          return (
            <div
              className="alias-container"
              ref={ref}
              style={styles}
              data-placement={placement}
            >
              {data
                .filter(({ alias }) => alias.includes(command))
                .map(({ alias, description }) => (
                  <div className="alias-item">
                    <div className="alias-command">{alias}</div>
                    <div className="alias-description">{description}</div>
                  </div>
                ))}
            </div>
          );
        }}
      </Popper>
      <Reference
        innerRef={node => referenceNode.current = node}
      >
        {({ ref }) => (
          <div ref={ref}>
            {children}
          </div>
        )}
      </Reference>
    </Manager>
  );
};

AliasPopup.propTypes = {
  children: propTypes.node.isRequired,
  open: propTypes.bool,
  command: propTypes.string,
};

AliasPopup.defaultProps = {
  open: false,
  command: '',
};

export default AliasPopup;
