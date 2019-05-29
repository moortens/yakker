# yakker

**yakker** is an IRC client built with [irc-framework](https://github.com/kiwiirc/irc-framework/ "irc-framework"), [React](https://reactjs.org "React") and [Redux](https://redux.js.org/ "Redux"). It differes from other clients in a few ways. *It's not considered stable for production use*, so please, just *don't* use it for that :tongue:.

### Overview
* **There is no Status window.** People who need the status window will likely use other clients :dizzy_face:.
* **WebSocket only:exclamation:** Since UnrealIRCd and InspIRCd now ships with a WebSocket module, lets just use that :see_no_evil:
* **Made for smaller networks.** Don't know which channels to join? Well, lets give you a channel list when you connect :boom:
* **Threads.** IRCv3 has a draft, so... :sparkles:
* **Emojis:exclamation:** Yeah, everyone has those now, but :cool:...
* **Runs on any web server.** It's just a couple of static files, no daemon, fancy requirements or anything :floppy_disk:

### Development

Behind the scenes, `create-react-app` is used. Want to test or develop? Just clone or fork the respository then:

* `yarn install` to install all the dependencies
* Edit `config.json` in `src/` and add a network with WebSocket support  :wrench:(unless you run your own ircd on localhost, like me :thumbsup:).
* Let `yarn start` to do it's magic
* Be prepared for a ton of  :bug:'s