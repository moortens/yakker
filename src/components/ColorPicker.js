import React, { useEffect, useRef, useState } from 'react';
import propTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';
import ScrollBar from 'react-perfect-scrollbar';
import classnames from 'classnames';

import useHotKey from './hooks/useHotKey';

import './ColorPicker.css';

const ColorPicker = ({ children, open, onItemChange }) => {
  const referenceNode = useRef();
  const activeRef = useRef();
  const [index, setIndex] = useState(0);

  useHotKey('right', () => {
    setIndex(prev => (prev + 1) % 99);
  });
  useHotKey('left', () => {
    setIndex(prev => {
      return (prev - 1 + 99) % 99;
    });
  });

  useHotKey('enter', () => {
    onItemChange(index);
  });

  useEffect(() => {
    if (activeRef && activeRef.current) {
      activeRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [activeRef, index, onItemChange]);

  const render = () => {
    const elms = [];

    for (let i = 0; i < 99; i += 1) {
      const klasses = classnames('color-item', `background-${i}`, {
        'color-item-active': i === index,
      });

      elms.push(
        i === index ? (
          <div key={i} className={klasses} ref={activeRef} />
        ) : (
          <div key={i} className={klasses} />
        ),
      );
    }

    return elms;
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
              className="color-container"
              ref={ref}
              style={styles}
              data-placement={placement}
            >
              <ScrollBar>
                <div className="color-item-container">{render()}</div>
              </ScrollBar>
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

ColorPicker.propTypes = {
  children: propTypes.node.isRequired,
  open: propTypes.bool,
  onItemChange: propTypes.func.isRequired,
};

ColorPicker.defaultProps = {
  open: false,
};

export default ColorPicker;
