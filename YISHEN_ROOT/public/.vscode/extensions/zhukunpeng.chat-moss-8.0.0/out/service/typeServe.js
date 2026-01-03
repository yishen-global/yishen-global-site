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
exports.onlineCount = exports.taskList = exports.taskover = exports.taskMy = exports.taskstar = exports.deleteTaskType = exports.listTaskType = exports.addTaskType = void 0;
const zfServe_1 = require("./zfServe");
function addTaskType(parmas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zfServe_1.instance.post(`/taskType/add`, parmas);
    });
}
exports.addTaskType = addTaskType;
function listTaskType(parmas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zfServe_1.instance.post(`/taskType/list`, parmas);
    });
}
exports.listTaskType = listTaskType;
function deleteTaskType(parmas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zfServe_1.instance.post(`/taskType/delete`, parmas);
    });
}
exports.deleteTaskType = deleteTaskType;
function taskstar(parmas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zfServe_1.instance.post(`/task/star`, parmas);
    });
}
exports.taskstar = taskstar;
function taskMy(parmas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zfServe_1.instance.post(`/task/my`, parmas);
    });
}
exports.taskMy = taskMy;
function taskover(parmas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zfServe_1.instance.post(`/task/over`, parmas);
    });
}
exports.taskover = taskover;
function taskList(parmas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zfServe_1.instance.post(`/task/list`, parmas);
    });
}
exports.taskList = taskList;
function onlineCount(parmas) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zfServe_1.instance.post(`/task/onlineCount`, parmas);
    });
}
exports.onlineCount = onlineCount;
//# sourceMappingURL=typeServe.js.map