/**
 * Created by macdja38 on 2016-06-09.
 */
"use strict";

module.exports = class template {
    constructor(e) {

    }

    init(e) {
        console.log("Template Module loaded.")
    }

    conect(e) {

    }

    disable(e) {

    }

    commands(e) {
        return [
            {
                triggers: ["templatecommand"],
                level: "user",
                check: (command)=> {
                    return !!command
                },
                execute: (command)=> {
                    command.msg.reply("Template is functional");
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

    }
};