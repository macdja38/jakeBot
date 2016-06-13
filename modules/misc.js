/**
 * Created by macdja38 on 2016-06-09.
 */
"use strict";

module.exports = class misc {
    constructor(e) {
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
            }
        ]


    }
};