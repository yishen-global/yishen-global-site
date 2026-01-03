"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const chatgpt_view_provider_1 = require("./chatgpt-view-provider");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "MiniGPT" is now active!');
    const chatViewProvider = new chatgpt_view_provider_1.ChatGptViewProvider(context);
    let webviewProvider = vscode.window.registerWebviewViewProvider("MiniGPT-vscode-plugin.view", chatViewProvider, {
        webviewOptions: { retainContextWhenHidden: true }
    });
    const explainCodeRegister = vscode.commands.registerCommand('MiniGPT.explainCode', explainCode);
    const addCommentRegister = vscode.commands.registerCommand('MiniGPT.addComment', addComment);
    const addTestCaseRegister = vscode.commands.registerCommand('MiniGPT.addTestCase', addTestCase);
    const addUnitTestRegister = vscode.commands.registerCommand('MiniGPT.addUnitTest', addUnitTest);
    const improveCodeRegister = vscode.commands.registerCommand('MiniGPT.improveCode', improveCode);
    context.subscriptions.push(webviewProvider, explainCodeRegister, addCommentRegister, addTestCaseRegister, addUnitTestRegister, improveCodeRegister);
    function explainCode() { selectSearch('请解释这部分代码'); }
    function addComment() { selectSearch('请给以下代码，每一行都增加中文注释'); }
    function addTestCase() { selectSearch('帮我生成测试用例'); }
    function addUnitTest() { selectSearch('请帮我生成，可以独立运行的单元测试代码'); }
    function improveCode() { selectSearch('请指出这部分代码有什么问题，并给出具体的优化方案，以及优化后的代码，代码尽量保留原注释的前提下，每一行增加新的中文注释'); }
    async function selectSearch(userInput) {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            const selectedCode = editor.document.getText(vscode.window.activeTextEditor?.selection);
            await chatViewProvider.selectSearch(userInput, selectedCode ?? "");
        }
    }
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map