import { useEffect } from 'react';
import { isHotkey } from 'is-hotkey';

export default (key, fn) => {
  useEffect(() => {
    const handleKeyDownEvent = e => {
      if (isHotkey(key, e)) {
        fn();
      }
    };

    window.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [key, fn]);
};
