import { $e } from './utils.js';
import TxtJS from './jsviewer/scripts/txtjs/TxtJS.js';
import ImgJS from './jsviewer/scripts/imgjs/ImgJS.js';

const $preview = $e('#preview-document');
let $loading = $e("#parser-loading");
let $modal = $e("#modal");
let $modalCloseBtn = $e("#modal-close-btn");
let $docxjsWrapper = $e("#docxjs-wrapper");

function getInstanceOfFileType(file) {
  return file.name.split('.').pop();
}

function afterRender(file, fileType, instance) {
  $modal.style.display = 'block';
  $docxjsWrapper.style.height = 'calc(100% - 65px)';

  const loadingNode = document.createElement("div");
  loadingNode.setAttribute('class', 'docx-loading');
  $docxjsWrapper.parentNode.insertBefore(loadingNode, $docxjsWrapper);

  function endCallBackFn(result) {
    if (result.isError) {
      $docxjsWrapper.innerHTML = '解析出错';
    } else {
      console.log("Success Render");
    }

    loadingNode.parentNode.removeChild(loadingNode);
  };

  if (fileType === 'docx') {
    window.docxAfterRender($docxjsWrapper, endCallBackFn);
  } else if (fileType === 'xlsx') {
    window.cellAfterRender($docxjsWrapper, endCallBackFn);
  } else if (fileType === 'pptx') {
    window.slideAfterRender($docxjsWrapper, endCallBackFn, 0);
  } else if (fileType === 'pdf') {
    window.pdfAfterRender($docxjsWrapper, endCallBackFn, 0);
  } else {
    instance.afterRender($docxjsWrapper, endCallBackFn);
  }
}

export function previewDocument(file) {
  $preview.innerHTML = `
    <div id="modal">
      <div id="modal-container">
        <a id="modal-close-btn"></a>
        <div id="docxjs-wrapper" style="width:100%;height:100%;"></div>
      </div>
    </div>
    <div id="parser-loading"></div>
  `;

  $loading = $e("#parser-loading");
  $modal = $e("#modal");
  $modalCloseBtn = $e("#modal-close-btn");
  $docxjsWrapper = $e("#docxjs-wrapper");

  let instance = null;
  const fileType = getInstanceOfFileType(file);

  if (fileType) {
    if (fileType == 'docx') {
      instance = window.docxJS = window.createDocxJS ? window.createDocxJS() : new window.DocxJS();
    } else if (fileType == 'xlsx') {
      instance = window.cellJS = window.createCellJS ? window.createCellJS() : new window.CellJS();
    } else if (fileType == 'pptx') {
      instance = window.slideJS = window.createSlideJS ? window.createSlideJS() : new window.SlideJS();
    } else if (fileType == 'pdf') {
      instance = window.pdfJS = window.createPdfJS ? window.createPdfJS() : new window.PdfJS();
    } else if (/^image\/[a-z]+$/.test(file.type)) {
      instance = new ImgJS();
    } else {
      instance = new TxtJS();
    }

    if (instance) {
      $loading.style.display = 'block';

      instance.parse(file, () => {
        $docxjsWrapper.filename = file.name;
        afterRender(file, fileType, instance);
        $loading.style.display = 'none';
      }, (e) => {
        $modal.style.display = 'block';
        $docxjsWrapper.innerHTML = '无法解析';
        if (e.isError && e.msg) {
          console.log(e.msg);
        }
        $loading.style.display = 'none';
      }, null);
    }
  }

  $modalCloseBtn.onclick = () => {
    $docxjsWrapper.innerHTML = '';
    $modal.style.display = 'none';

    instance.destroy(() => {
      instance = null;
    });
  };
};
