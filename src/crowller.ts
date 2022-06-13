// ts -> *.d.ts(transform) -> js
// https://www.npmjs.com/package/superagent
import superagent from "superagent";

// core module
import path from "path";
import fs from "fs";

// 引入分析器
import ContentAnalyzer from "./contentAnalyzer";
import HTMLAnalyzer from "./htmlAnalyzer";

// 分析器实例接口
export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname /* 当前文件路径 */, "../data/course.json");

  // 获取网页内容
  async getRawHTML() {
    const result = await superagent.get(this.url); // 发送 get 请求
    return result.text;
  }

  // 写入文件
  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  // 主函数
  async initSpiderProcess() {
    const html = await this.getRawHTML();
    const fileContent = this.analyzer.analyze(html, this.filePath); // 通过分析器拿到文件内容
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}

const secret = "x3b174jsx";
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const analyzer = ContentAnalyzer.getInstance();
// const analyzer2 = new HTMLAnalyzer();
new Crowller(url, analyzer);
