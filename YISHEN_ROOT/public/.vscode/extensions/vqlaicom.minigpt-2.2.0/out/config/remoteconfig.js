"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpUtils_1 = require("./../httpUtils");
class RemoteConfig {
    constructor() {
    }
    static async get(key, defaultValue) {
        if (this.allConfigStr === null || this.allConfigStr === "") {
            this.allConfigStr = await httpUtils_1.default.get(this.remoteUrl);
            if (this.allConfigStr === "") {
                this.allConfigStr = await httpUtils_1.default.get(this.remoteUrlBackup);
            }
        }
        if (this.allConfigStr === null || this.allConfigStr === '') {
            return defaultValue;
        }
        const configJson = JSON.parse(this.allConfigStr);
        if (configJson === null) {
            return defaultValue;
        }
        return configJson.hasOwnProperty(key) ? configJson[key] : defaultValue;
    }
}
exports.default = RemoteConfig;
RemoteConfig.remoteUrl = 'https://static.vqlai.com/files/vscode-plugin/config.json';
RemoteConfig.remoteUrlBackup = 'http://static.vqlai.com/files/vscode-plugin/config.json';
RemoteConfig.allConfigStr = "";
//# sourceMappingURL=remoteconfig.js.map