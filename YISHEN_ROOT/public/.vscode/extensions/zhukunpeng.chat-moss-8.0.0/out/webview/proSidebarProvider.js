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
exports.ProSidebarProvider = void 0;
const fs_1 = require("fs");
const vscode = require("vscode");
const utils_1 = require("../utils");
const handleMessage_1 = require("../utils/handleMessage");
class ProSidebarProvider {
    constructor(_extensionUri, context) {
        this._extensionUri = _extensionUri;
        this.context = context;
    }
    handleMessage(webviewView) {
        // Receive message from the webview.
        webviewView.webview.onDidReceiveMessage((data) => __awaiter(this, void 0, void 0, function* () {
            (0, handleMessage_1.handleMessage)(this.context, data, webviewView.webview);
        }));
    }
    resolveWebviewView(webviewView) {
        return __awaiter(this, void 0, void 0, function* () {
            this._view = webviewView;
            let url = vscode.Uri.joinPath(this._extensionUri, "media", "pro", "main.html");
            // let HTMLDATA = readFileSync(url.path, "utf-8");
            let HTMLDATA = (0, fs_1.readFileSync)(url.fsPath, "utf-8");
            webviewView.webview.options = {
                // Allow scripts in the webview
                enableScripts: true,
                localResourceRoots: [this._extensionUri],
            };
            webviewView.onDidChangeVisibility((v) => {
                // webviewView.webview.html = this._getHtmlForWebview(
                //   webviewView.webview,
                //   HTMLDATA
                // );
                (0, handleMessage_1.sendMessage)(this.context, webviewView.webview);
            });
            this.handleMessage(webviewView);
            try {
                webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, HTMLDATA);
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    _getHtmlForWebview(webview, res) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "pro", "index.js"));
        const elementCssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "pro", "index.css"));
        const nonce = (0, utils_1.getNonce)();
        let data = res
            .replace("<!-- css -->", `
         <link rel="stylesheet" href="${elementCssUri}" />
      `)
            .replace("<!-- js -->", ` 
      <script type = "module" crossorigin nonce = "${nonce}" src = "${scriptUri}" > </script>
    `);
        return data;
    }
}
exports.ProSidebarProvider = ProSidebarProvider;
ProSidebarProvider.viewType = "moss-view-Pro";
//# sourceMappingURL=proSidebarProvider.js.map