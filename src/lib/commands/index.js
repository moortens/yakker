import action from './action';
import join from './join';
import part from './part';

const modules = [
  action, join, part
]

const commands = modules.flatMap(({ alias, fn }) => {
  return alias.flatMap(command => ({
    [command.toLowerCase()]: fn,
  }));
});

export default Object.assign({}, ...commands);
