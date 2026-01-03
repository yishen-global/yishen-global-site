"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class HttpUtils {
    static async get(url) {
        try {
            const response = await (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
                timeout: 3000
            });
            return response.text();
        }
        catch (error) {
            console.log("http get error, e=" + error.message);
            return "";
        }
    }
}
exports.default = HttpUtils;
//# sourceMappingURL=httpUtils.js.map