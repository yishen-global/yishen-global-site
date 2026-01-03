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
exports.TabbyClient = exports.EventType = void 0;
const vscode_1 = require("vscode");
const axios_1 = require("axios");
const utils_1 = require("./utils");
const node_events_1 = require("node:events");
const node_assert_1 = require("node:assert");
const logAxios = false;
if (logAxios) {
    axios_1.default.interceptors.request.use((request) => {
        console.debug("Starting Request: ", request);
        return request;
    });
    axios_1.default.interceptors.response.use((response) => {
        console.debug("Response: ", response);
        return response;
    });
}
var EventType;
(function (EventType) {
    EventType["InlineCompletionDisplayed"] = "view";
    EventType["InlineCompletionAccepted"] = "select";
})(EventType = exports.EventType || (exports.EventType = {}));
class TabbyClient extends node_events_1.EventEmitter {
    static getInstance() {
        if (!TabbyClient.instance) {
            TabbyClient.instance = new TabbyClient();
        }
        return TabbyClient.instance;
    }
    constructor() {
        super();
        this.tabbyServerUrl = "";
        this.status = "connecting";
        this.updateConfiguration();
        vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("CodeMoss")) {
                this.updateConfiguration();
            }
        });
    }
    updateConfiguration() {
        const configuration = vscode_1.workspace.getConfiguration("CodeMoss");
        this.tabbyServerUrl = configuration.serverUrl;
        console.log(this.tabbyServerUrl);
        this.ping();
    }
    changeStatus(status) {
        this.status = status;
        this.emit("statusChanged", status);
    }
    ping(tries = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.tabbyServerUrl}/luomacode-api/code/gen/v1/health`, {
                    timeout: 3000, // 设置超时时间为5秒
                });
                (0, node_assert_1.strict)(response.status == 200);
                this.changeStatus("ready");
            }
            catch (e) {
                if (tries > 2) {
                    this.changeStatus("disconnected");
                    return;
                }
                this.changeStatus("connecting");
                const pingRetryDelay = 1000;
                yield (0, utils_1.sleep)(pingRetryDelay);
                this.ping(tries + 1);
            }
        });
    }
    getCompletion(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status == "disconnected") {
                this.ping();
            }
            const configuration = vscode_1.workspace.getConfiguration("CodeMoss");
            try {
                const response = yield axios_1.default.post(`${this.tabbyServerUrl}/luomacode-api/code/gen/v1/completions`, request, {
                    headers: {
                        Authorization: configuration.get("code", ""),
                    },
                });
                (0, node_assert_1.strict)(response.status == 200);
                return response.data;
            }
            catch (e) {
                this.ping();
                console.log(e);
                return null;
            }
        });
    }
    postEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status == "disconnected") {
                this.ping();
            }
            try {
                const response = yield (0, axios_1.default)({
                    method: "post",
                    url: "${this.tabbyServerUrl}/luomacode-api/code/gen/v1/events",
                    params: {
                        query: {
                            select_kind: event.select_kind,
                        },
                    },
                    data: {
                        type: event.type,
                        completion_id: event.id,
                        choice_index: event.index,
                    },
                });
                (0, node_assert_1.strict)(response.status == 200);
            }
            catch (e) {
                this.ping();
            }
        });
    }
}
exports.TabbyClient = TabbyClient;
//# sourceMappingURL=TabbyClient.js.map