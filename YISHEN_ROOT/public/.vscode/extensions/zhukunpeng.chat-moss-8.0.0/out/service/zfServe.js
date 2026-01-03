"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const axios_1 = require("axios");
const vscode_1 = require("vscode");
// const baseURL = "http://daily.zhufengpeixun.com";
const baseURL = "http://study.zhufengpeixun.com/";
// const baseURL = "http://127.0.0.1:7001/";
exports.instance = axios_1.default.create({
    baseURL,
});
console.log(exports.instance);
exports.instance.interceptors.request.use((value) => {
    console.log("请求参数", value);
    return value;
});
exports.instance.interceptors.response.use((response) => {
    if (response.status >= 200 && response.status < 300) {
        return response.data ? response.data : {};
    }
    console.log(response.status);
    return {};
}, (err) => {
    console.log("报错", err);
    vscode_1.window.showErrorMessage(err);
});
//# sourceMappingURL=zfServe.js.map