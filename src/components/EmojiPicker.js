import React, { useState, useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import { Smile } from './Icons';

import Action from './Action';

function EmojiPicker({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    function closeEmojiPicker(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('click', closeEmojiPicker, false);
    }
    return () => document.removeEventListener('click', closeEmojiPicker, false);
  }, [isOpen]);

  return (
    <div className="message-input-menu">
      {isOpen && (
        <div
          style={{ position: 'absolute', bottom: '40px', right: 0 }}
          ref={pickerRef}
        >
          <Picker
            showPreview={false}
            set="twitter"
            showSkinTones={false}
            onSelect={onSelect}
          />
        </div>
      )}
      <div style={{ margin: '0 auto' }}>
        <Action onClickEvent={() => setIsOpen(!isOpen)}>
          <Smile />
        </Action>
      </div>
    </div>
  );
}

EmojiPicker.propTypes = {
  onSelect: propTypes.func.isRequired,
};

export default EmojiPicker;
