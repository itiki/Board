define(function(l,b){b.run=function(b){return b.sort(function(){return 0.5<Math.random()?-1:1})};b.keyboard=function(c){var d="";c.each(b.run("1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9 ,0 ".split(",")),function(a){d+=a});var d=d+"{bksp}",j="";c.each(b.run("q ,w ,e ,r ,t ,y ,u ,i ,o ,p ".split(",")),function(a){j+=a});var e="";c.each(b.run("a ,s ,d ,f ,g ,h ,j ,k ,l ".split(",")),function(a){e+=a});var e=e+"{shift} ",f="";c.each(b.run("z ,x ,c ,v ,b ,n ,m ".split(",")),function(a){f+=a});var f=f+"{accept}",g="";c.each(b.run("1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9 ,0 ".split(",")),
function(a){g+=a});var g=g+"{bksp}",k="";c.each(b.run("Q ,W ,E ,R ,T ,Y ,U ,I ,O ,P ".split(",")),function(a){k+=a});var h="";c.each(b.run("A ,S ,D ,F ,G ,H ,J ,K ,L ".split(",")),function(a){h+=a});var h=h+"{shift} ",i="";c.each(b.run("Z ,X ,C ,V ,B ,N ,M ".split(",")),function(a){i+=a});i+="{accept}";return{"default":[d,j,e,f],shift:[g,k,h,i]}}});