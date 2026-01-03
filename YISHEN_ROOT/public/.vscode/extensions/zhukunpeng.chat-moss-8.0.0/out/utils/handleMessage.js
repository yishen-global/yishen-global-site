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
exports.sendMessage = exports.sendChatMossToken = exports.sendSelectedText = exports.sendFilesList = exports.getChatStorageString = exports.getFilesExcludingGitignore = exports.handleMessage = exports.localFileFullPath = void 0;
const vscode = require("vscode");
const fs = require("fs");
const ignore_1 = require("ignore");
const path = require("node:path");
let pageOverFlag = false;
exports.localFileFullPath = { path: '' };
let pageOverMessageFn = () => { };
function insertTextCallBack(text) {
    // 在文本插入代码
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        // const codeSnippet = new vscode.SnippetString(JSON.parse(text));
        const selection = editor.selection;
        // 获取选中的文本
        // const selectedText = editor.document.getText(selection);
        // 使用 editor.edit() 方法插入文本
        editor.edit(editBuilder => {
            // 获取当前选中的位置，如果没有选中则使用光标位置
            const position = editor.selection.active;
            editBuilder.delete(selection); // 删除选中内容
            // 插入解析后的文本
            editBuilder.insert(position, JSON.parse(text));
        }).then(success => {
            if (!success) {
                vscode.window.showErrorMessage('插入文本失败。');
            }
        });
        // editor.insertSnippet(codeSnippet);
        return;
    }
    // const editor = vscode.window.visibleTextEditors[0];
    // console.log('visibleTextEditors')
    // console.log(editor, vscode.window.visibleTextEditors)
    for (let i = 0; i < vscode.window.visibleTextEditors.length; i++) {
        const editor1 = vscode.window.visibleTextEditors[i];
        // console.log()
        if (editor1.document.fileName === exports.localFileFullPath.path) {
            editor1.edit(editBuilder => {
                // 获取当前选中的位置，如果没有选中则使用光标位置
                const position = editor1.selection.active;
                const selection = editor1.selection;
                editBuilder.delete(selection); // 删除选中内容
                // 插入解析后的文本
                editBuilder.insert(position, JSON.parse(text));
            }).then(success => {
                if (!success) {
                    vscode.window.showErrorMessage('插入文本失败。');
                }
            });
            return;
        }
    }
    vscode.window.showErrorMessage('请选中编辑器');
    return;
}
function handleMessage(context, message, webview, options) {
    switch (message.type) {
        case "chatStorage":
            context.globalState.update("chatStorage", message.value);
            return;
        case "insertText":
            insertTextCallBack(message.value);
            return;
        case "down":
            downloadFile(message.value);
            return;
        case "pageOver":
            sendMessage(context, webview);
            sendChatMossToken(context, webview);
            // console.log(pageOverMessageFn, 'pageOverMessageFn')
            // pageOverMessageFn && 
            if (pageOverMessageFn) {
                pageOverMessageFn(context, webview);
            }
            pageOverMessageFn = null;
            pageOverFlag = true;
            return;
        case "openview":
            openExternal(message.value);
        case "getFilesList":
            getFilesExcludingGitignore(context, webview, message.value);
            // openExternal(message.value)
            return;
        case "chatMossToken":
            context.globalState.update("chatMossToken", message.value);
            return;
    }
}
exports.handleMessage = handleMessage;
function openExternal(u) {
    const url = vscode.Uri.parse(JSON.parse(u));
    vscode.env.openExternal(url);
}
function downloadFile(fileContent) {
    vscode.window.showSaveDialog().then(uri => {
        if (uri) {
            const filePath = uri.fsPath;
            // const fileContent = ;
            fs.writeFile(filePath, JSON.parse(fileContent), err => {
                if (err) {
                    vscode.window.showErrorMessage('文件下载失败！');
                }
                else {
                    vscode.window.showInformationMessage('文件下载成功！');
                }
            });
        }
    });
}
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
function getFilesExcludingGitignore(context, webview, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('没有打开的工作区');
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        const gitignorePath = path.join(rootPath, '.gitignore');
        // 读取 .gitignore 文件
        let gitignoreContent = '';
        if (fs.existsSync(gitignorePath)) {
            gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        }
        // 解析 .gitignore
        const ig = (0, ignore_1.default)().add(gitignoreContent.split('\n').filter(line => line && !line.startsWith('#')));
        const files = [];
        function readDirectory(dir) {
            if (!fs.existsSync(dir)) {
                console.warn(`目录不存在: ${dir}`);
                return; // 如果目录不存在，直接返回
            }
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                // 检查文件或目录是否存在
                if (!fs.existsSync(fullPath)) {
                    console.warn(`文件或目录不存在: ${fullPath}`);
                    continue; // 如果不存在，跳过这个项
                }
                const stat = fs.statSync(fullPath);
                if (item.startsWith('.')) {
                    continue; // 跳过以点开头的文件或目录
                }
                if (stat.isDirectory()) {
                    readDirectory(fullPath); // 递归读取目录
                }
                else if (!ig.ignores(path.relative(rootPath, fullPath)) && item.indexOf(message ? message : "") > -1 &&
                    !imageExtensions.includes(path.extname(fullPath).toLowerCase())) {
                    files.push(fullPath); // 如果不在 .gitignore 中，添加到文件列表
                }
            }
        }
        readDirectory(rootPath);
        let data = [];
        let maxFiles = files.length > 50 ? 50 : files.length;
        for (let i = 0; i < maxFiles; i++) {
            const urlPath = files[i];
            const content = yield fs.readFileSync(urlPath, 'utf8'); // 读取文件内容
            data.push({
                fileName: urlPath,
                fileNameOnly: urlPath.split('/').pop(),
                fileContent: content
            });
        }
        console.log(data, 'data');
        sendFilesList(context, webview, JSON.stringify({
            type: "list",
            data: data
        }));
    });
}
exports.getFilesExcludingGitignore = getFilesExcludingGitignore;
function getChatStorageString(context) {
    let value = context.globalState.get("chatStorage");
    if (value) {
        return value;
    }
    else {
        return '';
    }
}
exports.getChatStorageString = getChatStorageString;
function sendFilesList(context, webview, text) {
    if (webview) {
        webview.postMessage({
            type: "sendFilesList",
            value: text,
        });
    }
    // setTimeout(() => {
    //   console.log(text)
    //   webview.postMessage({
    //     type: "selectedText",
    //     value: text,
    //   });
    // }, 1000);
}
exports.sendFilesList = sendFilesList;
function sendSelectedText(context, webview, text, textType) {
    // console.log(webview, 'webview')
    if (webview) {
        webview.postMessage({
            type: "selectedText",
            value: text,
            textType
        });
    }
    else {
        pageOverMessageFn = (context, webview) => {
            // console.log(text, 'te')
            webview.postMessage({
                type: "selectedText",
                value: text,
                textType
            });
        };
    }
}
exports.sendSelectedText = sendSelectedText;
function sendChatMossToken(context, webview) {
    let str = context.globalState.get("chatMossToken");
    // console.log(str)
    if (!str)
        return;
    setTimeout(() => {
        webview.postMessage({
            type: "chatMossToken",
            value: str,
        });
    }, 300);
}
exports.sendChatMossToken = sendChatMossToken;
function sendMessage(context, webview) {
    let str = getChatStorageString(context);
    setTimeout(() => {
        webview.postMessage({
            type: "storeData",
            value: str,
        });
    }, 300);
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=handleMessage.js.map