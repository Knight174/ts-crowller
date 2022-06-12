import { Analyzer } from "./crowller";

// 爬取 html
export default class HTMLAnalyzer implements Analyzer {
  public analyze(html: string, filePath: string) {
    return html;
  }
}
