import action from './action';
import join from './join';
import part from './part';
import away from './away';
import back from './back';

const modules = [action, join, part, away, back];

const commands = modules.flatMap(({ alias, fn }) => {
  return alias.flatMap(command => ({
    [command.toLowerCase()]: fn,
  }));
});

export default Object.assign({}, ...commands);
