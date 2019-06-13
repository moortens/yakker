import list from './list';
import presence from './presence';
import channel from './channel';
import messages from './messages';
import server from './server';

const handlers = [list, presence, channel, messages, server];

export default (...props) => {
  return handlers.map(fn => {
    return Reflect.apply(fn, undefined, props);
  });
};
