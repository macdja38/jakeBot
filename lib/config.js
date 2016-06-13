/**
 * Created by macdja38 on 2016-06-06.
 */
"use strict";

var fs = require("fs");
var path = require("path");

module.exports = class config {
    /**
     * create config instance.
     * @param fileName of the config file this references
     */
    constructor(fileName) {
        this.name = fileName;
        this.filepath = path.join(__dirname, `../config/${this.name}.json`);
        this.exampleFilepath = path.join(__dirname, `../config/example/${this.name}.json`);
        this.reload();
    }

    /**
     * Reloads the config from disk, checking to make sure it exists, if not copy's backup
     */
    reload() {
        try {
            this.data = JSON.parse(fs.readFileSync(this.filepath, "utf8"));
        } catch (error) {
            if ("ENOENT" === error.code) {
                try {
                    this.data = fs.readFileSync(this.exampleFilepath, "utf8");
                } catch (err) {
                    console.error(err);
                    throw new Error(`Default config for ${this.name} has not been created.`);
                }
                fs.writeFileSync(this.filepath, this.data, "utf8");
                throw new Error(`Default config for ${this.name} has been created for you but was not present, please edit it.`);
            } else {
                throw error;
            }
        }
    }

    /**
     * Writes out the current config to file.
     */
    write() {
        return new Promise((resolve, reject)=> {
            fs.writeFile(this.filepath, JSON.stringify(this.data, null, 2), "utf8", (err)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    };

    /**
     * Stores the value in the current data and writes it out to file.
     * @param key
     * @param value
     * @param options takes an options value, supports {server: id} to get per server values of config settings.
     *
     */
    set(key, value, options) {
        if (options && options.hasOwnProperty("server")) {
            if (!this.data.hasOwnProperty(options.server)) {
                this.data[options.server] = {[key]: value};
            } else {
                this.data[options.server][key] = value;
            }
        } else {
            this.data[key] = value;
        }
        return this.write()
    };

    /**
     * get config value by key. returns a promise in preparation for config's being pulled from an external database.
     * @param {String} key to check for
     * @param {*} fallBack default value if value is not in config.
     * @param {Object} options takes an options value, supports {server: id} to get per server values of config settings.
     * @return {Promise} that will be resolved to the config key
     */
    get(key, fallBack, options) {
            if (options && options.hasOwnProperty("server")) {
                if (this.data.hasOwnProperty(options.server)) {
                    var serverData = this.data[options.server];
                } else {
                    var globalData = this.data["*"];
                }
                if (serverData && serverData.hasOwnProperty(key)) {
                    resolve(serverData[key]);
                }
                else if (globalData && globalData.hasOwnProperty(key)) {
                    resolve(globalData[key]);
                }
                resolve(fallBack);
            }
            else if (this.data.hasOwnProperty(key)) {
                resolve(this.data[key]);
            } else {
                resolve(fallBack);
            }
    }
};