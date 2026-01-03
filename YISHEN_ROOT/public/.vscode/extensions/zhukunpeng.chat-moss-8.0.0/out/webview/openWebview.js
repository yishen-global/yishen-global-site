"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openWebview = void 0;
const vscode = require("vscode");
const utils_1 = require("../utils");
const fs_1 = require("fs");
const handleMessage_1 = require("../utils/handleMessage");
function openWebview(context) {
    return vscode.commands.registerCommand('extension.chat.openWebviewRight', function (uri) {
        const panel = vscode.window.createWebviewPanel('beautifulGirl1', // viewType
        "ChatMoss", // 视图标题
        vscode.ViewColumn.Two, // 显示在编辑器的哪个部位
        {
            enableScripts: true,
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        });
        let url = vscode.Uri.joinPath(context.extensionUri, "media", "main.html");
        let HTMLDATA = (0, fs_1.readFileSync)(url.fsPath, "utf-8");
        const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "media", "index.js"));
        const elementCssUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "media", "index.css"));
        const nonce = (0, utils_1.getNonce)();
        let data = HTMLDATA
            .replace("<!-- css -->", `
         <link rel="stylesheet" href="${elementCssUri}" />
      `)
            .replace("<!-- js -->", `
            <script type="module" crossorigin nonce="${nonce}" src="${scriptUri}"></script>
            <script>
                const chatMossObj = {}
            </script>
    `);
        panel.webview.html = data;
        panel.webview.onDidReceiveMessage(message => {
            (0, handleMessage_1.handleMessage)(context, message, panel.webview);
        }, undefined, context.subscriptions);
    });
}
exports.openWebview = openWebview;
//# sourceMappingURL=openWebview.js.map