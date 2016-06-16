/**
 * Created by macdja38 on 2016-06-06.
 */
"use strict";
var Config = require("./config.js");
var config = new Config("config");

var git = require("git-rev");

var levels = Object.freeze({DEBUG: 1, INFO: 2, WARNING: 3, ERROR: 4, FATAL: 5});

var consoleLevel = config.get("debugLevel", "WARNING");
var sentryLevel = config.get("sentryLevel", "WARNING");

var sentryURL = config.get("sentryURL", false);

var raven = false;

if (sentryURL != "SENTRY_DSN") {
    git.long((commit)=> {
        git.branch((branch)=> {
            var raven = new (require('raven')).Client(sentryURL, {release: commit + "-" + branch});
        })
    });
}
var log = {};

log.debug = (message, error, data) => {
    if (levels[consoleLevel] >= levels["DEBUG"]) {
        console.log(message, error, data);
    }
    if (raven && levels[sentryLevel] >= levels["DEBUG"]) {
        //create a data event with all the extra info passed to sentry, throw everything but the user into extra.
        var e = {extra: {}};
        if (data.user) {
            e.user = user;
            delete data.user;
        }
        e.level = 'debug';
        e.extra = data;
        raven.captureError(error ? error : message, e, (response)=> {
        })
    }
};

log.info = (message, error, data) => {

};

log.warning = (message, error, data) => {

};

log.error = (message, error, data)=> {

};

log.fatal = (message, error, data) => {

};

module.exports = log;