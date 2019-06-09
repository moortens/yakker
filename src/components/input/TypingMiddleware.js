import { throttle } from 'lodash';

import store from '../../lib/store';

export default () => {
  const sendTypingNotification = throttle(
    bid => {
      store.dispatch({
        type: 'WS::TYPING',
        payload: {
          bid,
        },
      });
    },
    3000,
    {
      leading: true,
      trailing: false,
    },
  );

  return {
    onChange: ({ value, props: { bid } }, next) => {
      const { document, selection, startBlock } = value;

      const re = /^\/([^\s|$]+)?/;

      // we have an active expansion.
      if (selection.isExpanded) {
        return next();
      }

      // this is a slash command.
      if (re.test(startBlock.text)) return next();

      /* Gets the size of all desendants of the document. This will give
       * all nodes, filter out anything thats not a paragraph with text or
       * an emoji.
       */
      const { size } = document.filterDescendants(({ type, text }) => {
        if (type === 'paragraph') {
          if (text) {
            return true;
          }
        }
        if (type === 'emoji') return true;

        return false;
      });

      if (size > 0) sendTypingNotification(bid);

      return next();
    },
  };
};
