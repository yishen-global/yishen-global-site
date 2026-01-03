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
exports.getList = exports.savedoc = exports.request = exports.isValidate = void 0;
const axios_1 = require("axios");
const dayjs = require("dayjs");
const vscode = require("vscode");
function isValidate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = context.globalState.get("token");
        let domain = context.globalState.get("domain");
        if (!token || !domain) {
            vscode.window.showErrorMessage("token,domain不能为空");
            vscode.window
                .showWarningMessage("是否去了解详细配置？", "去了解", "关闭")
                .then((result) => {
                if (result === "去了解") {
                    vscode.env.openExternal(vscode.Uri.parse("https://www.yuque.com/yuque/developer/doc#684fb2c5"));
                }
            });
            return;
        }
        let data = {
            baseURL: domain,
            headers: {
                "X-Auth-Token": token,
            },
        };
        return data;
    });
}
exports.isValidate = isValidate;
function request(context, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield isValidate(context);
        if (data) {
            return (0, axios_1.default)(Object.assign(data, params))
                .then((res) => {
                return res;
            })
                .catch((e) => {
                // console.log(e)
                return e.response
                    ? e.response.data
                    : {
                        status: 401,
                        message: "domain不合法",
                    };
            });
        }
    });
}
exports.request = request;
function savedoc(context, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield isValidate(context);
        let repo_id = context.globalState.get("dir");
        if (data) {
            let title = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
            params.title = title;
            params.costTime = dayjs(params.endTime)
                .diff(params.starTime, "hour", true)
                .toFixed(2); // 7
            return (0, axios_1.default)(Object.assign(data, {
                method: "post",
                url: `/repos/${repo_id}/docs`,
                params: {
                    description: "11111",
                    title: JSON.stringify(params),
                    body: JSON.stringify(params),
                },
            }))
                .then((res) => {
                console.log(res);
                vscode.window.showInformationMessage("恭喜完成一个任务");
                return res;
            })
                .catch((e) => {
                // console.log(e)
                let msg = e.response
                    ? e.response.data
                    : {
                        status: 401,
                        message: "domain不合法",
                    };
                vscode.window.showInformationMessage(msg.message);
            });
        }
    });
}
exports.savedoc = savedoc;
function getList(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield isValidate(context);
        let repo_id = context.globalState.get("dir");
        if (data) {
            return (0, axios_1.default)(Object.assign(data, {
                method: "get",
                url: `/repos/${repo_id}/docs`,
                params: {},
            }))
                .then((res) => {
                let datas = res.data.data;
                // 按照周一开始算
                let weekStar = dayjs().startOf("week").valueOf() + 1000 * 60 * 60 * 24;
                // weekStar = weekStar + 1000 * 60 * 60 * 24 * 7;
                let map = {};
                let curWeekMap = {};
                datas.forEach((data) => {
                    let pdata = JSON.parse(data.title);
                    if (pdata.starTime > weekStar) {
                        if (curWeekMap[pdata.type] === undefined) {
                            curWeekMap[pdata.type] = 0;
                        }
                        curWeekMap[pdata.type] += Number(pdata.costTime);
                    }
                    if (map[pdata.type] === undefined) {
                        map[pdata.type] = 0;
                    }
                    map[pdata.type] += Number(pdata.costTime);
                });
                let category = Object.keys(map);
                let data = Object.values(map).map((row) => row.toFixed(2));
                let ccategory = Object.keys(curWeekMap);
                let cdata = Object.values(curWeekMap).map((row) => row.toFixed(2));
                return {
                    curData: { category: ccategory, data: cdata },
                    allData: { category, data },
                };
            })
                .catch((e) => {
                // console.log(e)
                let msg = e.response
                    ? e.response.data
                    : {
                        status: 401,
                        message: "domain不合法",
                    };
                vscode.window.showInformationMessage(msg.message);
            });
        }
    });
}
exports.getList = getList;
//# sourceMappingURL=index.js.map