define(function(){return function(d,e){d.fn.serializeToArgs=function(){for(var b=this.serializeArray(),c={},a=0;a<b.length;a++)c[b[a].name]=b[a].value;return e.stringify(c)}}});
