import { Analyzer } from "./crowller";
import fs from "fs";
import cheerio from "cheerio";

// 定义 Course 接口
interface Course {
  title: string; // 课程标题
  count: number; // 学习人数
}

interface CourseResult {
  time: number; // 时间戳
  data: Course[];
}

interface Content {
  [time: number]: Course[];
}

// 类使用 implements 来使用接口 class MyClassName implements MyInterfaceName {}
export default class ContentAnalyzer implements Analyzer {
  // static: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/static
  // 不能在类的实例上调用静态方法，而应该通过类本身调用。
  private static instance: ContentAnalyzer;
  static getInstance() {
    if (!ContentAnalyzer.instance) {
      ContentAnalyzer.instance = new ContentAnalyzer();
    }
    return ContentAnalyzer.instance;
  }

  // 获取课程信息
  private getCourseInfo(html: string) {
    const $ = cheerio.load(html); // 获取源网页整体内容
    const courseItems = $(".course-item"); // 拿到选择器为 .course-item 的 dom 内容
    const courseInfos: Course[] = [];
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
  private generateJSONContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {}; // 默认值
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8")); // 数据读取与赋值
    }
    fileContent[courseInfo.time] = courseInfo.data; // 数据更新
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJSONContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}

// 单例模式
// 不可以让外部实例化，即 constructor 不能调用
