/**
 * Created by macdja38 on 2016-06-06.
 */
"use strict";

var Config = require("./lib/config.js");
var config = new Config("config");
var auth = new Config("auth");
var permissionsConfig = new Config("permissions");

var logger = require("./lib/logger.js");

var Permissions = require("./lib/permissions.js");
var permissions = new Permissions(permissionsConfig);

var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie({autoReconnect: true});

var now = require("performance-now");

var Parse = require("./lib/parser.js");

var moduleList = [];

var connection;

auth.get("sql").then((sql)=> {
    if (sql) {
        console.log("Enabling SQL");
        var mysql = require('mysql');
        connection = mysql.createConnection('mysql://discord:discord@pvpcraft.ca:3306/discord');

    }
});

var ready = false;
var botName;
var botId;


auth.get("token").then((token)=> {
    client.connect({token: token});
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log("Connected as: " + client.User.username);
    botName = client.User.username;
    botId = client.User.id;
    config.get("modules").then(loadModules)
});

client.Dispatcher.on(Events.DISCONNECTED, e => {
    console.error(e.error);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    let t1;
    let t2;
    t1 = now();
    let prefix;
    for (let moduleName in moduleList) {
        if (moduleList.hasOwnProperty(moduleName) && moduleList[moduleName].module.onMisc) {
            moduleList[moduleName].module.onMisc(e);
        }
    }
    if (e.message.isPrivate) {
        prefix = config.get("prefix", null, {server: "*"})
    } else {
        prefix = config.get("prefix", null, {server: e.message.guild.id})
    }
    prefix.then((prefix)=> {
        var command = Parse.command(prefix, e.message, {"allowMention": botId, "botName": botName});
        if (command) {
            console.log(command);
            for (let moduleName in moduleList) {
                if (moduleList.hasOwnProperty(moduleName)) {
                    moduleList[moduleName].commands.forEach((executor)=> {
                        if (executor.triggers.includes(command.command)) {
                            console.log("Got this far");
                            console.log("Requires level " + executor.level);
                            permissions.check(e.message.author, executor.level, e.message.guild).then((allowed)=> {
                                if (!allowed) {
                                    t2 = now();
                                    console.log(`Denied ${command.command} from ${e.message.author.username} in ${t2 - t1}ms`)
                                }
                                if (allowed && executor.check(command)) {
                                    executor.execute(command);
                                }
                                t2 = now();
                                console.log(`Executed ${command} from ${e.message.author.username} in ${t2 - t1}ms`)
                            });
                        }
                    });
                }
            }
        }
    });
});

/**
 * logout on SIGINT
 * if logging out does not happen within 5s exit with an error.
 */
process.on('SIGINT', ()=> {
    setTimeout(() => {
        process.exit(1)
    }, 5000);
    console.log("Logging out.");
    client.disconnect();
    console.log("Bye");
    process.exit(0);
});

function loadModules(modules) {
    let e = {config: config, client: client, auth: auth, moduleList: moduleList, events: Events, sql: connection};
    console.log(moduleList);
    for (let moduleName in modules) {
        if (modules.hasOwnProperty(moduleName)) {
            try {
                var module = new (require(modules[moduleName]))(e);
                moduleList[moduleName] = {module: module, commands: module.commands()};
                if (moduleList[moduleName].module.init) {
                    moduleList[moduleName].module.init();
                }
            } catch (err) {
                console.error(`Error ${err} loading ${moduleName} from ${modules[moduleName]}`);
            }
        }
    }
    console.log(moduleList);
    ready = true;
}