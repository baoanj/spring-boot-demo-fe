export default class ImgJS {
  constructor() {
    this.afterRenderContent = '';
  }
  parse(file, successCallBack, errorCallBack) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
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
      ><img src="${this.afterRenderContent}"></div><p style="position: absolute; bottom: 0;
      background-color: #2d3740; color: #fff; margin: 0; padding: 0; width: 100%;"
      ><span style="margin-left: 5px">${wrapper.filename}</span></p>`;
    callback({});
  }
}
