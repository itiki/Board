define(function (require, exports) {
    exports.random = function (arr) {
        return arr.sort(function (a, b) {
            return Math.random() > 0.5 ? (-1) : 1
        });
    }

    exports.keyb_pwd_random = function (_) {
        var arr_num = "";
        _.each(exports.random(['1 ', '2 ', '3 ', '4 ', '5 ', '6 ', '7 ', '8 ', '9 ', '0 ']), function (num) {
            arr_num += num;
        });
        arr_num += "{bksp}";
        var arr_letter1 = "";
        _.each(exports.random(['q ', 'w ', 'e ', 'r ', 't ', 'y ', 'u ', 'i ', 'o ', 'p ']), function (letter) {
            arr_letter1 += letter;
        });
        var arr_letter2 = "";
        _.each(exports.random(['a ', 's ', 'd ', 'f ', 'g ', 'h ', 'j ', 'k ', 'l ']), function (letter) {
            arr_letter2 += letter;
        });
        arr_letter2 += "{shift}";
        var arr_letter3 = "{cancel} ";
        _.each(exports.random(['z ', 'x ', 'c ', 'v ', 'b ', 'n ', 'm ']), function (letter) {
            arr_letter3 += letter;
        });
        arr_letter3 += "{accept}";

        var s_arr_letter1 = "";
        _.each(exports.random(['Q ', 'W ', 'E ', 'R ', 'T ', 'Y ', 'U ', 'I ', 'O ', 'P ']), function (letter) {
            s_arr_letter1 += letter;
        });
        var s_arr_letter2 = "";
        _.each(exports.random(['A ', 'S ', 'D ', 'F ', 'G ', 'H ', 'J ', 'K ', 'L ']), function (letter) {
            s_arr_letter2 += letter;
        });
        s_arr_letter2 += "{shift}";
        var s_arr_letter3 = "{cancel} ";
        _.each(exports.random(['Z ', 'X ', 'C ', 'V ', 'B ', 'N ', 'M ']), function (letter) {
            s_arr_letter3 += letter;
        });
        s_arr_letter3 += "{accept}";

        return {
            'default': [arr_num, arr_letter1, arr_letter2, arr_letter3],
            'shift': [s_arr_letter1, s_arr_letter2, s_arr_letter3]
        };
    }

    exports.keyb_pwd = function (_) {
        return {
            'default': [
				'1 2 3 4 5 6 7 8 9 0 {bksp}',
				'q w e r t y u i o p ',
				'a s d f g h j k l {shift}',
				'{cancel} z x c v b n m {accept}'
			],
            'shift': [
				'Q W E R T Y U I O P {bksp} ',
				'A S D F G H J K L {shift}',
				'{cancel} Z X C V B N M {accept}'
			]
        };
    }
});