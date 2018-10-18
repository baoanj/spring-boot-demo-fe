import { $e } from './utils.js';

export function previewDocx(file, container) {
  // https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = loadEvent => {
    const arrayBuffer = loadEvent.target.result;
    // https://www.npmjs.com/package/mammoth
    mammoth.convertToHtml({ arrayBuffer }).then(result => {
      container.innerHTML = result.value;
    }).done();
  };

  reader.onerror = e => {
    container.innerHTML = '加载失败';
  }
}

export function previewPDF(file, container) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = loadEvent => {
    container.innerHTML = `
      <div>
        <div>
          <button id="pdf-prev">上一页</button>
          <button id="pdf-next">下一页</button>
          <span id="pdf-page">1</span>/<span id="pdf-count">-</span>
          <button id="pdf-enlarge">放大</button>
          <button id="pdf-narrow">缩小</button>
        </div>
        <canvas id="pdf-canvas" style="border:1px solid #ccc"></canvas>
      </div>
    `;

    const arrayBuffer = loadEvent.target.result;
    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    let scale = 1;
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    function renderPage(num) {
      pageRendering = true;
      // Using promise to fetch the page
      pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport(scale);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        const renderTask = page.render(renderContext);
        // Wait for rendering to finish
        renderTask.promise.then(() => {
          pageRendering = false;
          if (pageNumPending !== null) {
            // New page rendering is pending
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });
      // Update page counters
      $e('#pdf-page').textContent = num;
    }

    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    };

    $e('#pdf-prev').onclick = () => {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    };

    $e('#pdf-next').onclick = () => {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    };

    $e('#pdf-enlarge').onclick = () => {
      scale += 0.1;
      queueRenderPage(pageNum);
    };

    $e('#pdf-narrow').onclick = () => {
      scale -= 0.1;
      queueRenderPage(pageNum);
    };
    // https://mozilla.github.io/pdf.js/
    pdfjsLib.getDocument(arrayBuffer).then(pdf => {
      pdfDoc = pdf;
      $e('#pdf-count').textContent = pdfDoc.numPages;
      renderPage(pageNum);
    });
  };

  reader.onerror = e => {
    container.innerHTML = '加载失败';
  };
}
