"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const cheerio_1 = __importDefault(require("cheerio"));
// 类使用 implements 来使用接口 class MyClassName implements MyInterfaceName {}
class ContentAnalyzer {
    constructor() { }
    static getInstance() {
        if (!ContentAnalyzer.instance) {
            ContentAnalyzer.instance = new ContentAnalyzer();
        }
        return ContentAnalyzer.instance;
    }
    // 获取课程信息
    getCourseInfo(html) {
        const $ = cheerio_1.default.load(html); // 获取源网页整体内容
        const courseItems = $(".course-item"); // 拿到选择器为 .course-item 的 dom 内容
        const courseInfos = [];
        courseItems.map((_, el) => {
            const descs = $(el).find(".course-desc");
            const title = descs.eq(0).text(); // 爬取标题
            const count = parseInt(descs.eq(1).text().split("：")[1]); // 爬取人数
            courseInfos.push({ title, count });
        });
        return {
            time: new Date().getTime(),
            data: courseInfos,
        };
    }
    // 分析并生成 json 对象
    generateJSONContent(courseInfo, filePath) {
        let fileContent = {}; // 默认值
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8")); // 数据读取与赋值
        }
        fileContent[courseInfo.time] = courseInfo.data; // 数据更新
        return fileContent;
    }
    analyze(html, filePath) {
        const courseInfo = this.getCourseInfo(html);
        const fileContent = this.generateJSONContent(courseInfo, filePath);
        return JSON.stringify(fileContent);
    }
}
exports.default = ContentAnalyzer;
// 单例模式
// 不可以让外部实例化，即 constructor 不能调用
