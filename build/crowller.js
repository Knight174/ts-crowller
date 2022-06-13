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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ts -> *.d.ts(transform) -> js
// https://www.npmjs.com/package/superagent
const superagent_1 = __importDefault(require("superagent"));
// core module
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// 引入分析器
const contentAnalyzer_1 = __importDefault(require("./contentAnalyzer"));
class Crowller {
    constructor(url, analyzer) {
        this.url = url;
        this.analyzer = analyzer;
        this.filePath = path_1.default.resolve(__dirname /* 当前文件路径 */, "../data/course.json");
        this.initSpiderProcess();
    }
    // 获取网页内容
    getRawHTML() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield superagent_1.default.get(this.url); // 发送 get 请求
            return result.text;
        });
    }
    // 写入文件
    writeFile(content) {
        fs_1.default.writeFileSync(this.filePath, content);
    }
    // 主函数
    initSpiderProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.getRawHTML();
            const fileContent = this.analyzer.analyze(html, this.filePath); // 通过分析器拿到文件内容
            this.writeFile(fileContent);
        });
    }
}
const secret = "x3b174jsx";
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
const analyzer = contentAnalyzer_1.default.getInstance();
// const analyzer2 = new HTMLAnalyzer();
new Crowller(url, analyzer);
console.log(121);
