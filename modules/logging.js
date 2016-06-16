/**
 * Created by macdja38 on 2016-06-09.
 */
"use strict";

var SqlString = require('sqlstring');

module.exports = class logging {
    constructor(e) {
        this.sql = e.sql;
        this.client = e.client;
        this.logger = e.logger;
    }

    init(e) {
        console.log("Template Module loaded.");
        this.sql.query("CREATE TABLE IF NOT EXISTS messages (messageID VARCHAR(32), authorID VARCHAR(32), channelID VARCHAR(32), content VARCHAR(2000), INDEX messageID (messageID), UNIQUE(messageID));",
            (err, result)=> {
                // Case there is an error during the creation
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            }
        );
    }

    connect(e) {

    }

    disable(e) {

    }

    commands(e) {
        return [
            {
                triggers: ["lookup"],
                level: "user",
                check: (command)=> {
                    return !!command
                },
                execute: (command)=> {
                    this.sql.query(command.args.join(" "), (err, result)=> {
                        if (err) {
                            console.error(err);
                            command.msg.reply(err)
                        } else {
                            console.log(result);
                            command.msg.channel.sendMessage(`\`\`\`json\n${JSON.stringify(result, null, 1).substr(0, 1988)}\`\`\``).catch(console.error);
                        }
                    });
                    return true
                }
            },
            {
                triggers: ["templatecommand2"],
                level: "user",
                check: (command)=> {
                    return !!command
                },
                execute: (command)=> {
                    command.msg.reply("Template 2 is functional");
                    return true
                }
            }
        ]


    }

    onMisc(e) {
        this.sql.query(`INSERT INTO messages VALUES (${e.message.id},${e.message.author.id},${e.message.channel.id},${SqlString.escape(e.message.content)});`)
    }
};