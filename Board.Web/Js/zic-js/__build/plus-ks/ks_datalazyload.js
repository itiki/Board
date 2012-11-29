define(function(){return function(k){k.add("datalazyload",function(c,m){function f(a,b){if(!(this instanceof f))return new f(a,b);b===m&&(b=a,a=[n]);c.isArray(a)||(a=[c.get(a)||n]);this.containers=a;this.config=c.merge(k,b);this.callbacks={els:[],fns:[]};this._init()}var d=c.DOM,g=c.Event,i=window,n=document,o="scroll",p="resize",k={mod:"manual",diff:"default",placeholder:"none",execScript:!0};c.augment(f,{_init:function(){this.threshold=this._getThreshold();this._filterItems();this._initLoadEvent()},
_filterItems:function(){var a=this.containers,b,j,e,d=[],h=[];for(b=0,j=a.length;b<j;++b)e=c.query("img",a[b]),d=d.concat(c.filter(e,this._filterImg,this)),e=c.query("textarea",a[b]),h=h.concat(c.filter(e,this._filterArea,this));this.images=d;this.areaes=h},_filterImg:function(a){var b=a.getAttribute("data-ks-lazyload"),c=this.threshold,e=this.config.placeholder;if("manual"===this.config.mod){if(b)return"none"!==e&&(a.src=e),!0}else if(d.offset(a).top>c&&!b)return d.attr(a,"data-ks-lazyload",a.src),
"none"!==e?a.src=e:a.removeAttribute("src"),!0},_filterArea:function(a){return d.hasClass(a,"ks-datalazyload")},_initLoadEvent:function(){function a(){j||(j=c.later(function(){b();j=null},100))}function b(){e._loadItems();0===e._getItemsLength()&&(g.remove(i,o,a),g.remove(i,p,d))}var j,e=this,d;g.on(i,o,a);g.on(i,p,d=function(){e.threshold=e._getThreshold();a()});e._getItemsLength()&&c.ready(function(){b()})},_loadItems:function(){this._loadImgs();this._loadAreas();this._fireCallbacks()},_loadImgs:function(){this.images=
c.filter(this.images,this._loadImg,this)},_loadImg:function(a){var b=this.threshold+d.scrollTop();if(d.offset(a).top<=b)this._loadImgSrc(a);else return!0},_loadImgSrc:function(a,b){var b=b||"data-ks-lazyload",c=a.getAttribute(b);c&&a.src!=c&&(a.src=c,a.removeAttribute(b))},_loadAreas:function(){this.areaes=c.filter(this.areaes,this._loadArea,this)},_loadArea:function(a){var b="none"===d.css(a,"display");if(d.offset(b?a.parentNode:a).top<=this.threshold+d.scrollTop())this._loadAreaData(a.parentNode,
a,this.config.execScript);else return!0},_loadAreaData:function(a,b,c){b.style.display="none";b.className="";var e=d.create("<div>");a.insertBefore(e,b);d.html(e,b.value,c===m?!0:c)},_fireCallbacks:function(){var a=this.callbacks,b=a.els,c=a.fns,e=this.threshold+d.scrollTop(),f,h,l,g=[],i=[];for(f=0;(h=b[f])&&(l=c[f++]);)d.offset(h).top<=e?l.call(h):(g.push(h),i.push(l));a.els=g;a.fns=i},addCallback:function(a,b){var d=this.callbacks;if((a=c.get(a))&&c.isFunction(b))d.els.push(a),d.fns.push(b)},_getThreshold:function(){var a=
this.config.diff,b=d.viewportHeight();return"default"===a?2*b:b+ +a},_getItemsLength:function(){return this.images.length+this.areaes.length+this.callbacks.els.length},loadCustomLazyData:function(a,b){var f=this,e,g;c.isArray(a)||(a=[c.get(a)]);c.each(a,function(a){switch(b){case "img-src":g="IMG"===a.nodeName?[a]:c.query("img",a);c.each(g,function(a){f._loadImgSrc(a,"data-ks-lazyload-custom")});break;default:(e=c.get("textarea",a))&&d.hasClass(e,"ks-datalazyload-custom")&&f._loadAreaData(a,e)}})}});
c.mix(f,f.prototype,!0,["loadCustomLazyData","_loadImgSrc","_loadAreaData"]);c.DataLazyload=f},{requires:["core"]})}});