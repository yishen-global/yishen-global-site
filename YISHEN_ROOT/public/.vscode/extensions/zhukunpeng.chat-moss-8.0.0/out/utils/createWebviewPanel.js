"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webviewPanel = void 0;
/*
 * @Descripttion:
 * @version:
 * @Author: memory
 * @Date: 2023-04-18 11:44:32
 * @LastEditors: memory
 * @LastEditTime: 2023-04-18 17:36:39
 */
const vscode = require("vscode");
const utils_1 = require("../utils");
const fs_1 = require("fs");
const handleMessage_1 = require("./handleMessage");
class WebviewPanel {
    constructor() {
        // this.context = context;
    }
    handleData(context) {
        let panel = this.panel;
        let url = vscode.Uri.joinPath(context.extensionUri, "media", "main.html");
        let HTMLDATA = (0, fs_1.readFileSync)(url.fsPath, "utf-8");
        const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "media", "index.js"));
        const elementCssUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "media", "index.css"));
        const nonce = (0, utils_1.getNonce)();
        let data = HTMLDATA.replace("<!-- css -->", `
                 <link rel="stylesheet" href="${elementCssUri}" />
              `).replace("<!-- js -->", ` <script type="module" crossorigin nonce="${nonce}" src="${scriptUri}"></script>         
            `);
        return data;
    }
    show(context) {
        const columnToShowIn = vscode.ViewColumn.Beside; // 在当前活动编辑器旁边打开
        if (this.panel) {
            // If we already have a panel, show it in the target column
            this.panel.reveal(columnToShowIn);
            return this.panel;
        }
        else {
            let panel = vscode.window.createWebviewPanel("beautifulGirlRight", // viewType
            "ChatMoss", // 视图标题
            columnToShowIn, // 显示在编辑器的哪个部位
            {
                enableScripts: true,
                retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
            });
            this.panel = panel;
            panel.webview.html = this.handleData(context);
            panel.webview.onDidReceiveMessage((message) => {
                (0, handleMessage_1.handleMessage)(context, message, panel.webview);
            }, undefined, context.subscriptions);
            panel.onDidDispose(() => {
                this.panel = undefined;
            }, null, context.subscriptions);
            return this.panel;
        }
    }
}
exports.webviewPanel = new WebviewPanel();
//# sourceMappingURL=createWebviewPanel.js.map