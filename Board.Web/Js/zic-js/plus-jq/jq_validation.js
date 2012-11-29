define(function (require, exports, module) {
    //vali_delay class可以延迟1毫秒验证
    //所有验证触发始于'input[type=submit], .submit'的click事件
    //在submit buttom中使用title属性可以指定对应表单元素去验证，不使用title则验证其closest('form')中的所有'[class*=validate]'表单项
    //atlast 验证较复杂，相关地方不要随意修改
    //针对IE6做了提示框的宽度计算，_fixPromptWidth
    //validate[func[functionname]] 可以自定义验证函数
    //valiarr[topLeft] 可以指定提示框位置
    //添加_unFieldEvent事件，默认用作焦点进入input时关闭错误提示

     return function ($, _) {
        /*
        * Inline Form Validation Engine 2.2, jQuery plugin
        * http://www.position-absolute.com
        * http://www.crionics.com
        */

        $.validationEngineLanguage = {
            allRules: {
                "equals": {
                    "alertText": "前后不一致！"
                },
                "atlast": {
                    "alertText": "至少填写其中项！"
                },
                "required": {
                    "alertText": "* 此项必填",
                    "alertTextCheckboxMultiple": "* 请选择",
                    "alertTextCheckboxe": "* 请先勾选同意本协议"
                },
                "length": {
                    "alertText": "在 ",
                    "alertText2": " 到 ",
                    "alertText3": " 个字符间"
                },
                "minSize": {
                    "alertText": "字符长度不得小于 ",
                    "alertText2": " 位"
                },
                "maxSize": {
                    "alertText": "字符长度不得大于 ",
                    "alertText2": " 位"
                },
                "maxCheckbox": {
                    "alertText": "* Checks allowed Exceeded"
                },
                "minCheckbox": {
                    "alertText": "请选择至少",
                    "alertText2": " 个选项"
                },
                /* FuncVali */
                "dateRegion": {
                    "func": function (val) {
                        var val = val.replace("-", "/");
                        var vald = new Date(val);
                        var nowDate = new Date();
                        if (vald <= nowDate)
                            return "日期不能小于等于今天";
                        else
                            return "ok";
                    }
                },
                "continueSix": {
                    "func": function (val) {
                        var val = val.toLowerCase();
                        var flag, continuation = 1;
                        for (var i = 0; i < val.length; i++) {
                            if (val.charCodeAt(i) == flag) {
                                continuation++;
                                if (continuation > 5)
                                    return "密码过于简单，不能连续6个及以上相同的字母或数字";
                            } else
                                continuation = 1;
                            flag = val.charCodeAt(i);
                        }
                        return "ok";
                    }
                },
                /* compareFunc */
                "equalsSix": {
                    "func": function (val, eqval, eqtitle) {
                        var val = val.toLowerCase();
                        var eqval = eqval.toLowerCase();
                        for (var i = 0; i < val.length; i++) {
                            var valstr = val.substr(i, 6);
                            if (valstr.length < 6) break;
                            for (var x = 0; x < eqval.length; x++) {
                                var eqvalstr = eqval.substr(x, 6);
                                if (eqvalstr.length < 6) break;
                                if (eqvalstr == valstr) {
                                    return "不允许连续6个及以上字符与" + eqtitle + "相同";
                                }
                            }
                        }
                        return "ok";
                    }
                },
                "beMin": {
                    "func": function (val, eqval, eqtitle) {
                        var val = Number(val);
                        var eqval = Number(eqval);
                        if (val < eqval) {
                            return "不允许小于" + eqtitle;
                        }
                        return "ok";
                    }
                },
                /* compareOthers */
                "SHbeMin": {
                    "func": function (val, eqval, eqtitle, eqval2, eqtitle2) {
                        var val = Number(val);
                        var eqval = Number(eqval);
                        var eqval2 = Number(eqval2);
                        if (eqval != 0 && val < eqval2) {
                            return "不允许小于" + eqtitle2;
                        }
                        return "ok";
                    }
                },
                "SHObeMin": {
                    "func": function (val, eqval, eqtitle, eqval2, eqtitle2) {
                        var eqval = Number(eqval);
                        var eqval2 = Number(eqval2);
                        if (eqval != 0 && eqval < eqval2) {
                            return eqtitle + "不允许小于" + eqtitle2;
                        }
                        return "ok";
                    }
                },

                "noPullNumber": {
                    "func": function (val) {
                        var pattern = new RegExp(/^[0-9]+$/);
                        if (pattern.test(val))
                            return "不能由纯数字组成";
                        else
                            return "ok";
                    }
                },
                "ajaxEmailExist": {
                    "url": window.urlprefix + "/people/check",
                    "extraData": "email=eric",
                    "alertText": "* 这个email已被使用",
                    "alertTextLoad": "* 验证中, 请等待"
                },
                /* CustomRegex */
                "telephone": {
                    "regex": /^[0-9\-\(\)\ ]{7,}$/,
                    "alertText": "电话号码格式不正确"
                },
                "validate": {
                    "regex": /^[0-9\-\(\)\ ]+$/,
                    "alertText": "验证码格式不正确"
                },
                "email": {
                    //http://projects.scottsplayground.com/email_address_validation/
                    "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                    "alertText": "Email格式不正确"
                },
                "date": {
                    "regex": /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/,
                    "alertText": "日期格式不正确，必须为'YYYY-MM-DD'格式"
                },
                "chinese": {
                    "regex": /^[\u4e00-\u9fa5]+$/,
                    "alertText": "必须是中文"
                },
                "onlyNumber": {
                    "regex": /^[0-9]+$/,
                    "alertText": "必须是数字"
                },
                "onlyLetter": {
                    "regex": /^[a-zA-Z]+$/,
                    "alertText": "* 必须是英文字母"
                },
                "userName": {
                    "regex": /^[a-zA-Z][0-9a-zA-Z]+$/,
                    "alertText": "* 必须是字母和数字内容，数字不允许开头"
                },
                "price": {
                    "regex": /^[0-9]+(\.[0-9]{1,2})?$/,
                    "alertText": "价格格式不正确"
                },
                "shared": {
                    "regex": /^[0-9]+(\.[0-9]{1,2})?$/,
                    "alertText": "份额格式不正确"
                },
                "ipv4": {
                    "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "* 错误的 IP 地址"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
                    "alertText": "* 错误的 URL"
                },
                "postCode": {
                    "regex": /^\d{6}$/,
                    "alertText": "邮编格式不正确"
                },
                "passWord": {
                    "regex": /^(\d+[a-zA-Z]\w*)|([a-zA-Z]+\d\w*)$/,
                    "alertText": "密码格式不正确"
                },
                "passWordLogin": {
                    "regex": /^[0-9a-zA-z]{8,20}$/,
                    "alertText": "密码格式不正确，必须为8-20位数字或字母"
                },
                "bankCard": {
                    "regex": /^[0-9]{8}$|^[0-9]{16}$|^[0-9]{18}|^[0-9]{19}$/,
                    "alertText": "银行卡格式不正确"
                },
                "bankCardWithSpace": {
                    "regex": /^[0-9 ]{9}$|^[0-9 ]{19}$|^[0-9 ]{21}|^[0-9 ]{22}$/,
                    "alertText": "银行卡格式不正确"
                }
            }
        };

        var methods = {
            init: function (options) {
                var form = this;
                if (!form.data('jqv') || form.data('jqv') == null) {
                    methods._saveOptions(form, options);
                    $(".formError").live("click", function () {
                        $(this).fadeOut(150, function () {
                            $(this).remove();
                        });
                    });
                }
            },
            attach: function (userOptions) {
                var form = this;
                var options;
                if (userOptions)
                    options = methods._saveOptions(form, userOptions);
                else
                    options = form.data('jqv');

                if (!options.binded) {
                    var field = form.find("[class*=validate]");
                    field.not('[type=checkbox]').not('.vali_delay')
                        .bind(options.validationEventTrigger, methods._onFieldEvent)
                        .bind(options.un_validationEventTrigger, methods._unFieldEvent);
                    field.filter('[type=checkbox]').bind("click", methods._onFieldEvent);
                    field.filter('.vali_delay').bind(options.validationEventTrigger, methods._delay_onFieldEvent);
                    form.find('input[type=submit], .submit').not('.vali_skip').bind("click", methods._onSubmitEvent);
                    options.binded = true;
                    if (options.autoPositionUpdate) {
                        $(window).bind("resize", { "noAnimation": true, "formElem": form }, methods.updatePromptsPosition);
                    }
                }
                return this;
            },
            detach: function () {
                var form = this;
                var options = form.data('jqv');

                var field = form.find("[class*=validate]");
                field.not("[type=checkbox]").not('.vali_delay')
                    .unbind(options.validationEventTrigger, methods._onFieldEvent)
                    .unbind(options.un_validationEventTrigger, methods._unFieldEvent);
                field.filter('[type=checkbox]').unbind("click", methods._onFieldEvent);
                field.filter('.vali_delay').unbind(options.validationEventTrigger, methods._delay_onFieldEvent);
                form.find('input[type=submit], .submit').unbind("click", methods.onAjaxFormComplete);
                form.removeData('jqv');

                if (options.autoPositionUpdate) {
                    $(window).unbind("resize", methods.updatePromptsPosition)
                }
                return this;
            },
            validate: function () {
                return methods._validateFields(this);
            },
            validateField: function (el) {
                var options = $(this).data('jqv');
                var r = methods._validateField($(el), options);
                if (options.onSuccess && options.InvalidFields.length == 0)
                    options.onSuccess();
                else if (options.onFailure && options.InvalidFields.length > 0)
                    options.onFailure();
                return r;
            },
            validateform: function () {
                return methods._onSubmitEvent.call(this);
            },
            updatePromptsPosition: function (event) {
                if (event && this == window)
                    var form = event.data.formElem, noAnimation = event.data.noAnimation;
                else
                    var form = $(this.closest('form'));

                var options = form.data('jqv');
                form.find('[class*=validate]').not(':hidden').not(":disabled").each(function () {
                    var field = $(this);
                    var prompt = methods._getPrompt(field);
                    var promptText = $(prompt).find(".formErrorContent").html();
                    if (prompt)
                        methods._updatePrompt(field, $(prompt), promptText, undefined, false, options, noAnimation);
                })
                return this;
            },
            showPrompt: function (promptText, type, promptPosition, showArrow) {
                var form = this.closest('form');
                var options = form.data('jqv');
                if (!options)
                    options = methods._saveOptions(this, options);
                if (promptPosition)
                    options.promptPosition = promptPosition;
                options.showArrow = showArrow == true;
                methods._showPrompt(this, promptText, type, false, options);
            },
            hidePrompt: function () {
                var promptClass = "." + methods._getClassName($(this).data("vali_class")) + "formError";
                $(promptClass).fadeTo("fast", 0.3, function () {
                    $(this).remove();
                });
            },
            closePrompt: function (field) {
                return methods._closePrompt(field);
            },
            hide: function () {
                var closingtag;
                if ($(this).is("form")) {
                    closingtag = "parentForm" + $(this).attr('id');
                } else {
                    closingtag = $(this).attr('id') + "formError";
                }
                $('.' + closingtag).fadeTo("fast", 0.3, function () {
                    $(this).remove();
                });
            },
            hideAll: function () {
                $('.formError').fadeTo("fast", 0.3, function () {
                    $(this).remove();
                });
            },

            _saveOptions: function (form, options) {
                var userOptions = $.extend(true,
                    { allrules: $.validationEngineLanguage.allRules },
                    $.validationEngine.defaults,
                    options);
                form.data('jqv', userOptions);
                return userOptions;
            },
            _unFieldEvent: function () {
                methods._closePrompt($(this));
            },
            _onFieldEvent: function (event) {
                var field = $(this);
                var form = field.closest('form');
                var options = form.data('jqv');
                window.setTimeout(function () {
                    methods._validateField(field, options);
                    if (options.InvalidFields.length == 0 && options.onSuccess) {
                        options.onSuccess();
                    } else if (options.InvalidFields.length > 0 && options.onFailure) {
                        options.onFailure();
                    }
                }, (event.data) ? event.data.delay : 0);
            },
            _delay_onFieldEvent: function () {
                var field = this;
                var args = arguments;
                window.setTimeout(function () {
                    methods._onFieldEvent.apply(field, args);
                }, 1000);
            },
            _onSubmitEvent: function (event) {
                var form = $(this).closest('form');
                var options = form.data('jqv');
                var btntgt = "";
                if ($(event.target).is('[class*=valitarget]'))
                    btntgt = /valitarget\[(.*)\]/.exec($(event.target).attr('class'))[1];
                var r = methods._validateFields(form, true, btntgt);

                if (r && options.ajaxFormValidation) {
                    methods._validateFormWithAjax(form, options);
                    return false;
                }
                if (options.onValidationComplete) {
                    options.onValidationComplete(form, r);
                    return false;
                }
                return r;
            },
            _checkAjaxStatus: function (options) {
                var status = true;
                $.each(options.ajaxValidCache, function (key, value) {
                    if (!value) {
                        status = false;
                        // break the each
                        return false;
                    }
                });
                return status;
            },
            _validateFields: function (form, skipAjaxValidation, btntgt) {
                var options = form.data('jqv');
                var errorFound = false;
                form.trigger("jqv.form.validating");
                var fields = form.find('[class*=validate]').not(':hidden');
                if (btntgt)
                    fields = fields.filter('.valitarget_' + btntgt);
                fields.each(function () {
                    errorFound |= methods._validateField($(this), options, skipAjaxValidation);
                });
                form.trigger("jqv.form.result", [errorFound]);

                if (!errorFound) return true;
                if (!options.scroll) return false;
                var destination = Number.MAX_VALUE;
                var fixleft = 0;
                var lst = $(".formError:not('.greenPopup')");
                for (var i = 0; i < lst.length; i++) {
                    var d = $(lst[i]).offset().top;
                    if (d < destination) {
                        destination = d;
                        fixleft = $(lst[i]).offset().left;
                    }
                }
                if (!options.isOverflown)
                    $("html:not(:animated),body:not(:animated)").animate({
                        scrollTop: destination,
                        scrollLeft: fixleft
                    }, 1100);
                else {
                    var overflowDIV = $(options.overflownDIV);
                    var scrollContainerScroll = overflowDIV.scrollTop();
                    var scrollContainerPos = -parseInt(overflowDIV.offset().top);
                    destination += scrollContainerScroll + scrollContainerPos - 5;
                    var scrollContainer = $(options.overflownDIV + ":not(:animated)");
                    scrollContainer.animate({
                        scrollTop: destination
                    }, 1100);
                    $("html:not(:animated),body:not(:animated)").animate({
                        scrollTop: overflowDIV.offset().top,
                        scrollLeft: fixleft
                    }, 1100);
                }
                return false;
            },
            _validateFormWithAjax: function (form, options) {
                var data = form.serialize();
                var url = (options.ajaxFormValidationURL) ? options.ajaxFormValidationURL : form.attr("action");
                $.ajax({
                    type: "GET",
                    url: url,
                    cache: false,
                    dataType: "json",
                    data: data,
                    form: form,
                    methods: methods,
                    options: options,
                    beforeSend: function () {
                        return options.onBeforeAjaxFormValidation(form, options);
                    },
                    error: function (data, transport) {
                        methods._ajaxError(data, transport);
                    },
                    success: function (json) {
                        if (json !== true) {
                            var errorInForm = false;
                            for (var i = 0; i < json.length; i++) {
                                var value = json[i];
                                var errorFieldId = value[0];
                                var errorField = $($("#" + errorFieldId)[0]);
                                if (errorField.length == 1) {
                                    var msg = value[2];
                                    if (value[1] == true) {
                                        if (msg == "" || !msg) {
                                            methods._closePrompt(errorField);
                                        } else {
                                            if (options.allrules[msg]) {
                                                var txt = options.allrules[msg].alertTextOk;
                                                if (txt)
                                                    msg = txt;
                                            }
                                            methods._showPrompt(errorField, msg, "pass", false, options, true);
                                        }
                                    } else {
                                        errorInForm |= true;
                                        if (options.allrules[msg]) {
                                            var txt = options.allrules[msg].alertText;
                                            if (txt)
                                                msg = txt;
                                        }
                                        methods._showPrompt(errorField, msg, "", false, options, true);
                                    }
                                }
                            }
                            options.onAjaxFormComplete(!errorInForm, form, json, options);
                        } else
                            options.onAjaxFormComplete(true, form, "", options);
                    }
                });
            },
            _validateField: function (field, options, skipAjaxValidation) {
                var getRules = /validate\[(.*)\]/.exec(field.attr('class'));
                if (!getRules) return false;

                var str = getRules[1];
                var rules = str.split(/\[|,|\]/);
                if (field.val() == "") {
                    rules1 = ['required', 'atlast'];
                    for (var i = 0; i < rules.length; i++) {
                        if (rules[i] == 'atlast')
                            rules1.push(rules[i + 1]);
                    }
                    rules = _.intersection(rules, rules1);
                }

                var form = $(field.closest("form"));
                var isAjaxValidator = false;
                var fieldName = field.attr("name");
                var promptText = "";
                options.isError = false;
                options.showArrow = true;

                for (var i = 0; i < rules.length; i++) {
                    var errorMsg = undefined;
                    switch (rules[i]) {
                        case "required":
                            errorMsg = methods._required(field, rules, i, options);
                            break;
                        case "custom":
                            errorMsg = methods._customRegex(field, rules, i, options);
                            break;
                        case "ajax":
                            // ajax has its own prompts handling technique
                            if (!skipAjaxValidation) {
                                methods._ajax(field, rules, i, options);
                                isAjaxValidator = true;
                            }
                            break;
                        case "minSize":
                            errorMsg = methods._minSize(field, rules, i, options);
                            break;
                        case "maxSize":
                            errorMsg = methods._maxSize(field, rules, i, options);
                            break;
                        case "min":
                            errorMsg = methods._min(field, rules, i, options);
                            break;
                        case "max":
                            errorMsg = methods._max(field, rules, i, options);
                            break;
                        case "past":
                            errorMsg = methods._past(field, rules, i, options);
                            break;
                        case "future":
                            errorMsg = methods._future(field, rules, i, options);
                            break;
                        case "dateRange":
                            var classGroup = "[class*=" + rules[i + 1] + "]";
                            var firstOfGroup = form.find(classGroup).eq(0);
                            var secondOfGroup = form.find(classGroup).eq(1);
                            if (firstOfGroup[0].value || secondOfGroup[0].value) {
                                errorMsg = methods._dateRange(firstOfGroup, secondOfGroup, rules, i, options);
                            }
                            if (errorMsg) required = true;
                            options.showArrow = false;
                            break;
                        case "maxCheckbox":
                            errorMsg = methods._maxCheckbox(field, rules, i, options);
                            field = $($("input[name='" + fieldName + "']"));
                            break;
                        case "minCheckbox":
                            errorMsg = methods._minCheckbox(field, rules, i, options);
                            var groupname = fieldName.substring(0, fieldName.length - 1);
                            field = $($("input[name^='" + groupname + "']"));
                            break;
                        case "equals":
                            errorMsg = methods._equals(field, rules, i, options);
                            break;
                        case "func":
                            errorMsg = methods._funcCall(field, rules, i, options);
                            break;
                        case "compareFunc":
                            errorMsg = methods._compareFunc(field, rules, i, options);
                            break;
                        case "compareOthers":
                            errorMsg = methods._compareOthers(field, rules, i, options);
                            break;
                        case "atlast":
                            errorMsg = methods._atlast(field, rules, i, options);
                            break;
//                        case "passWordLogin":
//                            errorMsg = methods._passWordLogin(field, rules, i, options);
//                            break;
                        default:
                            break;
                    }
                    if (errorMsg !== undefined) {
                        promptText += errorMsg + "<br/>";
                        options.isError = true;
                    }
                }

                var fieldType = field.attr("type");
                if ((fieldType == "radio" || fieldType == "checkbox") && $("input[name='" + fieldName + "']").size() > 1) {
                    field = $($("input[name='" + fieldName + "'][type!=hidden]:first"));
                    options.showArrow = false;
                }
                if (fieldType == "text" && form.find("input[name='" + fieldName + "']").size() > 1) {
                    field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
                    options.showArrow = false;
                }

                if (options.isError)
                    methods._showPrompt(field, promptText, "", false, options);
                else
                    if (!isAjaxValidator) methods._closePrompt(field);

                if (!isAjaxValidator)
                    field.trigger("jqv.field.result", [field, options.isError, promptText]);

                /* Record error */
                var errindex = $.inArray(field[0], options.InvalidFields);
                if (errindex == -1) {
                    if (options.isError)
                        options.InvalidFields.push(field[0]);
                } else if (!options.isError) {
                    options.InvalidFields.splice(errindex, 1);
                }

                return options.isError;
            },

            _required: function (field, rules, i, options) {
                switch (field.attr("type")) {
                    case "text":
                    case "password":
                    case "textarea":
                    case "file":
                    default:
                        if (!field.val())
                            return options.allrules[rules[i]].alertText;
                        break;
                    case "radio":
                    case "checkbox":
                        var name = field.attr("name");
                        if ($("input[name='" + name + "']:checked").size() == 0) {

                            if ($("input[name='" + name + "']").size() == 1)
                                return options.allrules[rules[i]].alertTextCheckboxe;
                            else
                                return options.allrules[rules[i]].alertTextCheckboxMultiple;
                        }
                        break;
                    case "select-one":
                        if (!field.val())
                            return options.allrules[rules[i]].alertText;
                        break;
                    case "select-multiple":
                        if (!field.find("option:selected").val())
                            return options.allrules[rules[i]].alertText;
                        break;
                }
            },
            _customRegex: function (field, rules, i, options) {
                var customRule = rules[i + 1];
                var rule = options.allrules[customRule];
                if (!rule) {
                    alert("jqv:custom rule not found " + customRule);
                    return;
                }
                var ex = rule.regex;
                if (!ex) return;
                var pattern = new RegExp(ex);
                if (!pattern.test(field.val()))
                    return options.allrules[customRule].alertText;
            },
            _funcCall: function (field, rules, i, options) {
                var func_name = rules[i + 1];
                var rule = options.allrules[func_name];
                var result = rule.func(field.val());
                if (result != "" && result != "ok") {
                    if (options.allrules[func_name].alertText)
                        return options.allrules[func_name].alertText;
                    else
                        return result;
                }
            },
            _equals: function (field, rules, i, options) {
                var equalsField = rules[i + 1];
                if (field.val() != $("#" + equalsField).val())
                    return options.allrules.equals.alertText;
            },
            _compareFunc: function (field, rules, i, options) {
                var func_name = rules[i + 1];
                var equalsField = $("#" + rules[i + 2]);
                var rule = options.allrules[func_name];
                var result = rule.func(field.val(), equalsField.val() || equalsField.text(), equalsField.attr('title'));
                if (result != "" && result != "ok") {
                    if (options.allrules[func_name].alertText)
                        return options.allrules[func_name].alertText;
                    else
                        return result;
                }
            },
            _compareOthers: function (field, rules, i, options) {
                var func_name = rules[i + 1];
                var equalsField = $("#" + rules[i + 2]);
                var equalsField2 = $("#" + rules[i + 3]);
                var rule = options.allrules[func_name];
                var result = rule.func(field.val(), equalsField.val() || equalsField.text(), equalsField.attr('title'),
                    equalsField2.val() || equalsField2.text(), equalsField2.attr('title'));
                if (result != "" && result != "ok") {
                    if (options.allrules[func_name].alertText)
                        return options.allrules[func_name].alertText;
                    else
                        return result;
                }
            },
            _atlast: function (field, rules, i, options) {
                var atlast_rule = rules[i + 1];
                var form = field.closest('form');
                var inps = $("input[class*='atlast[" + atlast_rule + "]']", form);
                var ok = false;
                inps.each(function () {
                    if ($(this).val() != "") {
                        ok = true;
                        return false;
                    }
                });
                if (ok)
                    return;
                var fields_tips = "";
                inps.each(function () {
                    fields_tips += $(this).attr('title');
                    fields_tips += ',';
                });
                return fields_tips + options.allrules.atlast.alertText;
            },
            _maxSize: function (field, rules, i, options) {
                var max = parseFloat(rules[i + 1]);
                var len = field.val().length;

                if (len > max) {
                    var rule = options.allrules.maxSize;
                    return rule.alertText + max + rule.alertText2;
                }
            },
            _minSize: function (field, rules, i, options) {
                var min = parseFloat(rules[i + 1]);
                var len = field.val().length;

                if (len < min) {
                    var rule = options.allrules.minSize;
                    return rule.alertText + min + rule.alertText2;
                }
            },
            _min: function (field, rules, i, options) {
                var min = parseFloat(rules[i + 1]);
                var len = parseFloat(field.val());

                if (len < min) {
                    return "不得小于" + min;
                }
            },
            _max: function (field, rules, i, options) {
                var max = parseFloat(rules[i + 1]);
                var len = parseFloat(field.val());

                if (len > max) {
                    return "不得大于" + max;
                }
            },
            _past: function (field, rules, i, options) {
                var p = rules[i + 1];
                var pdate = (p.toLowerCase() == "now") ? new Date() : methods._parseDate(p);
                var vdate = methods._parseDate(field.val());

                if (vdate < pdate) {
                    var rule = options.allrules.past;
                    if (rule.alertText2) return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
                    return rule.alertText + methods._dateToString(pdate);
                }
            },
            _future: function (field, rules, i, options) {
                var p = rules[i + 1];
                var pdate = (p.toLowerCase() == "now") ? new Date() : methods._parseDate(p);
                var vdate = methods._parseDate(field.val());
                if (vdate > pdate) {
                    var rule = options.allrules.future;
                    if (rule.alertText2) return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
                    return rule.alertText + methods._dateToString(pdate);
                }
            },
            _isDate: function (value) {
                var dateRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/);
                if (dateRegEx.test(value))
                    return true;
                return false;
            },
            _dateCompare: function (start, end) {
                return (new Date(start.toString()) < new Date(end.toString()));
            },
            _dateRange: function (first, second, rules, i, options) {
                if ((!first[0].value && second[0].value) || (first[0].value && !second[0].value))
                    return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
                if (!methods._isDate(first[0].value) || !methods._isDate(second[0].value))
                    return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
                if (!methods._dateCompare(first[0].value, second[0].value))
                    return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
            },
            _maxCheckbox: function (field, rules, i, options) {
                var nbCheck = rules[i + 1];
                var groupname = field.attr("name");
                var groupSize = $("input[name='" + groupname + "']:checked").size();
                if (groupSize > nbCheck) {
                    options.showArrow = false;
                    if (options.allrules.maxCheckbox.alertText2) return options.allrules.maxCheckbox.alertText + " " + nbCheck + " " + options.allrules.maxCheckbox.alertText2;
                    return options.allrules.maxCheckbox.alertText;
                }
            },
            _minCheckbox: function (field, rules, i, options) {
                var nbCheck = rules[i + 1];
                var attr = field.attr("name");
                var groupname = attr.substring(0, attr.length - 1);
                var groupSize = $("input[name^='" + groupname + "']:checked").size();
                if (groupSize < nbCheck) {
                    options.showArrow = false;
                    return options.allrules.minCheckbox.alertText + " " + nbCheck + " " + options.allrules.minCheckbox.alertText2;
                }
            },
            _ajax: function (field, rules, i, options) {
                var errorSelector = rules[i + 1];
                var rule = options.allrules[errorSelector];
                var extraData = rule.extraData;
                var extraDataDynamic = rule.extraDataDynamic;

                if (!extraData)
                    extraData = "";

                if (extraDataDynamic) {
                    var tmpData = [];
                    var domIds = String(extraDataDynamic).split(",");
                    for (var i = 0; i < domIds.length; i++) {
                        var id = domIds[i];
                        if ($(id).length) {
                            var inputValue = field.closest("form").find(id).val();
                            var keyValue = id.replace('#', '') + '=' + escape(inputValue);
                            tmpData.push(keyValue);
                        }
                    }
                    extraDataDynamic = tmpData.join("&");
                } else {
                    extraDataDynamic = "";
                }

                if (!options.isError) {
                    $.ajax({
                        type: "GET",
                        url: rule.url,
                        cache: false,
                        dataType: "json",
                        data: "fieldId=" + field.attr("id") + "&fieldValue=" + field.val() + "&extraData=" + extraData + "&" + extraDataDynamic,
                        field: field,
                        rule: rule,
                        methods: methods,
                        options: options,
                        beforeSend: function () {
                            // build the loading prompt
                            var loadingText = rule.alertTextLoad;
                            if (loadingText)
                                methods._showPrompt(field, loadingText, "load", true, options);
                        },
                        error: function (data, transport) {
                            methods._ajaxError(data, transport);
                        },
                        success: function (json) {
                            var errorFieldId = json[0];
                            var errorField = $($("#" + errorFieldId)[0]);
                            if (errorField.length == 1) {
                                var status = json[1];
                                var msg = json[2];
                                if (!status) {
                                    options.ajaxValidCache[errorFieldId] = false;
                                    options.isError = true;
                                    if (msg) {
                                        if (options.allrules[msg]) {
                                            var txt = options.allrules[msg].alertText;
                                            if (txt)
                                                msg = txt;
                                        }
                                    }
                                    else
                                        msg = rule.alertText;

                                    methods._showPrompt(errorField, msg, "", true, options);
                                } else {
                                    if (options.ajaxValidCache[errorFieldId] !== undefined)
                                        options.ajaxValidCache[errorFieldId] = true;

                                    if (msg) {
                                        if (options.allrules[msg]) {
                                            var txt = options.allrules[msg].alertTextOk;
                                            if (txt)
                                                msg = txt;
                                        }
                                    }
                                    else
                                        msg = rule.alertTextOk;

                                    if (msg)
                                        methods._showPrompt(errorField, msg, "pass", true, options);
                                    else
                                        methods._closePrompt(errorField);
                                }
                            }
                        }
                    });
                }
            },
            _ajaxError: function (data, transport) {
                if (data.status == 0 && transport == null)
                    alert("The page is not served from a server! ajax call failed");
                else if (typeof console != "undefined")
                    console.log("Ajax error: " + data.status + " " + transport);
            },
            _dateToString: function (date) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            },
            _parseDate: function (d) {
                var dateParts = d.split("-");
                if (dateParts == d)
                    dateParts = d.split("/");
                return new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
            },

            _showPrompt: function (field, promptText, type, ajaxed, options, ajaxform) {
                var prompt = methods._getPrompt(field);
                if (ajaxform) prompt = false;
                if (prompt)
                    methods._updatePrompt(field, prompt, promptText, type, ajaxed, options);
                else
                    methods._buildPrompt(field, promptText, type, ajaxed, options);
            },
            _fixPromptWidth: function (promptText, promptContent) {
                var charlength = 0;
                _.each(promptText.split('<br/>'), function (str) {
                    if (str.length > charlength)
                        charlength = str.length;
                });
                promptContent.width(charlength * 12);
            },
            _buildPrompt: function (field, promptText, type, ajaxed, options) {
                //ready
                var getPosition = /valiarr\[(.*)\]/.exec(field.attr('class'));
                if (getPosition) {
                    field.data('valiarr', getPosition[1].split(/\[|,|\]/)[0]);
                } else {
                    field.data('valiarr', options.promptPosition);
                }
                if (field.attr("id")) {
                    field.data('vali_class', field.attr("id"));
                } else {
                    field.data('vali_class', "jqvali_" + Math.random() * 11);
                }
                var buildClass = function (prompt) {
                    prompt.addClass(methods._getClassName(field.data('vali_class')) + "formError");
                    if (field.is(":input"))
                        prompt.addClass("parentForm" + methods._getClassName(field.parents('form').attr("id")));
                }

                //kissy model
                if (options.promptModel == "kissy") {
                    var prompt = $("<span class='valid-kissy'></span>");
                    buildClass(prompt);
                    switch (type) {
                        case "pass":
                            prompt.addClass("ok");
                            break;
                        default:
                            prompt.addClass("error");
                            break;
                    }
                    var promptContent = $('<b>').html(promptText).appendTo(prompt);
                    field.next("span.valid-kissy").remove();
                    field.after(prompt);
                    return;
                }

                var prompt = $('<div>');
                buildClass(prompt);
                prompt.addClass("formError");

                switch (type) {
                    case "pass":
                        prompt.addClass("greenPopup");
                        break;
                    case "load":
                        prompt.addClass("blackPopup");
                }
                if (ajaxed)
                    prompt.addClass("ajaxed");

                var promptContent = $('<div>').addClass("formErrorContent").html(promptText).appendTo(prompt);
                methods._fixPromptWidth(promptText, promptContent);

                if (options.showArrow) {
                    var arrow = $('<div>').addClass("formErrorArrow");
                    switch (field.data('valiarr')) {
                        case "bottomLeft":
                        case "bottomRight":
                            prompt.find(".formErrorContent").before(arrow);
                            arrow.addClass("formErrorArrowBottom").html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
                            break;
                        case "topLeft":
                        case "topRight":
                            arrow.html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
                            prompt.append(arrow);
                            break;
                    }
                }

                if (options.isOverflown)
                    field.before(prompt);
                else
                    $("body").append(prompt);

                var pos = methods._calculatePosition(field, prompt, options);
                prompt.css({
                    "top": pos.callerTopPosition,
                    "left": pos.callerleftPosition,
                    "marginTop": pos.marginTopSize,
                    "opacity": 0
                });
                return prompt.animate({
                    "opacity": 0.87
                });

            },
            _updatePrompt: function (field, prompt, promptText, type, ajaxed, options) {
                if (prompt) {
                    //kissy model
                    if (options.promptModel == "kissy") {
                        prompt.removeClass("ok error");
                        switch (type) {
                            case "pass":
                                prompt.addClass("ok");
                                break;
                            default:
                                prompt.addClass("error");
                                break;
                        }
                        prompt.find("b").html(promptText);
                        return;
                    }

                    methods._fixPromptWidth(promptText, prompt.children(".formErrorContent"));

                    if (type == "pass")
                        prompt.addClass("greenPopup");
                    else
                        prompt.removeClass("greenPopup");

                    if (type == "load")
                        prompt.addClass("blackPopup");
                    else
                        prompt.removeClass("blackPopup");

                    if (ajaxed)
                        prompt.addClass("ajaxed");
                    else
                        prompt.removeClass("ajaxed");

                    prompt.find(".formErrorContent").html(promptText);

                    var pos = methods._calculatePosition(field, prompt, options);
                    prompt.animate({
                        "top": pos.callerTopPosition,
                        "marginTop": pos.marginTopSize
                    });
                }
            },
            _closePrompt: function (field) {
                var prompt = methods._getPrompt(field);
                if (prompt)
                    prompt.fadeTo("fast", 0, function () {
                        prompt.remove();
                    });
            },
            _getPrompt: function (field) {
                if (!field.data('vali_class')) return;
                var className = "." + methods._getClassName(field.data('vali_class')) + "formError";
                var match = $(className)[0];
                if (match)
                    return $(match);
            },
            _calculatePosition: function (field, promptElmt, options) {
                var promptTopPosition, promptleftPosition, marginTopSize;
                var fieldWidth = field.width();
                var promptHeight = promptElmt.height();
                var overflow = options.isOverflown;
                if (overflow) {
                    promptTopPosition = promptleftPosition = 0;
                    marginTopSize = -promptHeight;
                } else {
                    var offset = field.offset();
                    promptTopPosition = offset.top;
                    promptleftPosition = offset.left;
                    marginTopSize = 0;
                }
                switch (field.data('valiarr')) {
                    default:
                    case "topRight":
                        if (overflow)
                            promptleftPosition += fieldWidth - 30;
                        else {
                            promptleftPosition += fieldWidth - 30;
                            promptTopPosition += -promptHeight;
                        }
                        break;
                    case "topLeft":
                        promptTopPosition += -promptHeight - 0;
                        break;
                    case "centerRight":
                        promptleftPosition += fieldWidth + 13;
                        break;
                    case "bottomLeft":
                        promptTopPosition = promptTopPosition + field.height() + 15;
                        break;
                    case "bottomRight":
                        promptleftPosition += fieldWidth - 30;
                        promptTopPosition += field.height() + 5;
                }
                return {
                    "callerTopPosition": promptTopPosition + "px",
                    "callerleftPosition": promptleftPosition + "px",
                    "marginTopSize": marginTopSize + "px"
                };
            },
            _getClassName: function (className) {
                return className.replace(":", "_").replace(".", "_");
            }
        };

        $.fn.validationEngine = function (method) {
            var form = $(this);
            if (!form[0]) return false;
            if (typeof (method) == 'string' && method.charAt(0) != '_' && methods[method]) {
                // make sure init is called once
                if (method != "showPrompt" && method != "hidePrompt" && method != "hide" && method != "hideAll")
                    methods.init.apply(form);
                return methods[method].apply(form, Array.prototype.slice.call(arguments, 1));
            } else {
                methods.init.apply(form, arguments);
                return methods.attach.apply(form);
            }
        };

        $.validationEngine = { defaults: {
            validationEventTrigger: "blur",
            un_validationEventTrigger: "click",
            // Automatically scroll viewport to the first error
            scroll: true,
            //'kissy'
            promptModel: "float",
            // Opening box position, possible locations are: topLeft, topRight, bottomLeft, centerRight, bottomRight
            promptPosition: "centerRight",
            // internal, automatically set to true when it parse a _ajax rule
            inlineAjax: false,
            // if set to true, the form data is sent asynchronously via ajax to the form.action url (get)
            ajaxFormValidation: false,
            // Ajax form validation callback method: boolean onComplete(form, status, errors, options)
            // retuns false if the form.submit event needs to be canceled.
            ajaxFormValidationURL: false,
            // The url to send the submit ajax validation (default to action)
            onAjaxFormComplete: $.noop,
            // called right before the ajax call, may return false to cancel
            onBeforeAjaxFormValidation: $.noop,
            // Stops form from submitting and execute function assiciated with it
            onValidationComplete: false,
            // Used when the form is displayed within a scrolling DIV
            isOverflown: false,
            overflownDIV: "",
            // true when form and fields are binded
            binded: false,
            showArrow: true,
            // did one of the validation fail ? kept global to stop further ajax validations
            isError: false,
            // Caches field validation status, typically only bad status are created.
            // the array is used during ajax form validation to detect issues early and prevent an expensive submit
            ajaxValidCache: {},
            // Auto update prompt position after window resize
            autoPositionUpdate: false,
            // Custom FieldVali Success|Failure Func
            InvalidFields: [],
            onSuccess: false,
            onFailure: false
        }
        };
    }
});