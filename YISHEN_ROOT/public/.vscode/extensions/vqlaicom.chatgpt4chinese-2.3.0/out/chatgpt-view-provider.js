"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGptViewProvider = void 0;
const vscode = require("vscode");
const remoteconfig_1 = require("./config/remoteconfig");
class ChatGptViewProvider {
    constructor(context) {
        this.context = context;
    }
    async resolveWebviewView(webviewView, _context, _token) {
        this.webView = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            enableForms: true,
            enableCommandUris: true,
            localResourceRoots: [this.context.extensionUri]
        };
        webviewView.webview.html = await this.getHtml(webviewView.webview);
        vscode.workspace.onDidChangeConfiguration((event) => {
            // 主题切换
            if (event.affectsConfiguration('workbench.colorTheme')) {
                this.sendMessageToWebView({ type: 'changeTheme' });
            }
        });
        webviewView.webview.onDidReceiveMessage(data => {
            if (data.type === 'vsCodeOpenLink') {
                const uri = vscode.Uri.parse(data.detail, false);
                vscode.env.openExternal(uri);
            }
            if (data.type === 'vsCodeToken') {
                this.context.globalState.update("ChatGPT4Chinese.vsCodeToken", data.detail);
            }
            if (data.type === 'vsCodeCleanToken') {
                this.context.globalState.update("ChatGPT4Chinese.vsCodeToken", "");
            }
        });
    }
    sendMessageToWebView(message) {
        if (this.webView) {
            this.webView?.webview.postMessage(message);
        }
        else {
            this.message = message;
        }
    }
    async selectSearch(userInput, textCode) {
        // 如果是首次，插件窗口强制弹出
        if (!this.webView) {
            await vscode.commands.executeCommand('ChatGPT4Chinese-vscode-plugin.view.focus');
            setTimeout(() => {
                this.sendMessageToWebView({ type: 'selectSearch', data: { textCode: textCode, tips: userInput } });
            }, 5000);
        }
        else {
            this.webView?.show?.(true);
            this.sendMessageToWebView({ type: 'selectSearch', data: { textCode: textCode, tips: userInput } });
        }
    }
    async getHtml(webview) {
        const webviewUrl = await remoteconfig_1.default.get('web.url', '');
        if (webviewUrl === "") {
            return "啊哦~您当前访问 V起来·ChatGPT4Chinese 的网络不畅，" +
                "请切换手机热点，或找IT、网络管理员放行相关域名（*.5yoo.com; *.vqlai.com），然后重启IDE，" +
                "如有更多诉求，可关注【V起来助手】公众号，寻求更多开发大佬和技术小伙伴的帮助";
        }
        // 需要获取的css配置项
        const themeColorNameList = await remoteconfig_1.default.get('theme.color.css.name', '');
        const vsCodeToken = this.context.globalState.get("ChatGPT4Chinese.vsCodeToken") ?? "";
        const extension = vscode.extensions.getExtension("vqilai.ChatGPT4Chinese");
        const pluginVersion = extension?.packageJSON.version;
        const time = new Date().getTime();
        const IS_OSX = process.platform === 'darwin';
        return `<!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
                html,
                body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .iframeDiv {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    pointer-events: auto !important;
                }
            </style>
            </head>

            <body>
            <input id="inputCV" type="hidden"></input>
                <iframe id='ChatGPT4ChineseIframe' class="iframeDiv" src="${webviewUrl}&time=${time}" scrolling="none" frameborder="0" 
                    allow="cross-origin-isolated; autoplay; clipboard-read *; clipboard-write *;" sandbox="allow-same-origin allow-pointer-lock allow-scripts allow-downloads allow-forms"></iframe>
            </body>
        
            <script>
                const vscode = acquireVsCodeApi();
                var ChatGPT4ChineseIframe = document.getElementById('ChatGPT4ChineseIframe');    

                function sendTokenToIframe(){
                    var data = {};
                    data.eventType = "vsCodeToken";
                    data.detail = "${vsCodeToken}";
                    ChatGPT4ChineseIframe.contentWindow.postMessage(data, '*');
                }

                function getColorConfigAndNoticeIframe(){
                    var themeColorNameStr = "${themeColorNameList}";
                    var themeColorNameList = themeColorNameStr.split(",");
                    var colorConfig = {};
                    colorConfig.pluginVersion = "${pluginVersion}";
                    
                    for (let colorName of themeColorNameList){
                        var vscodeName = colorName.replace(/_/g,"-");
                        colorConfig[colorName] = getComputedStyle(document.documentElement).getPropertyValue("--vscode-" + vscodeName);
                    }

                    var data = {};
                    data.eventType = "vscodeChangeStyle";
                    data.detail = colorConfig;
        
                
                    // 如果接收到来自iframe的事件，则将获取到的颜色配置传给iframe
                    ChatGPT4ChineseIframe.contentWindow.postMessage(data, '*');
                }
                
                // 接收iframe传过来的消息
                window.addEventListener('message',function(e){
                    if(e && e.data && e.data.eventType === 'vsCodeIframeReady'){
                        getColorConfigAndNoticeIframe();
                        sendTokenToIframe();
                    }

                    if(e && e.data && e.data.eventType === 'vsCodeOpenLink'){
                        vscode.postMessage({
                            type: "vsCodeOpenLink",
                            detail: e.data.detail,
                        });
                    }

                    if(e && e.data && e.data.eventType === 'vsCodeToken'){
                        vscode.postMessage({
                            type: "vsCodeToken",
                            detail: e.data.detail
                        });
                    }

                    if(e && e.data && e.data.eventType === 'vsCodeCleanToken'){
                        vscode.postMessage({
                            type: "vsCodeCleanToken"
                        });
                    }

                    if(e && e.data && e.data.eventType === 'vscodePaste'){
                        if(${IS_OSX}){
                            var inputCV = document.getElementById("inputCV");
                            inputCV.focus();
                            window.navigator.clipboard.readText().then(
                                clipText => {
                                    var postData = {};
                                    postData.eventType = "vscodePaste";
                                    postData.detail = clipText;        
                                    ChatGPT4ChineseIframe.contentWindow.postMessage(postData, '*');
                                }
                            );
                        }
                    }
                });
                
                // 接收vscode传过来的消息
                window.addEventListener("message", (event) => {
                    const message = event.data;
                    switch (message.type) {
                        case "changeTheme":
                            getColorConfigAndNoticeIframe();
                            break;

                        case "selectSearch":
                            var data = {};
                            var detail = {};
                            detail.textCode = message.data.textCode;
                            detail.tips = message.data.tips;
                            data.eventType = "selectSearch";
                            data.detail = detail;
                            ChatGPT4ChineseIframe.contentWindow.postMessage(data, '*');
                            break;

                        default:
                            break;
                    }
                });
            
            </script>
        </html>`;
    }
}
exports.ChatGptViewProvider = ChatGptViewProvider;
//# sourceMappingURL=chatgpt-view-provider.js.map