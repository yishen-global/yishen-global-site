"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabbyCommands = void 0;
const vscode_1 = require("vscode");
const TabbyClient_1 = require("./TabbyClient");
const target = vscode_1.ConfigurationTarget.Global;
const applyCallback = {
    command: "CodeMoss.applyCallback",
    callback: (callback) => {
        callback === null || callback === void 0 ? void 0 : callback();
    },
};
const toogleEnabled = {
    command: "CodeMoss.toggleEnabled",
    callback: () => {
        const configuration = vscode_1.workspace.getConfiguration("CodeMoss");
        const enabled = configuration.get("enabled", true);
        console.debug(`Toggle Enabled: ${enabled} -> ${!enabled}.`);
        configuration.update("enabled", !enabled, target, false);
    },
};
const setApiEndpoint = {
    command: "CodeMoss.setServerUrl",
    callback: () => {
        const configuration = vscode_1.workspace.getConfiguration("CodeMoss");
        vscode_1.window
            .showInputBox({
            prompt: "Enter the URL of your CodeMoss Server",
            value: configuration.get("serverUrl", ""),
        })
            .then((url) => {
            if (url) {
                console.debug("Set CodeMoss Server URL: ", url);
                configuration.update("serverUrl", url, target, false);
            }
        });
    },
};
const openSettings = {
    command: "CodeMoss.openSettings",
    callback: () => {
        vscode_1.commands.executeCommand("workbench.action.openSettings", "CodeMoss");
    },
};
const tabbyClient = TabbyClient_1.TabbyClient.getInstance();
const emitEvent = {
    command: "CodeMoss.emitEvent",
    callback: (event) => {
        console.debug("Emit Event: ", event);
        tabbyClient.postEvent(event);
    },
};
const triggerInlineCompletion = {
    command: "CodeMoss.inlineCompletion.trigger",
    callback: () => {
        vscode_1.commands.executeCommand("editor.action.inlineSuggest.trigger");
    },
};
const acceptInlineCompletion = {
    command: "CodeMoss.inlineCompletion.accept",
    callback: () => {
        vscode_1.commands.executeCommand("editor.action.inlineSuggest.commit");
    },
};
const acceptInlineCompletionNextWord = (completionProvider) => {
    return {
        command: "CodeMoss.inlineCompletion.acceptNextWord",
        callback: () => {
            completionProvider.postEvent("accept_word");
            vscode_1.commands.executeCommand("editor.action.inlineSuggest.acceptNextWord");
        },
    };
};
const acceptInlineCompletionNextLine = (completionProvider) => {
    return {
        command: "CodeMoss.inlineCompletion.acceptNextLine",
        callback: () => {
            completionProvider.postEvent("accept_line");
            const configuration = vscode_1.workspace.getConfiguration("CodeMoss");
            // FIXME: this command move cursor to next line, but we want to move cursor to the end of current line
            vscode_1.commands.executeCommand("editor.action.inlineSuggest.acceptNextLine");
        },
    };
};
const configTarget = vscode_1.ConfigurationTarget.Global;
const toggleInlineCompletionTriggerMode = {
    command: "CodeMoss.toggleInlineCompletionTriggerMode",
    callback: (value) => {
        const configuration = vscode_1.workspace.getConfiguration("CodeMoss");
        let target = value;
        if (!target) {
            const current = configuration.get("inlineCompletion.triggerMode", "automatic");
            if (current === "automatic") {
                target = "manual";
            }
            else {
                target = "automatic";
            }
        }
        configuration.update("inlineCompletion.triggerMode", target, configTarget, false);
    },
};
const openKeybindings = {
    command: "CodeMoss.openKeybindings",
    callback: () => {
        vscode_1.commands.executeCommand("workbench.action.openGlobalKeybindings", "CodeMoss.inlineCompletion");
    },
};
const tabbyCommands = (completionProvider) => [
    toogleEnabled,
    toggleInlineCompletionTriggerMode,
    setApiEndpoint,
    openSettings,
    openKeybindings,
    applyCallback,
    triggerInlineCompletion,
    acceptInlineCompletion,
    acceptInlineCompletionNextWord(completionProvider),
    acceptInlineCompletionNextLine(completionProvider),
].map((command) => vscode_1.commands.registerCommand(command.command, command.callback, command.thisArg));
exports.tabbyCommands = tabbyCommands;
//# sourceMappingURL=Commands.js.map