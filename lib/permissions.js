/**
 * Created by macdja38 on 2016-06-16.
 */
"use strict";

var levels = ["jake", "admin", "moderator", "user" ,"blacklisted"];
const levelsCount = 5;
Object.freeze(levels);

module.exports = class permissions {
    constructor(permissionsConfig) {
        this.perms = permissionsConfig;
    }

    /**
     * check's if a user has enough permissions to execute a command.
     * @param user id or object.
     * @param level required to use the command.
     * @param server server user is on
     * @returns {Promise} that will resolve to true or false.
     */
    check(user, level, server) {
        return new Promise((resolve, reject)=> {
            if (typeof(user) === "object") {
                user = user.id;
            }
            var promises = [];
            var globalRoles;
            promises.push(this.perms.get("global_roles", {}).then((global_roles)=> {
                globalRoles = global_roles;
            }));
            if (typeof(server) === "object") {
                server = server.id;
            }
            if (server) {
                var serverRoles;
                promises.push(this.perms.get("server_roles", {}, {server: server}).then((server_roles)=> {
                    serverRoles = server_roles;
                }));
            }
            //find numeric value of required level.
            level = levels.indexOf(level)+1;
            Promise.all(promises).then(()=>{
                if (globalRoles[levels[levelsCount-1]].indexOf(user)>-1) {
                    return resolve(false);
                }
                for (var i = level; i--;) {
                    if (globalRoles[levels[i]].indexOf(user)>-1) {
                        return resolve(true)
                    }
                }
                if(typeof(serverRoles) === "object") {
                    if (serverRoles.hasOwnProperty(levels[levelsCount - 1]) && serverRoles[levels[levelsCount - 1]].indexOf(user) > -1) {
                        return resolve(false);
                    }
                    for (var i = level; i--;) {
                        if (serverRoles.hasOwnProperty(levels[levelsCount - 1]) && serverRoles[levels[i]].indexOf(user) > -1) {
                            return resolve(true)
                        }
                    }
                }
                return resolve(false);
            });
        });
    }

    /**
     * check's if a user has enough permissions to execute a command.
     * @param user id or object.
     * @param level required to use the command.
     * @param server server user is on
     * @returns {Promise} that will resolve to true or false.
     */
    checkGlobal(user, level) {
        return new Promise((resolve, reject)=> {
            if (typeof(user) === "object") {
                user = user.id;
            }
            var promises = [];
            var globalRoles;
            promises.push(this.perms.get("global_roles", {}).then((global_roles)=> {
                globalRoles = global_roles;
            }));
            //find numeric value of required level.
            level = levels.indexOf(level)+1;
            Promise.all(promises).then(()=>{
                if (globalRoles[levels[levelsCount-1]].indexOf(user)>-1) {
                    return resolve(false);
                }
                for (var i = level; i--;) {
                    if (globalRoles[levels[i]].indexOf(user)>-1) {
                        return resolve(true)
                    }
                }
                return resolve(false);
            });
        });
    }
};