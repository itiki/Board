define(function (require, exports, module) {
    return function ($) {
        $.fn.bankcard = function (options) {
            var opts = $.extend({
                chain: " "
            }, options);

            this.each(function () {
                var o = $(this);
                o.on("keyup", function (event) {
                    if (event.keyCode == 8 || event.keyCode == 46) return;
                    if (o.val() == "") return;
                    var account = o.val();
                    account = account.substring(0, 22);
                    if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") != null) {
                        account = " " + account.substring(1, 5)
                            + " " + account.substring(6, 10)
                            + " " + account.substring(14, 18)
                            + "-" + account.substring(18, 25);
                    } else if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|"
                        + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                        var accountNumeric = accountChar = "", i;
                        for (i = 0; i < account.length; i++) {
                            accountChar = account.substr(i, 1);
                            if (!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
                        }
                        account = "";
                        for (i = 0; i < accountNumeric.length; i++) {
                            if (i == 4) account = account + opts.chain;
                            if (i == 8) account = account + opts.chain;
                            if (i == 12) account = account + opts.chain;
                            account = account + accountNumeric.substr(i, 1)
                        }
                    }
                    if (account != o.val())
                        o.val(account);
                });
            });

        }
    }
});