define(["jquery","jquerypp/syles"],function(b){(function(){var s=0,t=function(){for(var a=document.styleSheets,c=a.length-1,b=null;0<=c&&!b;){if(a[c].cssRules||a[c].rules)b=a[c];c-=1}b||(c=document.createElement("style"),document.getElementsByTagName("head")[0].appendChild(c),window.createPopup||c.appendChild(document.createTextNode("")),b=a[a.length-1]);return b},m=function(a,c){var g=!(this[0]&&this[0].nodeType),l=!g&&"inline"===b(this).css("display")&&"none"===b(this).css("float"),e;for(e in a)if("show"==
a[e]||"hide"==a[e]||b.isArray(a[e])||0>a[e]||"zIndex"==e||"z-index"==e||"-moz-"==f.prefix&&(this.length&&this[0].ownerDocument&&"auto"==this.css(e)||"font-size"==e||"fontSize"==e))return!0;return!0===a.jquery||null===f||b.isEmptyObject(a)||b.isPlainObject(c)||"string"==typeof c||l||g},f=function(){var a,b=document.createElement("fakeelement"),g={transition:{transitionEnd:"transitionEnd",prefix:""},MozTransition:{transitionEnd:"animationend",prefix:"-moz-"},WebkitTransition:{transitionEnd:"webkitAnimationEnd",
prefix:"-webkit-"}};for(a in g)if(void 0!==b.style[a])return g[a];return null}(),n=function(a){var c={};b.each(a,function(a,b){c[f.prefix+a]=b});return c},u=b.fn.animate;b.fn.animate=function(a,c,g){if(m.apply(this,arguments))return u.apply(this,arguments);b.isFunction(c)&&(g=c);this.queue("fx",function(l){var e,i=[],o="",q,d=b(this),m=b.fx.speeds[c]||c||b.fx.speeds._default,j="animate"+s++,r=j+".run",h="@"+f.prefix+"keyframes "+j+" { from {",k=function(a,c){d.css(a);d.css(n({"animation-duration":"",
"animation-name":"","animation-fill-mode":""}));for(var e=p,f=e.cssRules.length-1;0<=f;f--){var h=e.cssRules[f];if(7===h.type&&h.name==j){e.deleteRule(f);break}}g&&c&&g.call(d[0],!0);b.removeData(d,r,!0)};for(q in a)i.push(q);e=d.styles.apply(d,i);b.each(i,function(c,d){h+=d+" : "+("number"===typeof e[d]&&!b.cssNumber[d]?e[d]+"px":e[d])+"; ";o+=d+" : "+("number"===typeof a[d]&&!b.cssNumber[d]?a[d]+"px":a[d])+"; "});var h=h+("} to {"+o+" }}"),p=t();p.insertRule(h,p.cssRules.length);b._data(this,r,
{stop:function(b){d.css(n({"animation-play-state":"paused"}));d.off(f.transitionEnd,k);b?k(a,!0):k(d.styles.apply(d,i),!1)}});d.css(n({"animation-duration":m+"ms","animation-name":j,"animation-fill-mode":"forwards"}));d.one(f.transitionEnd,function(){k(a,!0);l()})});return this}})(b)});