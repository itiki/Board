define(function(require,exports,module){var a,b,c,d;exports.Init=function(e){a=e.jq,d=a("#dia_ret"),b=e,c=e._;if(d.data("init"))return;a("a.donet",d).click(function(){var c=d.data("itemview"),e=a("select, input:text",d).serializeToArgs();c.change(b.JSON.parse(e)),d.dialog("close")}),d.data("form",a("div.form",d)),d.data("init",!0)},exports.Prop=function(e,f){d.data("form").empty(),d.data("itemview",e),d.dialog("open");for(var g in e.tempProps){var h=e.tempProps[g].id,i=c.any(f,function(a){return a.Key2==h});if(!i)continue;var j;if(h<10){j=a("<select name='"+g+"'></select>");var k=exports.SelpropsGet(h);k.push({Name:"\u6b63\u5e38",ClassName:""});for(var l=0;l<k.length;l++){var m=a("<option value='"+k[l].ClassName+"'>"+k[l].Name+"</option>");e.model.get(g)==k[l].ClassName&&m.attr("selected","selected"),m.appendTo(j)}}else j=a("<input name='"+g+"' type='text' class='text' value='"+e.model.get(g)+"' />"),j.attr("name")=="href"&&j.addClass("selall");var n=a("<p></p>");n.append("<label>"+e.tempProps[g].name+"</label>"),n.append(j),d.data("form").append(n)}return b.fix_mttext(this.el_c),!1},exports.SelpropsGet=function(a){return c.filter(glo_selprops,function(b){return b.PropType==a})}});
