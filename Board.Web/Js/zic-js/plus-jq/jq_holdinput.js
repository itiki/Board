define(function (require, exports) {
    return function ($, moms) {

        //textarea不支持maxlength，input[type=text]拥有浏览器完整支持
        $.fn.holdinput = function () {
            this.bind('keypress', function () {
                var o = $(this);
                if (o.val().length > o.attr('maxlength')) {
                    o.val(o.val().substr(0, o.attr('maxlength')));
                }
            });
        }

    }
});
