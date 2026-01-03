"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabbyStatusBarItem = void 0;
const vscode_1 = require("vscode");
const TabbyClient_1 = require("./TabbyClient");
const label = "CodeMoss";
const iconLoading = "$(loading~spin)";
const iconReady = "$(check)";
const iconDisconnected = "$(plug)";
const iconDisabled = "$(x)";
const colorNormal = new vscode_1.ThemeColor('statusBar.foreground');
const colorWarning = new vscode_1.ThemeColor('statusBarItem.warningForeground');
const backgroundColorNormal = new vscode_1.ThemeColor('statusBar.background');
const backgroundColorWarning = new vscode_1.ThemeColor('statusBarItem.warningBackground');
const item = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
exports.tabbyStatusBarItem = item;
const client = TabbyClient_1.TabbyClient.getInstance();
client.on("statusChanged", updateStatusBarItem);
// workspace.onDidChangeConfiguration((event) => {
//   if (event.affectsConfiguration("CodeMoss")) {
//     updateStatusBarItem();
//   }
// });
updateStatusBarItem();
item.show();
function updateStatusBarItem() {
    const enabled = vscode_1.workspace.getConfiguration("CodeMoss").get("enabled", true);
    if (!enabled) {
        toDisabled();
    }
    else {
        const status = client.status;
        switch (status) {
            case "connecting":
                toLoading();
                break;
            case "ready":
                toReady();
                break;
            case "disconnected":
                toDisconnected();
                break;
        }
    }
}
function toLoading() {
    item.color = colorNormal;
    item.backgroundColor = backgroundColorNormal;
    item.text = `${iconLoading} ${label}`;
    item.tooltip = "Connecting to CodeMoss Server...";
    item.command = undefined;
    // window.showInformationMessage('Connecting to CodeMoss Server...',{ modal: false });
}
function toReady() {
    item.color = colorNormal;
    item.backgroundColor = backgroundColorNormal;
    item.text = `${iconReady} ${label}`;
    item.tooltip = "CodeMoss正在为您提供代码建议。";
    item.command = "CodeMoss.openSettings";
    vscode_1.window.showInformationMessage('CodeMoss服务已正常链接,很高兴您使用该服务');
}
function toDisconnected() {
    item.color = colorWarning;
    item.backgroundColor = backgroundColorWarning;
    item.text = `${iconDisconnected} ${label}`;
    item.tooltip = "CodeMoss服务已正常链接,很高兴您使用该服务";
    item.command = "CodeMoss.openSettings";
    vscode_1.window
        .showWarningMessage(`CodeMoss与服务器建立链接异常，请前往设置检查授权码是否正确`, "设置")
        .then((selection) => {
        switch (selection) {
            case "设置":
                vscode_1.commands.executeCommand("CodeMoss.openSettings");
                break;
        }
    });
}
function toDisabled() {
    item.color = colorWarning;
    item.backgroundColor = backgroundColorWarning;
    item.text = `${iconDisabled} ${label}`;
    item.tooltip = "CodeMoss已禁用。单击以启用。";
    item.command = "CodeMoss.openSettings";
}
//# sourceMappingURL=TabbyStatusBarItem.js.map