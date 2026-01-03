"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = require("./extension");
describe('extension tests', () => {
    // More test comming soon
    describe('getOpenAIKey function', () => {
        it('should retrieve the key from secrets when it exists', async () => {
            const context = { secrets: { get: jest.fn(() => Promise.resolve('key')) } };
            const result = await (0, extension_1.getOpenAIKey)(context);
            expect(result).toBe('key');
            expect(context.secrets.get).toHaveBeenCalledWith('openAIKey');
        });
    });
});
//
//# sourceMappingURL=extension.test.js.map