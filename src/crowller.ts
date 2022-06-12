// ts -> *.d.ts(transform) -> js
// https://www.npmjs.com/package/superagent
import superagent from "superagent";

class Crowller {
  private secret = "x3b174jsx";
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  private rawHTML = "";

  constructor() {
    this.getRawHTML();
  }

  async getRawHTML() {
    const result = await superagent.get(this.url); // 发送 get 请求
    this.rawHTML = result.text; // 拿到 html 内容
  }
}

const crowller = new Crowller();
