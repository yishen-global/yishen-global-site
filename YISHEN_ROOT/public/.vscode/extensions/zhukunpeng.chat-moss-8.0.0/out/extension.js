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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
const Commands_1 = require("./tips/Commands");
const TabbyCompletionProvider_1 = require("./tips/TabbyCompletionProvider");
const TabbyStatusBarItem_1 = require("./tips/TabbyStatusBarItem");
const SidebarProvider_1 = require("./webview/SidebarProvider");
const utils_1 = require("./utils");
const handleMessage_1 = require("./utils/handleMessage");
const createWebviewPanel_1 = require("./utils/createWebviewPanel");
function activate(context) {
    const sidebarProvider = new SidebarProvider_1.SidebarProvider(context.extensionUri, context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(SidebarProvider_1.SidebarProvider.viewType, sidebarProvider, {
        webviewOptions: {
            retainContextWhenHidden: true,
        },
    }));
    // 监听活动文本编辑器的变化
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // console.log(editor, 'onDidChangeActiveTextEditor')
        if (editor) {
            // 获取当前文件的名称
            const fileFullPath = editor.document.fileName; // 完整路径
            handleMessage_1.localFileFullPath.path = fileFullPath;
            const fileName = fileFullPath.split('/').pop(); // 仅文件名
            // 获取当前文件的内容
            // const fileContent = editor.document.getText();
            // 获取当前文件的 URI
            const fileUri = editor.document.uri;
            const fileContent = yield vscode.workspace.fs.readFile(fileUri);
            // 将二进制数据转换为 Base64 字符串
            const base64String = Buffer.from(fileContent).toString('base64');
            // 显示信息
            // vscode.window.showInformationMessage(`当前文件: ${fileNameOnly}`);
            if ((_a = createWebviewPanel_1.webviewPanel.panel) === null || _a === void 0 ? void 0 : _a.webview) {
                // getFilesExcludingGitignore(context, webviewPanel.panel?.webview)
                (0, handleMessage_1.sendFilesList)(context, (_b = createWebviewPanel_1.webviewPanel.panel) === null || _b === void 0 ? void 0 : _b.webview, JSON.stringify({
                    type: "default",
                    data: {
                        fileFullPath,
                        name: fileName,
                        base64String
                    }
                }));
            }
            else if ((_c = sidebarProvider._view) === null || _c === void 0 ? void 0 : _c.webview) {
                // getFilesExcludingGitignore(context, sidebarProvider._view?.webview)
                (0, handleMessage_1.sendFilesList)(context, (_d = sidebarProvider._view) === null || _d === void 0 ? void 0 : _d.webview, JSON.stringify({
                    type: "default",
                    data: {
                        fileFullPath,
                        name: fileName,
                        base64String
                    }
                }));
            }
        }
        else {
            console.log('没有活动的文本编辑器。');
        }
    })));
    let disposable = vscode.workspace.onDidChangeTextDocument((editor) => __awaiter(this, void 0, void 0, function* () {
        var _e, _f, _g, _h;
        if (editor) {
            // 获取当前文件的名称
            const fileFullPath = editor.document.fileName; // 完整路径
            handleMessage_1.localFileFullPath.path = fileFullPath;
            const fileName = fileFullPath.split('/').pop(); // 仅文件名
            // 获取当前文件的内容
            // const fileContent = editor.document.getText();
            // 获取当前文件的 URI
            const fileUri = editor.document.uri;
            const fileContent = yield vscode.workspace.fs.readFile(fileUri);
            // 将二进制数据转换为 Base64 字符串
            const base64String = Buffer.from(fileContent).toString('base64');
            // 显示信息
            // vscode.window.showInformationMessage(`当前文件: ${fileNameOnly}`);
            if ((_e = createWebviewPanel_1.webviewPanel.panel) === null || _e === void 0 ? void 0 : _e.webview) {
                // getFilesExcludingGitignore(context, webviewPanel.panel?.webview)
                (0, handleMessage_1.sendFilesList)(context, (_f = createWebviewPanel_1.webviewPanel.panel) === null || _f === void 0 ? void 0 : _f.webview, JSON.stringify({
                    type: "default",
                    data: {
                        fileFullPath,
                        name: fileName,
                        base64String
                    }
                }));
            }
            else if ((_g = sidebarProvider._view) === null || _g === void 0 ? void 0 : _g.webview) {
                // getFilesExcludingGitignore(context, sidebarProvider._view?.webview)
                (0, handleMessage_1.sendFilesList)(context, (_h = sidebarProvider._view) === null || _h === void 0 ? void 0 : _h.webview, JSON.stringify({
                    type: "default",
                    data: {
                        fileFullPath,
                        name: fileName,
                        base64String
                    }
                }));
            }
        }
        else {
            console.log('没有活动的文本编辑器。');
        }
    }));
    // 在插件被释放时，注销事件监听器
    context.subscriptions.push(disposable);
    function textCallBack(pre) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            // 获取用户选中的内容
            const editor = vscode.window.activeTextEditor;
            let selectedText = '';
            let fileType = ''; // 获取文件类型
            if (editor) {
                fileType = editor.document.languageId; // 获取文件类型
                const selection = editor.selection; // 获取用户选择的文本区域
                selectedText = editor.document.getText(selection); // 获取选择区域的文本内容
                selectedText = (0, utils_1.escapeString)(selectedText);
                // console.log(fileType, webviewPanel.panel, pre, 'fileType', sidebarProvider._view?.webview)
            }
            if (!selectedText) {
                vscode.window.showInformationMessage('未选中文字');
                return;
            }
            // sendSelectedText(context, webviewPanel.panel?.webview, `${pre}\n \`\`\`${fileType}\n${selectedText}\n\`\`\``)
            let textType = '';
            let value = selectedText;
            if (fileType) {
                textType = 'vscodeMarkdown';
                value = `${pre}\n \`\`\` ${fileType}\n${selectedText}\n\`\`\``;
            }
            let panel;
            const configuration = vscode.workspace.getConfiguration("CodeMoss");
            if (configuration.get('direction', 'right') === 'right') {
                if (!createWebviewPanel_1.webviewPanel.panel) {
                    createWebviewPanel_1.webviewPanel.show(context);
                    (0, handleMessage_1.sendSelectedText)(context, undefined, value, textType);
                }
                else {
                    ((_a = createWebviewPanel_1.webviewPanel.panel) === null || _a === void 0 ? void 0 : _a.webview) && (0, handleMessage_1.sendSelectedText)(context, (_b = createWebviewPanel_1.webviewPanel.panel) === null || _b === void 0 ? void 0 : _b.webview, value, textType);
                }
            }
            else {
                if (sidebarProvider._view) {
                    (_d = (_c = sidebarProvider._view).show) === null || _d === void 0 ? void 0 : _d.call(_c, true);
                    (0, handleMessage_1.sendSelectedText)(context, (_e = sidebarProvider._view) === null || _e === void 0 ? void 0 : _e.webview, value, textType);
                }
                else {
                    yield vscode.commands.executeCommand("moss-view.focus");
                    (0, handleMessage_1.sendSelectedText)(context, undefined, value, textType);
                }
            }
        });
    }
    context.subscriptions.push(vscode.commands.registerCommand('extension.chat.chatMoss0ptimize', () => {
        textCallBack('优化这段代码 用中文回答:');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.chat.chatMossExplain', () => {
        textCallBack('解释这段代码 用中文回答:');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.chat.chatMossBugCcan', () => {
        textCallBack('说明这段代码可能存在的问题 用中文回答:');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.chat.openWebview', () => __awaiter(this, void 0, void 0, function* () {
        yield vscode.commands.executeCommand("moss-view.focus");
    })));
    context.subscriptions.push(vscode.commands.registerCommand('extension.chat.openWebviewRight', () => __awaiter(this, void 0, void 0, function* () {
        // console.log(webviewPanel.panel, '	webviewPanel.panel')
        createWebviewPanel_1.webviewPanel.show(context);
    })));
    // openWebview(context);
    context.subscriptions.push(vscode.commands.registerCommand('extension.chat.question', () => __awaiter(this, void 0, void 0, function* () {
        // 调用输入框
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
        const userInput = yield vscode.window.showInputBox({
            prompt: '指令词',
            placeHolder: '请输入指令词'
        });
        // 处理用户输入
        if (userInput) {
            // vscode.window.showInformationMessage(`您输入的名字是: ${userInput}`);
            textCallBack(`${userInput}:`);
        }
        else {
            vscode.window.showInformationMessage('您没有输入任何内容');
        }
    })));
    vscode.commands.registerCommand('extension.chat.deleteStore', () => {
        context.globalState.update("chatStorage", '');
        vscode.window.showInformationMessage('chatMoss本地数据已经删除');
    });
    // const configuration = vscode.workspace.getConfiguration("CodeMoss");
    // if (!configuration.get("code", "")) {
    // 	vscode.window
    // 		.showWarningMessage(
    // 			`欢迎来到ChatMoss页面，请前往设置页面设置授权码`,
    // 			"设置"
    // 		)
    // 		.then((selection) => {
    // 			switch (selection) {
    // 				case "设置":
    // 					vscode.commands.executeCommand("CodeMoss.openSettings");
    // 					break;
    // 			}
    // 		});
    // }
    const completionProvider = new TabbyCompletionProvider_1.TabbyCompletionProvider();
    // const statusBarItem = new TabbyStatusBarItem(context, completionProvider);
    context.subscriptions.push(vscode_1.languages.registerInlineCompletionItemProvider({ pattern: "**" }, new TabbyCompletionProvider_1.TabbyCompletionProvider()), TabbyStatusBarItem_1.tabbyStatusBarItem, ...(0, Commands_1.tabbyCommands)(completionProvider));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map