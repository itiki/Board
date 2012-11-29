define(function(){return function(n){(function(e){e.widget("ui.resizable",e.ui.mouse,{version:"@VERSION",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1E3},_create:function(){var b=this,a=this.options;this.element.addClass("ui-resizable");e.extend(this,{_aspectRatio:!!a.aspectRatio,aspectRatio:a.aspectRatio,
originalElement:this.element,_proportionallyResizeElements:[],_helper:a.helper||a.ghost||a.animate?a.helper||"ui-resizable-helper":null});this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("resizable",
this.element.data("resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",
zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize());this.handles=a.handles||(!e(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"});if(this.handles.constructor==String){"all"==this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw");var c=this.handles.split(",");
this.handles={};for(var d=0;d<c.length;d++){var f=e.trim(c[d]),g=e('<div class="ui-resizable-handle ui-resizable-'+f+'"></div>');g.css({zIndex:a.zIndex});"se"==f&&g.addClass("ui-icon ui-icon-gripsmall-diagonal-se");this.handles[f]=".ui-resizable-"+f;this.element.append(g)}}this._renderAxis=function(a){var a=a||this.element,b;for(b in this.handles){this.handles[b].constructor==String&&(this.handles[b]=e(this.handles[b],this.element).show());if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var c=
e(this.handles[b],this.element),d=0,d=/sw|ne|nw|se|n|s/.test(b)?c.outerHeight():c.outerWidth(),c=["padding",/ne|nw|n/.test(b)?"Top":/se|sw|s/.test(b)?"Bottom":/^e$/.test(b)?"Right":"Left"].join("");a.css(c,d);this._proportionallyResize()}e(this.handles[b])}};this._renderAxis(this.element);this._handles=e(".ui-resizable-handle",this.element).disableSelection();this._handles.mouseover(function(){if(!b.resizing){if(this.className)var a=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=
a&&a[1]?a[1]:"se"}});a.autoHide&&(this._handles.hide(),e(this.element).addClass("ui-resizable-autohide").mouseenter(function(){a.disabled||(e(this).removeClass("ui-resizable-autohide"),b._handles.show())}).mouseleave(function(){!a.disabled&&!b.resizing&&(e(this).addClass("ui-resizable-autohide"),b._handles.hide())}));this._mouseInit()},_destroy:function(){this._mouseDestroy();var b=function(a){e(a).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};
if(this.elementIsWrapper){b(this.element);var a=this.element;a.after(this.originalElement.css({position:a.css("position"),width:a.outerWidth(),height:a.outerHeight(),top:a.css("top"),left:a.css("left")})).remove()}this.originalElement.css("resize",this.originalResizeStyle);b(this.originalElement);return this},_mouseCapture:function(b){var a=!1,c;for(c in this.handles)e(this.handles[c])[0]==b.target&&(a=!0);return!this.options.disabled&&a},_mouseStart:function(b){var a=this.options,c=this.element.position(),
d=this.element;this.resizing=!0;this.documentScroll={top:e(document).scrollTop(),left:e(document).scrollLeft()};(d.is(".ui-draggable")||/absolute/.test(d.css("position")))&&d.css({position:"absolute",top:c.top,left:c.left});this._renderProxy();var c=j(this.helper.css("left")),f=j(this.helper.css("top"));a.containment&&(c+=e(a.containment).scrollLeft()||0,f+=e(a.containment).scrollTop()||0);this.offset=this.helper.offset();this.position={left:c,top:f};this.size=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:
{width:d.width(),height:d.height()};this.originalSize=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalPosition={left:c,top:f};this.sizeDiff={width:d.outerWidth()-d.width(),height:d.outerHeight()-d.height()};this.originalMousePosition={left:b.pageX,top:b.pageY};this.aspectRatio="number"==typeof a.aspectRatio?a.aspectRatio:this.originalSize.width/this.originalSize.height||1;a=e(".ui-resizable-"+this.axis).css("cursor");e("body").css("cursor",
"auto"==a?this.axis+"-resize":a);d.addClass("ui-resizable-resizing");this._propagate("start",b);return!0},_mouseDrag:function(b){var a=this.helper,c=this.originalMousePosition,d=this._change[this.axis];if(!d)return!1;c=d.apply(this,[b,b.pageX-c.left||0,b.pageY-c.top||0]);this._updateVirtualBoundaries(b.shiftKey);if(this._aspectRatio||b.shiftKey)c=this._updateRatio(c,b);c=this._respectSize(c,b);this._propagate("resize",b);a.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+
"px",height:this.size.height+"px"});!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize();this._updateCache(c);this._trigger("resize",b,this.ui());return!1},_mouseStop:function(b){this.resizing=!1;var a=this.options;if(this._helper){var c=this._proportionallyResizeElements,d=c.length&&/textarea/i.test(c[0].nodeName),c=d&&e.ui.hasScroll(c[0],"left")?0:this.sizeDiff.height,d=d?0:this.sizeDiff.width,d={width:this.helper.width()-d,height:this.helper.height()-c},c=parseInt(this.element.css("left"),
10)+(this.position.left-this.originalPosition.left)||null,f=parseInt(this.element.css("top"),10)+(this.position.top-this.originalPosition.top)||null;a.animate||this.element.css(e.extend(d,{top:f,left:c}));this.helper.height(this.size.height);this.helper.width(this.size.width);this._helper&&!a.animate&&this._proportionallyResize()}e("body").css("cursor","auto");this.element.removeClass("ui-resizable-resizing");this._propagate("stop",b);this._helper&&this.helper.remove();return!1},_updateVirtualBoundaries:function(b){var a=
this.options,c,d,e,a={minWidth:i(a.minWidth)?a.minWidth:0,maxWidth:i(a.maxWidth)?a.maxWidth:Infinity,minHeight:i(a.minHeight)?a.minHeight:0,maxHeight:i(a.maxHeight)?a.maxHeight:Infinity};if(this._aspectRatio||b)b=a.minHeight*this.aspectRatio,d=a.minWidth/this.aspectRatio,c=a.maxHeight*this.aspectRatio,e=a.maxWidth/this.aspectRatio,b>a.minWidth&&(a.minWidth=b),d>a.minHeight&&(a.minHeight=d),c<a.maxWidth&&(a.maxWidth=c),e<a.maxHeight&&(a.maxHeight=e);this._vBoundaries=a},_updateCache:function(b){this.offset=
this.helper.offset();i(b.left)&&(this.position.left=b.left);i(b.top)&&(this.position.top=b.top);i(b.height)&&(this.size.height=b.height);i(b.width)&&(this.size.width=b.width)},_updateRatio:function(b){var a=this.position,c=this.size,d=this.axis;i(b.height)?b.width=b.height*this.aspectRatio:i(b.width)&&(b.height=b.width/this.aspectRatio);"sw"==d&&(b.left=a.left+(c.width-b.width),b.top=null);"nw"==d&&(b.top=a.top+(c.height-b.height),b.left=a.left+(c.width-b.width));return b},_respectSize:function(b){var a=
this._vBoundaries,c=this.axis,d=i(b.width)&&a.maxWidth&&a.maxWidth<b.width,e=i(b.height)&&a.maxHeight&&a.maxHeight<b.height,g=i(b.width)&&a.minWidth&&a.minWidth>b.width,h=i(b.height)&&a.minHeight&&a.minHeight>b.height;g&&(b.width=a.minWidth);h&&(b.height=a.minHeight);d&&(b.width=a.maxWidth);e&&(b.height=a.maxHeight);var k=this.originalPosition.left+this.originalSize.width,l=this.position.top+this.size.height,m=/sw|nw|w/.test(c),c=/nw|ne|n/.test(c);g&&m&&(b.left=k-a.minWidth);d&&m&&(b.left=k-a.maxWidth);
h&&c&&(b.top=l-a.minHeight);e&&c&&(b.top=l-a.maxHeight);(a=!b.width&&!b.height)&&!b.left&&b.top?b.top=null:a&&!b.top&&b.left&&(b.left=null);return b},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var b=this.helper||this.element,a=0;a<this._proportionallyResizeElements.length;a++){var c=this._proportionallyResizeElements[a];if(!this.borderDif){var d=[c.css("borderTopWidth"),c.css("borderRightWidth"),c.css("borderBottomWidth"),c.css("borderLeftWidth")],f=[c.css("paddingTop"),
c.css("paddingRight"),c.css("paddingBottom"),c.css("paddingLeft")];this.borderDif=e.map(d,function(a,b){var c=parseInt(a,10)||0,d=parseInt(f[b],10)||0;return c+d})}c.css({height:b.height()-this.borderDif[0]-this.borderDif[2]||0,width:b.width()-this.borderDif[1]-this.borderDif[3]||0})}},_renderProxy:function(){var b=this.options;this.elementOffset=this.element.offset();if(this._helper){this.helper=this.helper||e('<div style="overflow:hidden;"></div>');var a=e.browser.msie&&7>e.browser.version,c=a?
1:0,a=a?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+a,height:this.element.outerHeight()+a,position:"absolute",left:this.elementOffset.left-c+"px",top:this.elementOffset.top-c+"px",zIndex:++b.zIndex});this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(b,a){return{width:this.originalSize.width+a}},w:function(b,a){return{left:this.originalPosition.left+a,width:this.originalSize.width-a}},n:function(b,a,c){return{top:this.originalPosition.top+
c,height:this.originalSize.height-c}},s:function(b,a,c){return{height:this.originalSize.height+c}},se:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,a,c]))},sw:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,a,c]))},ne:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[b,a,c]))},nw:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,
[b,a,c]))}},_propagate:function(b,a){e.ui.plugin.call(this,b,[a,this.ui()]);"resize"!=b&&this._trigger(b,a,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}});e.ui.plugin.add("resizable","alsoResize",{start:function(){var b=e(this).data("resizable").options,a=function(a){e(a).each(function(){var a=e(this);a.data("resizable-alsoresize",
{width:parseInt(a.width(),10),height:parseInt(a.height(),10),left:parseInt(a.css("left"),10),top:parseInt(a.css("top"),10)})})};"object"==typeof b.alsoResize&&!b.alsoResize.parentNode?b.alsoResize.length?(b.alsoResize=b.alsoResize[0],a(b.alsoResize)):e.each(b.alsoResize,function(b){a(b)}):a(b.alsoResize)},resize:function(b,a){var c=e(this).data("resizable"),d=c.options,f=c.originalSize,g=c.originalPosition,h={height:c.size.height-f.height||0,width:c.size.width-f.width||0,top:c.position.top-g.top||
0,left:c.position.left-g.left||0},i=function(b,c){e(b).each(function(){var b=e(this),d=e(this).data("resizable-alsoresize"),f={},g=c&&c.length?c:b.parents(a.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(g,function(a,b){var c=(d[b]||0)+(h[b]||0);c&&0<=c&&(f[b]=c||null)});b.css(f)})};"object"==typeof d.alsoResize&&!d.alsoResize.nodeType?e.each(d.alsoResize,function(a,b){i(a,b)}):i(d.alsoResize)},stop:function(){e(this).removeData("resizable-alsoresize")}});e.ui.plugin.add("resizable",
"animate",{stop:function(b){var a=e(this).data("resizable"),c=a.options,d=a._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName),g=f&&e.ui.hasScroll(d[0],"left")?0:a.sizeDiff.height,f={width:a.size.width-(f?0:a.sizeDiff.width),height:a.size.height-g},g=parseInt(a.element.css("left"),10)+(a.position.left-a.originalPosition.left)||null,h=parseInt(a.element.css("top"),10)+(a.position.top-a.originalPosition.top)||null;a.element.animate(e.extend(f,h&&g?{top:h,left:g}:{}),{duration:c.animateDuration,
easing:c.animateEasing,step:function(){var c={width:parseInt(a.element.css("width"),10),height:parseInt(a.element.css("height"),10),top:parseInt(a.element.css("top"),10),left:parseInt(a.element.css("left"),10)};d&&d.length&&e(d[0]).css({width:c.width,height:c.height});a._updateCache(c);a._propagate("resize",b)}})}});e.ui.plugin.add("resizable","containment",{start:function(){var b=e(this).data("resizable"),a=b.element,c=b.options.containment;if(a=c instanceof e?c.get(0):/parent/.test(c)?a.parent().get(0):
c)if(b.containerElement=e(a),/document/.test(c)||c==document)b.containerOffset={left:0,top:0},b.containerPosition={left:0,top:0},b.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight};else{var d=e(a),f=[];e(["Top","Right","Left","Bottom"]).each(function(a,b){f[a]=j(d.css("padding"+b))});b.containerOffset=d.offset();b.containerPosition=d.position();b.containerSize={height:d.innerHeight()-f[3],width:d.innerWidth()-
f[1]};var c=b.containerOffset,g=b.containerSize.height,h=b.containerSize.width,h=e.ui.hasScroll(a,"left")?a.scrollWidth:h,g=e.ui.hasScroll(a)?a.scrollHeight:g;b.parentData={element:a,left:c.left,top:c.top,width:h,height:g}}},resize:function(b){var a=e(this).data("resizable"),c=a.options,d=a.containerOffset,f=a.position,b=a._aspectRatio||b.shiftKey,g={top:0,left:0},h=a.containerElement;h[0]!=document&&/static/.test(h.css("position"))&&(g=d);if(f.left<(a._helper?d.left:0))a.size.width+=a._helper?a.position.left-
d.left:a.position.left-g.left,b&&(a.size.height=a.size.width/a.aspectRatio),a.position.left=c.helper?d.left:0;if(f.top<(a._helper?d.top:0))a.size.height+=a._helper?a.position.top-d.top:a.position.top,b&&(a.size.width=a.size.height*a.aspectRatio),a.position.top=a._helper?d.top:0;a.offset.left=a.parentData.left+a.position.left;a.offset.top=a.parentData.top+a.position.top;c=Math.abs((a._helper?a.offset.left-g.left:a.offset.left-g.left)+a.sizeDiff.width);d=Math.abs((a._helper?a.offset.top-g.top:a.offset.top-
d.top)+a.sizeDiff.height);f=a.containerElement.get(0)==a.element.parent().get(0);g=/relative|absolute/.test(a.containerElement.css("position"));f&&g&&(c-=a.parentData.left);c+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-c,b&&(a.size.height=a.size.width/a.aspectRatio));d+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-d,b&&(a.size.width=a.size.height*a.aspectRatio))},stop:function(){var b=e(this).data("resizable"),a=b.options,c=b.containerOffset,d=b.containerPosition,
f=b.containerElement,g=e(b.helper),h=g.offset(),i=g.outerWidth()-b.sizeDiff.width,g=g.outerHeight()-b.sizeDiff.height;b._helper&&!a.animate&&/relative/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g});b._helper&&!a.animate&&/static/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g})}});e.ui.plugin.add("resizable","ghost",{start:function(){var b=e(this).data("resizable"),a=b.options,c=b.size;b.ghost=b.originalElement.clone();b.ghost.css({opacity:0.25,
display:"block",position:"relative",height:c.height,width:c.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof a.ghost?a.ghost:"");b.ghost.appendTo(b.helper)},resize:function(){var b=e(this).data("resizable");b.ghost&&b.ghost.css({position:"relative",height:b.size.height,width:b.size.width})},stop:function(){var b=e(this).data("resizable");b.ghost&&b.helper&&b.helper.get(0).removeChild(b.ghost.get(0))}});e.ui.plugin.add("resizable","grid",{resize:function(){var b=
e(this).data("resizable"),a=b.options,c=b.size,d=b.originalSize,f=b.originalPosition,g=b.axis;a.grid="number"==typeof a.grid?[a.grid,a.grid]:a.grid;var h=Math.round((c.width-d.width)/(a.grid[0]||1))*(a.grid[0]||1),a=Math.round((c.height-d.height)/(a.grid[1]||1))*(a.grid[1]||1);/^(se|s|e)$/.test(g)?(b.size.width=d.width+h,b.size.height=d.height+a):/^(ne)$/.test(g)?(b.size.width=d.width+h,b.size.height=d.height+a,b.position.top=f.top-a):(/^(sw)$/.test(g)?(b.size.width=d.width+h,b.size.height=d.height+
a):(b.size.width=d.width+h,b.size.height=d.height+a,b.position.top=f.top-a),b.position.left=f.left-h)}});var j=function(b){return parseInt(b,10)||0},i=function(b){return!isNaN(parseInt(b,10))}})(n)}});
