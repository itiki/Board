define(function(){return function(a){if(a.browser.msie)switch(a.browser.version){case "6.0":window.bow="ie6";break;case "7.0":window.bow="ie7";break;case "8.0":window.bow="ie8";break;default:window.bow="ie9"}else a.browser.mozilla?window.bow="mozilla":a.browser.webkit?window.bow="webkit":a.browser.opera&&(window.bow="opera")}});