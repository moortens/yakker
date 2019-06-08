import React, { useEffect, useRef, useState } from 'react';
import propTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';
import ScrollBar from 'react-perfect-scrollbar';
import classnames from 'classnames';

import useHotKey from './hooks/useHotKey';

import './AliasPopup.css';

const data = [
  {
    alias: '/join',
    parameters: '#channel',
    description: 'Join a channel with the given name',
  },
  {
    alias: '/away',
    parameters: '[message]',
    description: 'Set your status to away',
  },
  {
    alias: '/back',
    description: 'Marks you as no longer away',
  },
  {
    alias: '/me',
    parameters: '[message]',
    description: 'Sends your message as an action',
  },
];

const AliasPopup = ({ children, open, command, onSelect }) => {
  const referenceNode = useRef();
  const activeRef = useRef();
  const [index, setIndex] = useState(0);

  useHotKey('down', () => {
    setIndex(
      prev =>
        (prev + 1) % data.filter(({ alias }) => alias.includes(command)).length,
    );
  });
  useHotKey('up', () => {
    setIndex(prev => {
      const arr = data.filter(({ alias }) => alias.includes(command));

      return (prev - 1 + arr.length) % arr.length;
    });
  });

  useEffect(() => {
    if (activeRef && activeRef.current) {
      activeRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [activeRef, index]);

  const render = () => {
    return data
      .filter(({ alias }) => alias.includes(command))
      .map(({ alias, parameters, description }, idx) => {
        const klasses = classnames('alias-item', {
          'alias-item-active': idx === index,
        });

        const details = (
          <>
            <div className="alias-item-header">
              <span className="alias-command">{alias}</span>
              <span className="alias-parameters">{parameters}</span>
            </div>
            <div className="alias-description">{description}</div>
          </>
        );

        return idx === index ? (
          <div key={alias} className={klasses} ref={activeRef}>
            {details}
          </div>
        ) : (
          <div key={alias} className={klasses}>
            {details}
          </div>
        );
      });
  };

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
              <ScrollBar>{render()}</ScrollBar>
            </div>
          );
        }}
      </Popper>
      <Reference
        innerRef={node => {
          referenceNode.current = node;
        }}
      >
        {({ ref }) => <div ref={ref}>{children}</div>}
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
