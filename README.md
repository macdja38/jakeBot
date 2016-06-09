# JakeBot
Modular discord bot designed to be expandable in any way desired, implementing a wide set of features in included modules.

# Setup
Clone repository using `git clone http://gitlab.imjake.me/discord-bot/discord-bot.git`
Install dependencies using `npm install`
If you have pm2 installed at this point start the project using `pm2 start pm2.json`
If not start the project using `node main.js`

# Updating
Use `git pull`
If you are using pm2 run `pm2 restart <id>`, you can get the id from `pm2 list`
If you are not using pm2 terminate the program then start it again.