"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
let context;
console.log(context.asAbsolutePath("media/resources/dark/add.svg"));
class MyButton {
    constructor(iconPath, tooltip) {
        this.iconPath = iconPath;
        this.tooltip = tooltip;
    }
}
const createResourceGroupButton = new MyButton({
    dark: vscode_1.Uri.file(context.asAbsolutePath("media/resources/dark/add.svg")),
    light: vscode_1.Uri.file(context.asAbsolutePath("media/resources/light/add.svg")),
}, "Create Resource Group");
const resourceGroups = [
    "vscode-data-function",
    "vscode-appservice-microservices",
    "vscode-appservice-monitor",
    "vscode-appservice-preview",
    "vscode-appservice-prod",
].map((label) => ({ label }));
const input = vscode_1.window.createQuickPick();
input.title = "hp";
// input.ignoreFocusOut = true;
input.placeholder = "please hp";
input.step = 1;
input.totalSteps = 3;
input.buttons = [
    vscode_1.QuickInputButtons.Back,
    createResourceGroupButton,
    vscode_1.QuickInputButtons.Back,
    createResourceGroupButton,
];
input.items = resourceGroups;
// input.onDidHide(() => input.show());
input.show();
// console.log(input);
//# sourceMappingURL=createQuickPick.js.map