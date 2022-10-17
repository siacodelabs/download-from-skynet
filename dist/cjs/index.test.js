"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const expected_1 = __importDefault(require("@akromio/expected"));
const doubles_1 = require("@akromio/doubles");
suite(__filename, () => {
    const portal = "https://web3portal.com";
    suite("run()", () => {
        const skynetModulePath = require.resolve("@skynetlabs/skynet-nodejs");
        const actionsCoreModulePath = require.resolve("@actions/core");
        const actionModulePath = require.resolve("./index");
        setup(() => {
            delete require.cache[skynetModulePath];
            delete require.cache[actionsCoreModulePath];
            delete require.cache[actionModulePath];
        });
        teardown(() => {
            doubles_1.interceptor.clear(skynetModulePath);
            doubles_1.interceptor.clear(actionsCoreModulePath);
        });
        test("when skylink exists, downloadFile() must be called and file saved", () => __awaiter(void 0, void 0, void 0, function* () {
            const { SkynetClient } = yield Promise.resolve().then(() => __importStar(require("@skynetlabs/skynet-nodejs")));
            yield Promise.resolve().then(() => __importStar(require("@actions/core")));
            // (1) arrange
            const localPath = node_path_1.default.join(node_os_1.default.tmpdir(), "downloaded.txt");
            const skylink = "sia://AAAFCzW_tyQKKJZL_xHXHWE-XwusklwWBSv9HFFtZhtecA";
            const downloadFile = (0, doubles_1.monitor)(doubles_1.method.returns());
            doubles_1.interceptor.module(skynetModulePath, {
                SkynetClient: doubles_1.constructor.returns((0, doubles_1.simulator)(SkynetClient, { downloadFile }))
            });
            const getInput = (0, doubles_1.monitor)((0, doubles_1.method)([
                { args: ["portal"], returns: portal },
                { args: ["skylink"], returns: skylink },
                { args: ["path"], returns: localPath }
            ]));
            doubles_1.interceptor.module(actionsCoreModulePath, { getInput });
            // (2) act
            const { run } = yield Promise.resolve().then(() => __importStar(require("./index")));
            yield run();
            // (3) assessment
            let log = doubles_1.monitor.log(getInput, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(3);
            log = doubles_1.monitor.log(downloadFile, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(1);
            (0, expected_1.default)(log.call.args).equalTo([localPath, skylink]);
        }));
        test("when skylink doesn't exist, error must be returned", () => __awaiter(void 0, void 0, void 0, function* () {
            const { SkynetClient } = yield Promise.resolve().then(() => __importStar(require("@skynetlabs/skynet-nodejs")));
            yield Promise.resolve().then(() => __importStar(require("@actions/core")));
            // (1) arrange
            const downloadFile = (0, doubles_1.monitor)(doubles_1.method.raises(new Error("Request failed with status code 404")));
            const skynet = (0, doubles_1.simulator)(SkynetClient, { downloadFile });
            doubles_1.interceptor.module(skynetModulePath, {
                SkynetClient: doubles_1.constructor.returns(skynet)
            });
            const localPath = node_path_1.default.join(node_os_1.default.tmpdir(), "unknown.txt");
            const skylink = "sia://unknown.txt";
            const getInput = (0, doubles_1.monitor)((0, doubles_1.method)([
                { args: ["portal"], returns: portal },
                { args: ["skylink"], returns: skylink },
                { args: ["path"], returns: localPath }
            ]));
            const setFailed = (0, doubles_1.monitor)((0, doubles_1.method)());
            doubles_1.interceptor.module(actionsCoreModulePath, { getInput, setFailed });
            // (2) act
            const { run } = yield Promise.resolve().then(() => __importStar(require("./index")));
            yield run();
            // (3) assessment
            let log = doubles_1.monitor.log(getInput, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(3);
            log = doubles_1.monitor.log(downloadFile, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(1);
            (0, expected_1.default)(log.call.args).equalTo([localPath, skylink]);
            log = doubles_1.monitor.log(setFailed, { clear: true });
            (0, expected_1.default)(log.calls).equalTo(1);
            (0, expected_1.default)(log.call.args).it(0).like("status code 404");
        }));
    });
});
//# sourceMappingURL=index.test.js.map