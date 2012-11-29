define(function (require, exports, module) {
    return function ($) {
        $.fn.flashClass = function (options) {
            var opts = $.extend({
                autorun: false,
                newClass: "",
                maxCache: 100,
                animSpeed: 1000
            }, options);

            this.each(function () {
                var o = $(this);
                o.data('fc_run', opts.autorun);
                var count = 0;

                var run = function () {
                    if (count++ > opts.maxCache) return;
                    if (!o.data('fc_run') && !o.hasClass(opts.newClass)) return;
                    if (opts.newClass == "")
                        o.fadeToggle(opts.animSpeed, run);
                    else
                        o.toggleClass(opts.newClass, opts.animSpeed, run);
                };
                run();

                o.on('flashclass', function () {
                    if (o.data('fc_run') && o.is(':animated')) return;
                    o.data('fc_run', true);
                    run();
                });
                o.on('stopflashclass', function () {
                    o.data('fc_run', false);
                });

            });
        }
    }
});