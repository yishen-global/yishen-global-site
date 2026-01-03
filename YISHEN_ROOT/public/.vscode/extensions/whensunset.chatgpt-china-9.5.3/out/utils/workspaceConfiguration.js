"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceConfiguration = void 0;
const vscode_1 = require("vscode");
function getWorkspaceConfiguration() {
    return vscode_1.workspace.getConfiguration("mossArea");
}
exports.getWorkspaceConfiguration = getWorkspaceConfiguration;
//# sourceMappingURL=workspaceConfiguration.js.map