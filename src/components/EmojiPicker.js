import React, { useState, useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';
import { Picker } from 'emoji-mart';
import { Smile } from './Icons';

import 'emoji-mart/css/emoji-mart.css';

function EmojiPicker({ onSelect, children, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerModalRef = useRef(null);

  useEffect(() => {
    function closeEmojiPicker(e) {
      if (
        pickerModalRef.current &&
        !pickerModalRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('click', closeEmojiPicker, false);
    }
    return () => document.removeEventListener('click', closeEmojiPicker, false);
  }, [isOpen]);

  return (
    <Manager>
      <div>
        <Popper placement="bottom-end">
          {({ ref, style, placement }) => {
            if (!isOpen) {
              return null;
            }

            return (
              <div ref={ref} style={style} data-placement={placement}>
                <div ref={pickerModalRef}>
                  <Picker
                    ref={pickerModalRef}
                    showPreview={false}
                    set="twitter"
                    showSkinTones={false}
                    onSelect={data => {
                      onSelect(data);

                      setIsOpen(false);
                    }}
                  />
                </div>
              </div>
            );
          }}
        </Popper>
        <Reference>
          {({ ref }) => (
            <button
              type="button"
              onClick={() => setIsOpen(state => !state)}
              ref={ref}
              {...props}
            >
              {children === null ? <Smile /> : children}
            </button>
          )}
        </Reference>
      </div>
    </Manager>
  );
}

EmojiPicker.propTypes = {
  onSelect: propTypes.func.isRequired,
  children: propTypes.node,
};

EmojiPicker.defaultProps = {
  children: null,
};

export default EmojiPicker;
