/**
 * Created by macdja38 on 2016-06-09.
 */
"use strict";

module.exports = class misc {
    constructor(e) {
        this.config = e.config;
    }

    init(e) {
        console.log("Misc module loaded.")
    }
    
    commands(e) {
        return [
            {
                triggers: ["ping"],
                level: "user",
                check: (command)=> {
                    return !!command
                },
                execute: (command)=> {
                    command.msg.reply("Pong");
                    return true
                }
            },
            {
                triggers: ["lmgtfy"],
                level: "user",
                check: (command)=> {
                    return !!command
                },
                execute: (command)=> {
                    command.msg.reply(`http://en.lmgtfy.com/?q=${command.args.join("+")}`);
                    return true
                }
            },
            {
                triggers: ["help"],
                level: "user",
                check: (command)=> {
                    return !!command
                },
                execute: (command)=> {
                    this.config.get("helpLink", "").then((helpLink) => {
                        command.msg.reply(`${helpLink}`);
                    });
                    return true
                }
            }
        ]


    }
};