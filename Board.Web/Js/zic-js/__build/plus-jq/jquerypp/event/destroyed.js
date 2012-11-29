define(["jquery"],function(a){(function(b){var e=a.cleanData;b.cleanData=function(a){for(var c=0,d;void 0!==(d=a[c]);c++)b(d).triggerHandler("destroyed");e(a)}})(a)});
