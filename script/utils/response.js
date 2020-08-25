(function (doc, win) {

    function modifileRootRem () {
        var root = window.document.documentElement;
        var fontSize = parseFloat(root.style.fontSize);
        var finalFontSize = parseFloat(window.getComputedStyle(root).getPropertyValue("font-size"));
        if(finalFontSize === fontSize) return;
        root.style.fontSize = fontSize*(fontSize / finalFontSize) + "px";
    }

    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            modifileRootRem();
        };
 
    // Abort if browser does not support addEventListener
    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);