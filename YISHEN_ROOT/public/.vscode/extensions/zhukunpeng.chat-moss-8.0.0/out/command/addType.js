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
exports.addTypesCommand = void 0;
const vscode = require("vscode");
const typeServe_1 = require("../service/typeServe");
function addTypesCommand(context, sidebarProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        let isLogin = context.globalState.get("isLogin");
        if (!isLogin) {
            // vscode.window.showWarningMessage("请先登录");
            return;
        }
        let label = yield vscode.window.showInputBox({
            prompt: "请输入任务类型",
            validateInput: (s) => s && s.trim() ? undefined : "输入内容不能为空",
            placeHolder: "例如：[娱乐]",
            ignoreFocusOut: true,
        });
        if (label) {
            let userid = context.globalState.get("userid");
            let listTask = yield (0, typeServe_1.listTaskType)({ userid });
            let flag = listTask.data.some((row) => row.label == label);
            if (flag) {
                vscode.window.showWarningMessage("不可以添加重复的任务类型");
                return;
            }
            try {
                let res = yield (0, typeServe_1.addTaskType)({
                    userid,
                    label,
                });
                vscode.window.showInformationMessage(res.msg);
                // sidebarProvider.sendTypeOption();
            }
            catch (error) { }
        }
        else {
            vscode.window.showWarningMessage("输入内容不能为空");
        }
    });
}
exports.addTypesCommand = addTypesCommand;
//# sourceMappingURL=addType.js.map