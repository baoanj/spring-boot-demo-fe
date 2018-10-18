import { escapeHTML } from '../../../utils.js'

export default class TxtJS {
  constructor() {
    this.afterRenderContent = '';
  }
  parse(file, successCallBack, errorCallBack) {
    const reader = new FileReader();
    // GB 2312 或 GB 2312–80 是中华人民共和国国家标准简体中文字符集
    // 读取txt文件需要 gb2312 中文才不乱码
    reader.readAsText(file, 'gb2312');
    // 读取代码文件需要 utf-8 中文才不乱码
    // reader.readAsText(file, 'utf-8');
    reader.onload = loadEvent => {
      this.afterRenderContent = loadEvent.target.result;
      successCallBack();
    };
    reader.onerror = () => {
      errorCallBack({});
    };
  }
  destroy(callback) {
    callback();
  }
  afterRender(wrapper, callback) {
    wrapper.innerHTML = `<div style="overflow: auto; height: 100%; padding: 30px 20px 16px 20px;"
      ><pre><code>${escapeHTML(this.afterRenderContent)}</pre></div><p style="position: absolute; bottom: 0;
      background-color: #2d3740; color: #fff; margin: 0; padding: 0; width: 100%;"
      ><span style="margin-left: 5px">${wrapper.filename}</span></p>`;
    callback({});
  }
}
