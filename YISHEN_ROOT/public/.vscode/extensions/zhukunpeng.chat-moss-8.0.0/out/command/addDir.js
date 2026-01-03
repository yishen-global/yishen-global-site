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
exports.addDirCommand = void 0;
const vscode = require("vscode");
const zfServe_1 = require("../service/zfServe");
function addDirCommand(context) {
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
        let value = yield vscode.window.showInputBox({
            prompt: "请输入存放目录",
            validateInput: (s) => s && s.trim() ? undefined : "输入目录不能为空",
            placeHolder: "例如：tegbr4/izuna1",
            ignoreFocusOut: true,
        });
        if (value) {
            try {
                const res = yield zfServe_1.instance.post(`/github/searchStudent`, {
                    userid: account.id,
                    label: value,
                });
                //
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            vscode.window.showWarningMessage("输入内容不能为空");
        }
    });
}
exports.addDirCommand = addDirCommand;
//# sourceMappingURL=addDir.js.map