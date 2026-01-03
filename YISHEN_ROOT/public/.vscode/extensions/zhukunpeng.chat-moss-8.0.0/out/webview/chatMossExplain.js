"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMossBugCcan = void 0;
/*
 * @Descripttion:
 * @version:
 * @Author: memory
 * @Date: 2023-04-18 11:17:05
 * @LastEditors: memory
 * @LastEditTime: 2023-04-18 12:20:02
 */
const vscode = require("vscode");
const utils_1 = require("../utils");
const handleMessage_1 = require("../utils/handleMessage");
const createWebviewPanel_1 = require("../utils/createWebviewPanel");
function chatMossBugCcan(context) {
    return vscode.commands.registerCommand('extension.chat.chatMossBugCcan', function (uri) {
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
        // console.log(selectedText);
        createWebviewPanel_1.webviewPanel.show(context);
        (0, handleMessage_1.sendSelectedText)(context, (_a = createWebviewPanel_1.webviewPanel.panel) === null || _a === void 0 ? void 0 : _a.webview, `说明这段代码可能存在的问题 中文回答: ${selectedText}`);
    });
}
exports.chatMossBugCcan = chatMossBugCcan;
//# sourceMappingURL=chatMossExplain.js.map