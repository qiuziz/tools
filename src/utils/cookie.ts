function setCookie(cname: any, cvalue: any, exdays: any) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
}
function getCookie(cname: any) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function checkCookie(cname: any, cookie: any, exdays: number) {
  let user = getCookie(cname);
  if (user != '') {
    setCookie('token', '', exdays);
  } else {
    setCookie('token', cookie, exdays);
  }
}
export { setCookie, getCookie, checkCookie };
