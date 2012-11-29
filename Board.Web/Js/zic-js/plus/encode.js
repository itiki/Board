define(function (require, exports) {
    exports.encodeHtml = function (html) {
        //The faster soluction: http://jsperf.com/htmlencoderegex
        return html.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    //escape()/escapeURIComponent() and unescape() are intended to encode/decode strings for URLs, not HTML.

    //decodeHtml is not necessary, it's backstage job.

});