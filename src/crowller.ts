// ts -> *.d.ts(transform) -> js
// https://www.npmjs.com/package/superagent
import superagent from "superagent";
// https://cheerio.js.org/
import cheerio from "cheerio";
// core module
import path from "path";
import fs from "fs";

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

class Crowller {
  private secret = "x3b174jsx";
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;

  constructor() {
    this.initSpiderProcess();
  }

  async initSpiderProcess() {
    // __dirname: http://nodejs.cn/api/modules.html#__dirname
    // path.resolve: https://www.jianshu.com/p/439ca3b6d386
    const filePath = path.resolve(__dirname /* 当前文件路径 */, "../data/course.json"); // 计算 course.json 的绝对路径

    const html = await this.getRawHTML();
    const CourseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJSONContent(CourseInfo);

    // fs.writeFileSync: http://nodejs.cn/api/fs/fs_writefilesync_file_data_options.html
    fs.writeFileSync(filePath, JSON.stringify(fileContent)); // 数据写入
  }

  async getRawHTML() {
    const result = await superagent.get(this.url); // 发送 get 请求
    return result.text;
  }

  getCourseInfo(html: string) {
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

  // 生成 json 对象
  generateJSONContent(CourseInfo: CourseResult) {
    let fileContent: Content = {}; // 默认值
    const filePath = path.resolve(__dirname /* 当前文件路径 */, "../data/course.json");
    // fs.existsSync: http://nodejs.cn/api/fs.html#fsexistssyncpath
    if (fs.existsSync(filePath)) {
      // fs.readFileSync: http://nodejs.cn/api/fs/fs_readfilesync_path_options.html
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8")); // 数据读取与赋值
      fileContent[CourseInfo.time] = CourseInfo.data; // 数据更新
      return fileContent;
    }
  }
}

const crowller = new Crowller();
