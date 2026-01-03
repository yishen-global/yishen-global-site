"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zfloginCommand = void 0;
const axios_1 = require("axios");
const vscode = require("vscode");
const zfServe_1 = require("../service/zfServe");
let zfUlr = "http://www.zhufengpeixun.com/";
var ButtonType;
(function (ButtonType) {
    ButtonType["know"] = "\u4E86\u89E3\u4E0B";
    ButtonType["close"] = "\u5173\u95ED";
})(ButtonType || (ButtonType = {}));
function zfloginCommand(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { account, accessToken } = yield vscode.authentication.getSession("github", ["user:email"], {
            createIfNone: true,
        });
        // {
        // id: 18394192.
        // label: "hpstream"}
        if (!account) {
            vscode.window.showWarningMessage("请检查github账户权限");
            return;
        }
        const { data } = yield (0, axios_1.default)({
            method: "get",
            url: `https://api.github.com/user`,
            headers: {
                accept: "application/json",
                Authorization: `token ${accessToken}`,
            },
        });
        if (!data)
            return;
        console.log(zfServe_1.instance);
        try {
            const res = yield zfServe_1.instance.post(`/github/searchStudent`, { data });
            console.log(res.isStudent);
            if (res.isStudent) {
                vscode.window.showInformationMessage(`恭喜你登录成功`);
            }
            else {
                vscode.window.showInformationMessage(`恭喜你登录成功`);
            }
        }
        catch (e) {
            console.log(e);
        }
        yield context.globalState.update("isLogin", true);
        yield context.globalState.update("userid", account.id);
        return;
    });
}
exports.zfloginCommand = zfloginCommand;
//# sourceMappingURL=zflogin.js.map