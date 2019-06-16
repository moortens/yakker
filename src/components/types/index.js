import Presence from './Presence';
import Kick from './Kick';
import Privmsg from './Privmsg';
import Action from './Action';
import Nick from './Nick';

export default {
  ACTION: Action,
  JOIN: Presence,
  PART: Presence,
  QUIT: Presence,
  KICK: Kick,
  PRIVMSG: Privmsg,
  NICK: Nick,
};
