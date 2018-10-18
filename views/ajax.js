export function ajax(method, url, param, header = 'application/json') {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr, xhr.responseText);
    }
  }
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-type", header);
  xhr.send(JSON.stringify(param));
}
