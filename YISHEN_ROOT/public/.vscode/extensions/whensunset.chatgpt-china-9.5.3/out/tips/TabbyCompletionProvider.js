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
exports.TabbyCompletionProvider = void 0;
const vscode_1 = require("vscode");
const TabbyClient_1 = require("./TabbyClient");
const utils_1 = require("./utils");
class TabbyCompletionProvider {
    getTriggerMode() {
        return this.triggerMode;
    }
    constructor() {
        this.triggerMode = "automatic";
        this.uuid = Date.now();
        this.latestTimestamp = 0;
        this.requesting = false;
        this.tabbyClient = TabbyClient_1.TabbyClient.getInstance();
        // User Settings
        this.enabled = true;
        this.data = [];
        this.latestCompletions = null;
        this.updateConfiguration();
        vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("CodeMoss")) {
                this.updateConfiguration();
            }
        });
    }
    postEvent(event) {
        const completion = this.latestCompletions;
        if (completion && completion.choices.length > 0) {
            let postBody = {
                type: event === "show" ? "view" : "select",
                completion_id: completion.id,
                // Assume only one choice is provided for now
                choice_index: completion.choices[0].index,
            };
            switch (event) {
                case "accept_word":
                    // select_kind should be "word" but not supported by Tabby Server yet, use "line" instead
                    postBody = Object.assign(Object.assign({}, postBody), { select_kind: "line" });
                    break;
                case "accept_line":
                    postBody = Object.assign(Object.assign({}, postBody), { select_kind: "line" });
                    break;
                default:
                    break;
            }
            console.debug(`Post event ${event}`, { postBody });
            try {
                this.tabbyClient.postEvent(postBody);
            }
            catch (error) {
                console.debug("Error when posting event", { error });
            }
        }
    }
    //@ts-ignore because ASYNC and PROMISE
    //prettier-ignore
    provideInlineCompletionItems(document, position, context, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const emptyResponse = Promise.resolve([]);
            const configuration = vscode_1.workspace.getConfiguration("CodeMoss");
            if (!configuration.get("code", "")) {
                return emptyResponse;
            }
            if (!this.enabled) {
                console.debug("Extension not enabled, skipping.");
                return emptyResponse;
            }
            if (context.triggerKind === vscode_1.InlineCompletionTriggerKind.Automatic && this.triggerMode === "manual") {
                console.debug("Skip automatic trigger when triggerMode is manual.");
                return null;
            }
            // Check if autocomplete widget is visible
            if (context.selectedCompletionInfo !== undefined) {
                console.debug("Autocomplete widget is visible, skipping.");
                return null;
            }
            const segments = this.calculatePromptRange(document, position);
            // const currentTimestamp = Date.now();
            // this.latestTimestamp = currentTimestamp;
            // const suggestionDelay = 2000;
            // await sleep(suggestionDelay);
            const currentTimestamp = Date.now();
            this.latestTimestamp = currentTimestamp;
            const suggestionDelay = 150;
            yield (0, utils_1.sleep)(suggestionDelay);
            console.debug('requesting', { requesting: this.requesting, data: this.data });
            if (this.requesting) {
                console.debug('data', this.data);
                // return this.data ||  emptyResponse;
                return Promise.resolve(this.data);
            }
            this.requesting = true;
            // console.debug(
            //   "Requesting: ",
            //   {
            //     uuid: this.uuid,
            //     segments,
            //     language: document.languageId
            //   }
            // );
            // Prompt is already nil-checked
            this.latestCompletions = null;
            try {
                const completion = yield this.tabbyClient.getCompletion({
                    segments,
                    language: document.languageId, // https://code.visualstudio.com/docs/languages/identifiers
                });
                this.requesting = false;
                const replaceRange = this.calculateReplaceRange(document, position);
                if (completion.code !== 0) {
                    if (completion.code === 500 && completion.msg === '访问过于频繁，请稍候再试') {
                        return Promise.resolve(this.data);
                    }
                    vscode_1.window
                        .showWarningMessage(completion.msg, "去设置")
                        .then((selection) => {
                        switch (selection) {
                            case "去设置":
                                vscode_1.commands.executeCommand("CodeMoss.openSettings");
                                break;
                        }
                    });
                    return Promise.resolve(this.data);
                }
                let result = completion.data;
                if (result.choices.length > 0) {
                    this.latestCompletions = result;
                }
                console.debug("Result completions: ", completion.data);
                const completions = this.toInlineCompletions(completion.data, replaceRange);
                this.data = completions || [];
                console.debug("completions ", completions);
                return Promise.resolve(completions);
            }
            catch (error) {
                this.requesting = false;
            }
        });
    }
    updateConfiguration() {
        const configuration = vscode_1.workspace.getConfiguration("CodeMoss");
        this.enabled = configuration.get("enabled", true);
        if (!vscode_1.workspace.getConfiguration("editor").get("inlineSuggest.enabled", true)) {
            this.triggerMode = "disabled";
            // this.emit("triggerModeUpdated");
        }
        else {
            this.triggerMode = vscode_1.workspace.getConfiguration("CodeMoss").get("inlineCompletion.triggerMode", "automatic");
            // this.emit("triggerModeUpdated");
        }
    }
    calculatePromptRange(document, position) {
        const maxLines = 20;
        const firstLine = Math.max(position.line - maxLines, 0);
        // return ;
        // 创建一个新的位置，它位于文档的末尾
        // const text = document.getText(range);
        return {
            prefix: document.getText(new vscode_1.Range(firstLine, 0, position.line, position.character)),
            suffix: document.getText(new vscode_1.Range(position, new vscode_1.Position(document.lineCount + 1, 0))),
        };
    }
    toInlineCompletions(tabbyCompletion, range) {
        var _a;
        let data = ((_a = tabbyCompletion === null || tabbyCompletion === void 0 ? void 0 : tabbyCompletion.choices) === null || _a === void 0 ? void 0 : _a.map((choice) => new vscode_1.InlineCompletionItem(choice.text, range, {
            title: "CodeMoss: Emit Event",
            command: "CodeMoss.emitEvent",
            arguments: [
                {
                    type: TabbyClient_1.EventType.InlineCompletionAccepted,
                    id: tabbyCompletion.id,
                    index: choice.index,
                },
            ],
        }))) || [];
        // const item1 = new InlineCompletionItem("Hello World");
        // item1.range = range;
        // data.push(item1);
        return data;
    }
    hasSuffixParen(document, position) {
        const suffix = document.getText(new vscode_1.Range(position.line, position.character, position.line, position.character + 1));
        return ")]}".indexOf(suffix) > -1;
    }
    calculateReplaceRange(document, position) {
        const hasSuffixParen = this.hasSuffixParen(document, position);
        if (hasSuffixParen) {
            return new vscode_1.Range(position.line, position.character, position.line, position.character + 1);
        }
        else {
            return new vscode_1.Range(position, position);
        }
    }
}
exports.TabbyCompletionProvider = TabbyCompletionProvider;
//# sourceMappingURL=TabbyCompletionProvider.js.map