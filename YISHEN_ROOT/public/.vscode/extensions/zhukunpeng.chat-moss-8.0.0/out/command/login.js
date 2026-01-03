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
exports.loginCommand = void 0;
const vscode = require("vscode");
let authUrl = "https://www.yuque.com/settings/profile";
let defaultUrl = "https://www.yuque.com/api/v2";
function loginCommand(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let domain = yield vscode.window.showInputBox({
            prompt: "请输入",
            placeHolder: `默认值：${defaultUrl}`,
            ignoreFocusOut: true,
        });
        context.globalState.update("domain", domain || defaultUrl);
        vscode.window
            .showWarningMessage("了解如何获取token", "去了解", "关闭")
            .then((result) => {
            if (result === "去了解") {
                vscode.env.openExternal(vscode.Uri.parse(authUrl));
            }
        });
        let res = yield vscode.window.showInputBox({
            prompt: "请输入token",
            validateInput: (s) => s && s.trim() ? undefined : "token不能",
            placeHolder: "请输入语雀token",
            ignoreFocusOut: true,
        });
        if (res) {
            context.globalState.update("token", res);
            vscode.window.showInformationMessage("您已通过语雀的授权，可以一键保存了,请关联存储目录");
        }
        else {
            vscode.window.showWarningMessage("输入不能为空");
        }
    });
}
exports.loginCommand = loginCommand;
//# sourceMappingURL=login.js.map