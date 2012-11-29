define(function (require, exports) {
    return function ($, _) {
        //目标：让非[type=submit]按钮也能通过click事件提交表单，一般只会在ASP.NET MVC中使用到
        $.fn.linksubmit = function () {
            this.each(function () {
                $(this).click(function () {
                    $(this).closest("form").submit();
                });
            });
        }

        //目标：让表单中input的回车事件与指定的按钮click事件对应触发
        //表单中的input回车事件会自动触发本表单第一个submit按钮（如果有的话）的click事件。
        //但是在IE6-8中，如果表单中只有一个input，则不会触发submit按钮的click事件而是直接触发表单的submit事件
        //非[type=submit]按钮（如A标签）肯定需要此模块达成目标。
        //[type=submit]按钮只有在支持IE6-8的项目中的只有一个input的表单中才需要此模块
        //如果要替换“第一个submit按钮”的职位，可以指定form标签的defaultbutton属性。
        $.fn.accessform = function (options) {
            var opts = $.extend({
                assistClass: 'access_'
            }, options);

            this.each(function () {
                var o = $(this);
                $("input[accesskey]", o).bind("keydown", function (e) {
                    var code = (e.keyCode ? e.keyCode : e.which);
                    if (code == 13) {
                        var subbtn = $('.' + opts.assistClass + $(this).attr('accesskey'), o);
                        subbtn.click();
                        if (subbtn.is("[href^='javascript:']")) { //Fix ASP.NET WebForm Feature.
                            _.delay(function () {
                                if ($("body>div.formError").length)
                                    return;
                                else
                                    eval(subbtn.attr('href'));
                            }, 200);
                        }
                        return false;
                    }
                });
            });

        }
    }
});