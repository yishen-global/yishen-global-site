"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
/*
 * @Descripttion:
 * @version:
 * @Author: Hamster Huang
 * @Date: 2023-04-11 17:01:10
 * @LastEditors: Hamster Huang
 * @LastEditTime: 2023-07-14 19:41:42
 */
function sleep(milliseconds) {
    return new Promise((r) => setTimeout(r, milliseconds, 0));
}
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map