"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = exports.escapeString = void 0;
function escapeString(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        switch (char) {
            // case '\'': // 将单引号转义为 \'
            //   result += '\\\'';
            //   break;
            // case '\"': // 将双引号转义为 \"
            //   result += '\\"';
            //   break;
            case '\\': // 将反斜杠转义为 \\
                result += '\\\\';
                break;
            // case '\n': // 将换行符转义为 \n
            //   result += '\\n';
            //   break;
            case '\r': // 将回车符转义为 \r
                result += '\\r';
                break;
            // case '\t': // 将制表符转义为 \t
            //   result += '\\t';
            //   break;
            case '\$': // 将制表符转义为 \t
                result += '\\$';
                break;
            default:
                result += char;
        }
    }
    return result;
}
exports.escapeString = escapeString;
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;
//# sourceMappingURL=index.js.map