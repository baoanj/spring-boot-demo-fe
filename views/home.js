import { SimpleFormData, $e, $v, base64ToArrayBuffer, messageBox } from './utils.js';
import { previewPDF, previewDocx } from './preview.js';
import { previewDocument } from './jsviewer-loader.js';

window.onload = () => {
  let fileList = [];

  $e('#login').onclick = () => {
    const username = $v('#username');
    const password = $v('#password');

    axios.post('/api/contact/login', {username, password}).then(({data}) => {
      messageBox(data.msg);
    }).catch(error => {
      console.log(error);
      messageBox(error.response && error.response.data && error.response.data.message);
    });
  };

  $e('#regist').onclick = () => {
    const who = $v('input[name="who"]');
    const how = $v('input[name="how"]');
    const role = $v('input[name="role"]:checked');

    axios.post('/api/contact/regist', {
      username: who,
      password: how,
      role
    }).then(({ data }) => {
      messageBox(data.msg);
    }).catch(error => {
      console.log(error);
      messageBox(error.response && error.response.data && error.response.data.message);
    });
  };

  $e('#submit').onclick = () => {
    const fullName = $v('#fullName');
    const phoneNumber = $v('#phoneNumber');
    const province = $v('#province');
    const city = $v('#city');
    const detail = $v('#detail');
    const noticeUsers = $v('#noticeUsers').split(' ').filter(item => item !== '');

    const formData = new SimpleFormData({
      upload_files: fileList,
      full_name: fullName,
      phone_number: phoneNumber,
      address: {
        province,
        city,
        detail
      },
      notice_users: noticeUsers
    });

    axios.post('/api/contact/createWithFile', formData).then(({ data }) => {
      messageBox(data.msg);
      getContactList();
      getDownloadFiles();
    }).catch(error => {
      console.log(error);
      messageBox(error.response && error.response.data && error.response.data.message);
    });
  };

  $e('#upload').onclick = event => {
    event.preventDefault();
    $e('#attachment').click();
  };

  $e('#attachment').onchange = event => {
    fileList = fileList.concat(Array.from(event.target.files));
    let ulInnerHTML = ''
    for (let i = 0; i < fileList.length; i += 1) {
      ulInnerHTML += `<li><span>${fileList[i].name}-${fileList[i].size
        }字节</span><button order=${i}>预览</button></li>`
    }
    $e('#fileList').innerHTML = ulInnerHTML;
  };

  $e('#fileList').onclick = event => {
    event.preventDefault();
    if (event.target.nodeName.toUpperCase() === 'BUTTON') {
      const file = fileList[event.target.getAttribute('order')];
      // previewFile(file);
      previewDocument(file);
      console.log(file);
    }
  }

  $e('#refresh').onclick = () => {
    getContactList();
    getDownloadFiles();
  };

  $e('#preview-close').onclick = () => {
    $e('#preview-container').style.display = 'none';
  };

  $e('#filesDownload').onclick = event => {
    if (event.target.nodeName.toUpperCase() === 'BUTTON') {
      const filename = event.target.getAttribute('filename');
      axios.get(`/api/contact/preview/${filename}`).then(({ data: { file } }) => {
        // previewFile(new File([base64ToArrayBuffer(file)], filename));
        previewDocument(new File([base64ToArrayBuffer(file)], filename));
      }).catch(error => {
        console.log(error);
        messageBox(error.response && error.response.data && error.response.data.message);
      });
    }
  }

  function previewFile(file) {
    $e('#preview-container').style.display = 'block';
    $e('#preview').innerHTML = '加载中...';
    if (/\.pdf$/.test(file.name)) {
      previewPDF(file, $e('#preview'));
    } else if (/\.docx$/.test(file.name)) {
      previewDocx(file, $e('#preview'));
    } else {
      $e('#preview').innerHTML = '暂不支持该文件类型的预览';
    }
  }

  function getContactList() {
    axios.get('/api/contact/list').then(({ data: { list } }) => {
      let tbodyHTML = '';
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        tbodyHTML += `<tr><td>${item.id}</td><td>${item.fullName}</td><td>${item.phoneNumber}</td>
            <td>${item.address.province} ${item.address.city} ${item.address.detail}</td></tr>`;
      }
      $e('#list').innerHTML = tbodyHTML;
    }).catch(error => {
      console.log(error);
      messageBox(error.response && error.response.data && error.response.data.message);
    });
  }

  function getDownloadFiles() {
    axios.get('/api/contact/listFiles').then(({ data: { files } }) => {
      let ulChildrenHTML = '';
      for (let file of files) {
        ulChildrenHTML += `<li><a href="/api/contact/download/${file.name}">${
          file.name}-${file.size}字节</a><button filename="${file.name}">预览</button></li>`
      }
      $e('#filesDownload').innerHTML = ulChildrenHTML;
    });
  }
};
