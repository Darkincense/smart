function setRemResponse() {
    var vM = 750;
    var vfontSize = 16;
    var html = document.documentElement;
    var newfontSize = vfontSize * html.clientWidth / vM;
    html.style.fontSize = newfontSize + 'px';
};
document.addEventListener('DOMContentLoaded', setRemResponse, false);
window.onresize = function () {
    setRemResponse();
}