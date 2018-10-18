export function SimpleFormData(data) {
  const formData = new FormData();
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const val = data[key];
    if (val !== undefined) {
      if (isArray(val) && isFile(val[0])) {
        for (let j = 0; j < val.length; j += 1) {
          formData.append(key, val[j]);
        }
      } else if (isArray(val) || isObject(val)) {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, val);
      }
    }
  }
  return formData;
}

export function isArray(v) {
  return ({}).toString.apply(v) === '[object Array]';
}

export function isObject(v) {
  return ({}).toString.apply(v) === '[object Object]';
}

export function isFile(v) {
  return ({}).toString.apply(v) === '[object File]';
}

export function $e(selector) {
  return document.querySelector(selector);
}

export function $es(selector) {
  return document.querySelectorAll(selector);
}

export function $v(selector) {
  return document.querySelector(selector).value;
}

export function escapeHTML(value) {
  return value.replace(/&/g, '&amp;')
              .replace(/'/g, '&#39;')
              .replace(/"/g, '&quot;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
}

// Method 1
// export function base64ToArrayBuffer(base64) {
//   const binaryString = window.atob(base64);
//   const binaryLen = binaryString.length;
//   const bytes = new Uint8Array(binaryLen);
//   for (let i = 0; i < binaryLen; i++) {
//      const ascii = binaryString.charCodeAt(i);
//      bytes[i] = ascii;
//   }
//   return bytes;
// }

// Method 2
export function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const binaryLen = binaryString.length;
  const buf = new ArrayBuffer(binaryLen);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < binaryLen; i++) {
     const ascii = binaryString.charCodeAt(i);
     bytes[i] = ascii;
  }
  return buf;
}

export function messageBox(msg) {
  $e('#message').style.display = 'block';
  $e('#message').innerHTML = msg;
  setTimeout(() => {
    $e('#message').style.display = 'none';
    $e('#message').innerHTML = '';
  }, 3000);
}
