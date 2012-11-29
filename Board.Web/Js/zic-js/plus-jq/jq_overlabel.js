define(function (require, exports, module) {
    return function ($) {
        /*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
        * Licensed under the MIT License (LICENSE.txt).
        *
        * Version 1.0
        *
        * Based on Making Compact Forms More Accessible by Mike Brittain (http://alistapart.com/articles/makingcompactformsmoreaccessible)
        */

        $.fn.overlabel = function () {
            this.each(function () {
                var $label = $(this);
                var $input = $('#' + $label.attr('for'));
                if (!$input.val() && !$input.is(":focus")) $label.show();

                $label.bind('click', function (event) {
                    $input.focus();
                });

                $input.bind('focus blur', function (event) {
                    if (event.type == 'blur' && !$input.val() && !$input.hasClass('using')) {
                        $label.show();
                    } else {
                        $label.hide();
                    }
                });

            });
        };
    }

});