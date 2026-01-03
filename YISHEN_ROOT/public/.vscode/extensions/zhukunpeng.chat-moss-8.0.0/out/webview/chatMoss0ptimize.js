"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMoss0ptimize = void 0;
/*
 * @Descripttion:
 * @version:
 * @Author: memory
 * @Date: 2023-04-18 11:17:05
 * @LastEditors: memory
 * @LastEditTime: 2023-04-18 17:05:44
 */
const vscode = require("vscode");
const utils_1 = require("../utils");
const handleMessage_1 = require("../utils/handleMessage");
const createWebviewPanel_1 = require("../utils/createWebviewPanel");
function chatMoss0ptimize(context) {
    return vscode.commands.registerCommand('extension.chat.chatMoss0ptimize', function (uri) {
        var _a;
        // 获取用户选中的内容
        const editor = vscode.window.activeTextEditor;
        let selectedText = '';
        if (editor) {
            const selection = editor.selection; // 获取用户选择的文本区域
            selectedText = editor.document.getText(selection); // 获取选择区域的文本内容
            selectedText = (0, utils_1.escapeString)(selectedText);
        }
        if (!selectedText) {
            vscode.window.showInformationMessage('未选中文字');
            return;
        }
        console.log(selectedText);
        createWebviewPanel_1.webviewPanel.show(context);
        (0, handleMessage_1.sendSelectedText)(context, (_a = createWebviewPanel_1.webviewPanel.panel) === null || _a === void 0 ? void 0 : _a.webview, `优化这段代码 用中文回答: ${selectedText}`);
        // chatMoss0ptimize.ts 优化这段代码 用中文回答
        // chatMossBugCcan.ts 解释这段代码 中文回答
        // chatMossExplain.ts 说明这段代码可能存在的问题 中文回答
    });
}
exports.chatMoss0ptimize = chatMoss0ptimize;
//# sourceMappingURL=chatMoss0ptimize.js.map