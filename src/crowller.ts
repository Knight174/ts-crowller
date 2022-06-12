// ts -> *.d.ts(transform) -> js
// https://www.npmjs.com/package/superagent
import superagent from "superagent";
// https://cheerio.js.org/
import cheerio from "cheerio";

// 定义 Course 接口
interface Course {
  title: string; // 课程标题
  count: number; // 学习人数
}

class Crowller {
  private secret = "x3b174jsx";
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;

  constructor() {
    this.initSpiderProcess();
  }

  async getRawHTML() {
    const result = await superagent.get(this.url); // 发送 get 请求
    return result.text;
  }

  async initSpiderProcess() {
    const html = await this.getRawHTML();
    const courseResult = this.getCourseInfo(html);
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
}

const crowller = new Crowller();
