define(function (require, exports, module) {
    //Hack了IE的判断方式，"base.allie = $.browser.msie === void 0 ? false : true;"

    return function (jQuery) {

        /*
        jQuery UI Virtual Keyboard
        Version 1.9.12

        Author: Jeremy Satterfield
        Modified: Rob Garrison (Mottie on github)
        -----------------------------------------
        Licensed under the MIT License

        Caret code from jquery.caret.1.02.js
        Licensed under the MIT License:
        http://www.opensource.org/licenses/mit-license.php
        -----------------------------------------

        An on-screen virtual keyboard embedded within the browser window which
        will popup when a specified entry field is focused. The user can then
        type and preview their input before Accepting or Canceling.

        As a plugin to jQuery UI styling and theme will automatically
        match that used by jQuery UI with the exception of the required
        CSS listed below.

        Requires:
        jQuery
        jQuery UI (position utility only) & CSS

        Usage:
        $('input[type=text], input[type=password], textarea')
        .keyboard({
        layout:"qwerty",
        customLayout: {
        'default': [
        "q w e r t y {bksp}",
        "s a m p l e {shift}",
        "{accept} {space} {cancel}"
        ],
        'shift' : [
        "Q W E R T Y {bksp}",
        "S A M P L E {shift}",
        "{accept} {space} {cancel}"
        ]
        }
        });

        Options:
        layout
        [String] specify which keyboard layout to use
        qwerty - Standard QWERTY layout (Default)
        international - US international layout
        alpha  - Alphabetical layout
        dvorak - Dvorak Simplified layout
        num    - Numerical (ten-key) layout
        custom - Uses a custom layout as defined by the customLayout option

        customLayout
        [Object] Specify a custom layout
        An Object containing a set of key:value pairs, each key is a keyset.
        The key can be one to four rows (default, shifted, alt and alt-shift) or any number of meta key sets (meta1, meta2, etc).
        The value is an array with string elements of which each defines a new keyboard row.
        Each string element must have each character or key seperated by a space.
        To include an action key, select the desired one from the list below, or define your own by adding it to the $.keyboard.keyaction variable
        In the list below where two special/"Action" keys are shown, both keys have the same action but different appearances (abbreviated/full name keys).
        Special/"Action" keys include:
        {a}, {accept} - Updates element value and closes keyboard
        {alt},{altgr} - AltGr for International keyboard
        {b}, {bksp}   - Backspace
        {c}, {cancel} - Clears changes and closes keyboard
        {clear}       - Clear input window - used in num pad
        {combo}       - Toggle combo (diacritic) key
        {dec}         - Decimal for numeric entry, only allows one decimal (optional use in num pad)
        {e}, {enter}  - Return/New Line
        {lock}        - Caps lock key
        {meta#}       - Meta keys that change the key set (# can be any integer)
        {s}, {shift}  - Shift
        {sign}        - Change sign of numeric entry (positive or negative)
        {sp:#}        - Replace # with a numerical value, adds blank space, value of 1 ~ width of one key
        {space}       - Spacebar
        {t}, {tab}    - Tab

        CSS:
        .ui-keyboard { padding: .3em; position: absolute; left: 0; top: 0; z-index: 16000; }
        .ui-keyboard-has-focus { z-index: 16001; }
        .ui-keyboard div { font-size: 1.1em; }
        .ui-keyboard-button { height: 2em; width: 2em; margin: .1em; cursor: pointer; overflow: hidden; line-height: 2em; }
        .ui-keyboard-button span { padding: 0; margin: 0; white-space:nowrap; }
        .ui-keyboard-button-endrow { clear: left; }
        .ui-keyboard-widekey { width: 4em; }
        .ui-keyboard-space { width: 15em; text-indent: -999em; }
        .ui-keyboard-preview-wrapper { text-align: center; }
        .ui-keyboard-preview { text-align: left; margin: 0 0 3px 0; display: inline; width: 99%;} - width is calculated in IE, since 99% = 99% full browser width
        .ui-keyboard-keyset { text-align: center; }
        .ui-keyboard-input { text-align: left; }
        .ui-keyboard-input-current { -moz-box-shadow: 1px 1px 10px #00f; -webkit-box-shadow: 1px 1px 10px #00f; box-shadow: 1px 1px 10px #00f; }
        .ui-keyboard-placeholder { color: #888; }
        .ui-keyboard-nokeyboard { color: #888; border-color: #888; } - disabled or readonly inputs, or use input[disabled='disabled'] { color: #f00; }
        */

        (function ($) {
            $.keyboard = function (el, options) {
                var base = this, o;

                // Access to jQuery and DOM versions of element
                base.$el = $(el);
                base.el = el;

                // Add a reverse reference to the DOM object
                base.$el.data("keyboard", base);

                base.init = function () {
                    base.options = o = $.extend(true, {}, $.keyboard.defaultOptions, options);

                    // Shift and Alt key toggles, sets is true if a layout has more than one keyset - used for mousewheel message
                    base.shiftActive = base.altActive = base.metaActive = base.sets = base.capsLock = false;
                    base.lastKeyset = [false, false, false]; // [shift, alt, meta]
                    // Class names of the basic key set - meta keysets are handled by the keyname
                    base.rows = ['', '-shift', '-alt', '-alt-shift'];
                    base.acceptedKeys = [];
                    base.mappedKeys = {}; // for remapping manually typed in keys

                    //IE6 has bug for this:
                    //$('<!--[if lte IE 8]><script>jQuery("body").addClass("oldie");</script><![endif]--><!--[if IE]><script>jQuery("body").addClass("ie");</script><![endif]-->').appendTo('body').remove();
                    base.allie = $.browser.msie === void 0 ? false : true;
                    base.msie = base.allie && parseInt($.browser.version) < 9; // Old IE flag, used for caret positioning

                    base.inPlaceholder = base.$el.attr('placeholder') || '';
                    base.watermark = (typeof (document.createElement('input').placeholder) !== 'undefined' && base.inPlaceholder !== ''); // html 5 placeholder/watermark
                    base.regex = $.keyboard.comboRegex; // save default regex (in case loading another layout changes it)
                    base.decimal = (/^\./.test(o.display.dec)) ? true : false; // determine if US "." or European "," system being used
                    base.repeatTime = 1000 / o.repeatRate; // convert mouse repeater rate (characters per second) into a time in milliseconds.

                    // Check if caret position is saved when input is hidden or loses focus
                    // (*cough* all versions of IE and I think Opera has/had an issue as well
                    base.temp = $('<input style="position:absolute;left:-9999em;top:-9999em;" type="text" value="testing">').appendTo('body').caret(3, 3);
                    // Also save caret position of the input if it is locked
                    base.checkCaret = (o.lockInput || base.temp.hide().show().caret().start !== 3) ? true : false;
                    base.temp.remove();
                    base.lastCaret = { start: 0, end: 0 };

                    base.temp = ['', 0, 0]; // used when building the keyboard - [keyset element, row, index]

                    // Bind events
                    $.each('initialized visible change hidden canceled accepted beforeClose'.split(' '), function (i, f) {
                        if ($.isFunction(o[f])) {
                            base.$el.bind(f + '.keyboard', o[f]);
                        }
                    });

                    // Close with esc key & clicking outside
                    if (o.alwaysOpen) { o.stayOpen = true; }
                    if (!o.stayOpen) {
                        $(document).bind('mousedown.keyboard keyup.keyboard', function (e) {
                            base.escClose(e);
                        });
                    }

                    // Display keyboard on focus
                    base.$el
			.addClass('ui-keyboard-input ' + o.css.input)
			.attr({ 'aria-haspopup': 'true', 'role': 'textbox' });
                    // add disabled/readonly class - dynamically updated on reveal
                    if (base.$el.is(':disabled') || base.$el.attr('readonly')) {
                        base.$el.addClass('ui-keyboard-nokeyboard');
                    }
                    if (o.openOn) {
                        base.$el.bind(o.openOn + '.keyboard', function () {
                            base.focusOn();
                        });
                    }

                    // Add placeholder if not supported by the browser
                    if (!base.watermark && base.$el.val() === '' && base.inPlaceholder !== '' && base.$el.attr('placeholder') !== '') {
                        base.$el
				.addClass('ui-keyboard-placeholder') // css watermark style (darker text)
				.val(base.inPlaceholder);
                    }

                    base.$el.trigger('initialized.keyboard', [base, base.el]);

                    // initialized with keyboard open
                    if (o.alwaysOpen) {
                        base.reveal();
                    }

                };

                base.focusOn = function () {
                    if (base.$el.is(':visible')) {
                        // caret position is always 0,0 in webkit; and nothing is focused at this point... odd
                        // save caret position in the input to transfer it to the preview
                        base.lastCaret = base.$el.caret();
                    }
                    if (!base.isVisible || o.alwaysOpen) {
                        clearTimeout(base.timer);
                        base.reveal();
                        setTimeout(function () { base.$preview.focus(); }, 100);
                    }
                };

                base.reveal = function () {
                    // close all keyboards
                    $('.ui-keyboard:not(.ui-keyboard-always-open)').hide();
                    // ui-keyboard-has-focus is applied in case multiple keyboards have alwaysOpen = true and are stacked
                    $('.ui-keyboard-has-focus').removeClass('ui-keyboard-has-focus');
                    $('.ui-keyboard-input-current').removeClass('ui-keyboard-input-current');

                    // Don't open if disabled
                    if (base.$el.is(':disabled') || base.$el.attr('readonly')) {
                        base.$el.addClass('ui-keyboard-nokeyboard');
                        return;
                    } else {
                        base.$el.removeClass('ui-keyboard-nokeyboard');
                    }

                    // Unbind focus to prevent recursion - openOn may be empty if keyboard is opened externally
                    if (!o.usePreview) { base.$el.unbind((o.openOn) ? o.openOn + '.keyboard' : ''); }

                    // build keyboard if it doesn't exist
                    if (typeof (base.$keyboard) === 'undefined') { base.startup(); }

                    // clear watermark
                    if (!base.watermark && base.el.value === base.inPlaceholder) {
                        base.$el
				.removeClass('ui-keyboard-placeholder')
				.val('');
                    }
                    // save starting content, in case we cancel
                    base.originalContent = base.$el.val();
                    base.$preview.val(base.originalContent);

                    // disable/enable accept button
                    if (o.acceptValid) { base.checkValid(); }

                    // get single target position || target stored in element data (multiple targets) || default, at the element
                    var p, s, position = o.position;
                    position.of = position.of || base.$el.data('keyboardPosition') || base.$el;
                    position.collision = (o.usePreview) ? position.collision || 'fit fit' : 'flip flip';

                    base.$el.addClass('ui-keyboard-input-current');
                    base.isCurrent = true;

                    // show & position keyboard
                    base.$keyboard
                    // basic positioning before it is set by position utility
			.css({ position: 'absolute', left: 0, top: 0 })
			.addClass('ui-keyboard-has-focus')
			.show();

                    // adjust keyboard preview window width - save width so IE won't keep expanding (fix issue #6)
                    if (o.usePreview && base.msie) {
                        if (typeof base.width === 'undefined') {
                            base.$preview.hide(); // preview is 100% browser width in IE7, so hide the damn thing
                            base.width = Math.ceil(base.$keyboard.width()); // set input width to match the widest keyboard row
                            base.$preview.show();
                        }
                        base.$preview.width(base.width);
                    }

                    base.$keyboard.position(position); // position after keyboard is visible (required for UI position utility) and appropriately sized (*cough*)

                    $(window).resize(function () {
                        if (base.isVisible) {
                            base.$keyboard.position(position);
                        }
                    });

                    base.$preview.focus();
                    base.isVisible = true;

                    base.checkDecimal();

                    // get preview area line height
                    // add roughly 4px to get line height from font height, works well for font-sizes from 14-36px - needed for textareas
                    base.lineHeight = parseInt(base.$preview.css('lineHeight'), 10) || parseInt(base.$preview.css('font-size'), 10) + 4;

                    // IE caret haxx0rs
                    if (base.allie) {
                        // ensure caret is at the end of the text (needed for IE)
                        s = base.lastCaret.start || base.originalContent.length;
                        p = { start: s, end: s };
                        if (!base.lastCaret) { base.lastCaret = p; } // set caret at end of content, if undefined
                        if (base.lastCaret.end === 0 && base.lastCaret.start > 0) { base.lastCaret.end = base.lastCaret.start; } // sometimes end = 0 while start is > 0
                        if (base.lastCaret.start < 0) { base.lastCaret = p; } // IE will have start -1, end of 0 when not focused (see demo: http://jsfiddle.net/Mottie/fgryQ/3/).
                    }
                    base.$preview.caret(base.lastCaret.start, base.lastCaret.end);

                    base.$el.trigger('visible.keyboard', [base, base.el]);
                    return base;
                };

                base.startup = function () {
                    base.$keyboard = base.buildKeyboard();
                    base.$allKeys = base.$keyboard.find('button.ui-keyboard-button');
                    base.$preview = (o.usePreview) ? base.$keyboard.find('.ui-keyboard-preview') : base.$el;
                    base.preview = base.$preview[0];
                    base.$decBtn = base.$keyboard.find('.ui-keyboard-dec');
                    base.wheel = $.isFunction($.fn.mousewheel); // is mousewheel plugin loaded?
                    // keyCode of keys always allowed to be typed - caps lock, page up & down, end, home, arrow, insert & delete keys
                    base.alwaysAllowed = [20, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];
                    if (o.enterNavigation) { base.alwaysAllowed.push(13); } // add enter to allowed keys
                    base.$preview
			.bind('keypress.keyboard', function (e) {
			    var k = String.fromCharCode(e.charCode || e.which);
			    if (base.checkCaret) { base.lastCaret = base.$preview.caret(); }

			    // update caps lock - can only do this while typing =(
			    base.capsLock = (((k >= 65 && k <= 90) && !e.shiftKey) || ((k >= 97 && k <= 122) && e.shiftKey)) ? true : false;

			    // restrict input - keyCode in keypress special keys: see http://www.asquare.net/javascript/tests/KeyCode.html
			    if (o.restrictInput) {
			        // allow navigation keys to work - Chrome doesn't fire a keypress event (8 = bksp)
			        if ((e.which === 8 || e.which === 0) && $.inArray(e.keyCode, base.alwaysAllowed)) { return; }
			        if ($.inArray(k, base.acceptedKeys) === -1) { e.preventDefault(); } // quick key check
			    } else if ((e.ctrlKey || e.metaKey) && (e.which === 97 || e.which === 99 || e.which === 118 || (e.which >= 120 && e.which <= 122))) {
			        // Allow select all (ctrl-a:97), copy (ctrl-c:99), paste (ctrl-v:118) & cut (ctrl-x:120) & redo (ctrl-y:121)& undo (ctrl-z:122); meta key for mac
			        return;
			    }
			    // Mapped Keys - allows typing on a regular keyboard and the mapped key is entered
			    // Set up a key in the layout as follows: "m(a):label"; m = key to map, (a) = actual keyboard key to map to (optional), ":label" = title/tooltip (optional)
			    // example: \u0391 or \u0391(A) or \u0391:alpha or \u0391(A):alpha
			    if (base.hasMappedKeys) {
			        if (base.mappedKeys.hasOwnProperty(k)) {
			            base.insertText(base.mappedKeys[k]);
			            e.preventDefault();
			        }
			    }
			    base.checkMaxLength();

			})
			.bind('keyup.keyboard', function (e) {
			    switch (e.which) {
			        // Insert tab key       
			        case 9:
			            // Added a flag to prevent from tabbing into an input, keyboard opening, then adding the tab to the keyboard preview
			            // area on keyup. Sadly it still happens if you don't release the tab key immediately because keydown event auto-repeats
			            if (base.tab && !o.lockInput) {
			                $.keyboard.keyaction.tab(base);
			                base.tab = false;
			            } else {
			                e.preventDefault();
			            }
			            break;

			        // Escape will hide the keyboard       
			        case 27:
			            base.close();
			            return false;
			    }

			    // throttle the check combo function because fast typers will have an incorrectly positioned caret
			    clearTimeout(base.throttled);
			    base.throttled = setTimeout(function () {
			        base.checkCombos();
			    }, 100);

			    base.checkMaxLength();
			    base.$el.trigger('change.keyboard', [base, base.el]);
			})
			.bind('keydown.keyboard', function (e) {
			    switch (e.which) {
			        // prevent tab key from leaving the preview window       
			        case 9:
			            if (o.tabNavigation) {
			                base.close(o.autoAccept);
			                // allow tab to pass through - tab to next input/shift-tab for prev
			                return;
			            } else {
			                base.tab = true; // see keyup comment above
			                return false;
			            }

			        case 13:
			            $.keyboard.keyaction.enter(base, null, e);
			            break;

			        // Show capsLock       
			        case 20:
			            base.shiftActive = base.capsLock = !base.capsLock;
			            base.showKeySet(this);
			            break;

			        case 86:
			            // prevent ctrl-v/cmd-v
			            if (e.ctrlKey || e.metaKey) {
			                if (o.preventPaste) { e.preventDefault(); return; }
			                base.checkCombos(); // check pasted content
			            }
			            break;
			    }
			})
			.bind('mouseup.keyboard', function () {
			    if (base.checkCaret) { base.lastCaret = base.$preview.caret(); }
			})
			.bind('blur.keyboard', function (e) {
			    // when keyboard is always open, make sure base.close is called on blur
			    if (o.alwaysOpen && base.isCurrent && !base.$el.hasClass('ui-keyboard-input-current')) {
			        clearTimeout(base.timer);
			        base.timer = setTimeout(function () {
			            if (base.isCurrent && !base.$el.hasClass('ui-keyboard-input-current')) {
			                base.close(o.autoAccept);
			            }
			        }, 300);
			        return false;
			    }
			});

                    // If preventing paste, block context menu (right click)
                    if (o.preventPaste) {
                        base.$preview.bind('contextmenu.keyboard', function (e) { e.preventDefault(); });
                        base.$el.bind('contextmenu.keyboard', function (e) { e.preventDefault(); });
                    }

                    if (o.appendLocally) {
                        base.$el.after(base.$keyboard);
                    } else {
                        base.$keyboard.appendTo('body');
                    }

                    base.$allKeys
			.bind(o.keyBinding.split(' ').join('.keyboard ') + '.keyboard repeater.keyboard', function (e) {
			    // 'key', { action: doAction, original: n, curTxt : n, curNum: 0 }
			    var txt, key = $.data(this, 'key'), action = key.action.split(':')[0];
			    base.$preview.focus();
			    // Start caret in IE when not focused (happens with each virtual keyboard button click
			    if (base.checkCaret) { base.$preview.caret(base.lastCaret.start, base.lastCaret.end); }
			    if (action.match('meta')) { action = 'meta'; }
			    if ($.keyboard.keyaction.hasOwnProperty(action) && $(this).hasClass('ui-keyboard-actionkey')) {
			        // stop processing if action returns false (close & cancel)
			        if ($.keyboard.keyaction[action](base, this, e) === false) { return; }
			    } else if (typeof key.action !== 'undefined') {
			        txt = (base.wheel && !$(this).hasClass('ui-keyboard-actionkey')) ? key.curTxt : key.action;
			        base.insertText(txt);
			        if (!base.capsLock && !o.stickyShift && !e.shiftKey) {
			            base.shiftActive = false;
			            base.showKeySet(this);
			        }
			    }
			    base.checkCombos();
			    base.checkMaxLength();
			    base.$el.trigger('change.keyboard', [base, base.el]);
			    base.$preview.focus();
			    e.preventDefault();
			})
                    // Change hover class and tooltip
			.bind('mouseenter.keyboard mouseleave.keyboard', function (e) {
			    var el = this, $this = $(this),
			    // 'key' = { action: doAction, original: n, curTxt : n, curNum: 0 }
					key = $.data(el, 'key');
			    if (e.type === 'mouseenter' && base.el.type !== 'password') {
			        $this
						.addClass(o.css.buttonHover)
						.attr('title', function (i, t) {
						    // show mouse wheel message
						    return (base.wheel && t === '' && base.sets) ? o.wheelMessage : t;
						});
			    }
			    if (e.type === 'mouseleave') {
			        key.curTxt = key.original;
			        key.curNum = 0;
			        $.data(el, 'key', key);
			        $this
						.removeClass((base.el.type === 'password') ? '' : o.css.buttonHover) // needed or IE flickers really bad
						.attr('title', function (i, t) { return (t === o.wheelMessage) ? '' : t; })
						.find('span').text(key.original); // restore original button text
			    }
			})
                    // Allow mousewheel to scroll through other key sets of the same key
			.bind('mousewheel.keyboard', function (e, delta) {
			    if (base.wheel) {
			        var txt, $this = $(this), key = $.data(this, 'key');
			        txt = key.layers || base.getLayers($this);
			        key.curNum += (delta > 0) ? -1 : 1;
			        if (key.curNum > txt.length - 1) { key.curNum = 0; }
			        if (key.curNum < 0) { key.curNum = txt.length - 1; }
			        key.layers = txt;
			        key.curTxt = txt[key.curNum];
			        $.data(this, 'key', key);
			        $this.find('span').text(txt[key.curNum]);
			        return false;
			    }
			})
                    // using "kb" namespace for mouse repeat functionality to keep it separate
                    // I need to trigger a "repeater.keyboard" to make it work
			.bind('mouseup.keyboard mouseleave.kb touchend.kb touchmove.kb touchcancel.kb', function () {
			    if (base.isVisible) { base.$preview.focus(); }
			    base.mouseRepeat = [false, ''];
			    return false;
			})
                    // no mouse repeat for action keys (shift, ctrl, alt, meta, etc)
			.filter(':not(.ui-keyboard-actionkey)')
                    // mouse repeated action key exceptions
			.add('.ui-keyboard-tab, .ui-keyboard-bksp, .ui-keyboard-space, .ui-keyboard-enter', base.$keyboard)
			.bind('mousedown.kb touchstart.kb', function () {
			    var key = $(this);
			    base.mouseRepeat = [true, key]; // save the key, make sure we are repeating the right one (fast typers)
			    setTimeout(function () {
			        if (base.mouseRepeat[0] && base.mouseRepeat[1] === key) { base.repeatKey(key); }
			    }, o.repeatDelay);
			    return false;
			});

                };

                // Insert text at caret/selection - thanks to Derek Wickwire for fixing this up!
                base.insertText = function (txt) {
                    var bksp, t, h,
                    // use base.$preview.val() instead of base.preview.value (val.length includes carriage returns in IE).
			val = base.$preview.val(),
			pos = base.$preview.caret(),
			scrL = base.$preview.scrollLeft(),
			scrT = base.$preview.scrollTop(),
			len = val.length; // save original content length

                    // silly IE caret hacks... it should work correctly, but navigating using arrow keys in a textarea is still difficult
                    if (pos.end < pos.start) { pos.end = pos.start; } // in IE, pos.end can be zero after input loses focus
                    if (pos.start > len) { pos.end = pos.start = len; }

                    if (base.preview.tagName === 'TEXTAREA') {
                        // This makes sure the caret moves to the next line after clicking on enter (manual typing works fine)
                        if (base.msie && val.substr(pos.start, 1) === '\n') { pos.start += 1; pos.end += 1; }
                        // Set scroll top so current text is in view - needed for virtual keyboard typing, not manual typing
                        // this doesn't appear to work correctly in Opera
                        h = (val.split('\n').length - 1);
                        base.preview.scrollTop = (h > 0) ? base.lineHeight * h : scrT;
                    }

                    bksp = (txt === 'bksp' && pos.start === pos.end) ? true : false;
                    txt = (txt === 'bksp') ? '' : txt;
                    t = pos.start + (bksp ? -1 : txt.length);
                    scrL += parseInt(base.$preview.css('fontSize'), 10) * (txt === 'bksp' ? -1 : 1);

                    base.$preview
			.val(base.$preview.val().substr(0, pos.start - (bksp ? 1 : 0)) + txt + base.$preview.val().substr(pos.end))
			.caret(t, t)
			.scrollLeft(scrL);

                    if (base.checkCaret) { base.lastCaret = { start: t, end: t }; } // save caret in case of bksp

                };

                // check max length
                base.checkMaxLength = function () {
                    var t, p = base.$preview.val();
                    if (o.maxLength !== false && p.length > o.maxLength) {
                        t = Math.min(base.$preview.caret().start, o.maxLength);
                        base.$preview.val(p.substring(0, o.maxLength));
                        // restore caret on change, otherwise it ends up at the end.
                        base.$preview.caret(t, t);
                        base.lastCaret = { start: t, end: t };
                    }
                    if (base.$decBtn.length) {
                        base.checkDecimal();
                    }
                };

                // mousedown repeater
                base.repeatKey = function (key) {
                    key.trigger('repeater.keyboard');
                    if (base.mouseRepeat[0]) {
                        setTimeout(function () {
                            base.repeatKey(key);
                        }, base.repeatTime);
                    }
                };

                base.showKeySet = function (el) {
                    var key = '',
		toShow = (base.shiftActive ? 1 : 0) + (base.altActive ? 2 : 0);
                    if (!base.shiftActive) { base.capsLock = false; }
                    // check meta key set
                    if (base.metaActive) {
                        // the name attribute contains the meta set # "meta99"
                        key = (el && el.name && /meta/.test(el.name)) ? el.name : '';
                        // save active meta keyset name
                        if (key === '') {
                            key = (base.metaActive === true) ? '' : base.metaActive;
                        } else {
                            base.metaActive = key;
                        }
                        // if meta keyset doesn't have a shift or alt keyset, then show just the meta key set
                        if ((!o.stickyShift && base.lastKeyset[2] !== base.metaActive) ||
				((base.shiftActive || base.altActive) && !base.$keyboard.find('.ui-keyboard-keyset-' + key + base.rows[toShow]).length)) {
                            base.shiftActive = base.altActive = false;
                        }
                    } else if (!o.stickyShift && base.lastKeyset[2] !== base.metaActive && base.shiftActive) {
                        // switching from meta key set back to default, reset shift & alt if using stickyShift
                        base.shiftActive = base.altActive = false;
                    }
                    toShow = (base.shiftActive ? 1 : 0) + (base.altActive ? 2 : 0);
                    key = (toShow === 0 && !base.metaActive) ? '-default' : (key === '') ? '' : '-' + key;
                    if (!base.$keyboard.find('.ui-keyboard-keyset' + key + base.rows[toShow]).length) {
                        // keyset doesn't exist, so restore last keyset settings
                        base.shiftActive = base.lastKeyset[0];
                        base.altActive = base.lastKeyset[1];
                        base.metaActive = base.lastKeyset[2];
                        return;
                    }
                    base.$keyboard
			.find('.ui-keyboard-alt, .ui-keyboard-shift, .ui-keyboard-actionkey[class*=meta]').removeClass(o.css.buttonAction).end()
			.find('.ui-keyboard-alt')[(base.altActive) ? 'addClass' : 'removeClass'](o.css.buttonAction).end()
			.find('.ui-keyboard-shift')[(base.shiftActive) ? 'addClass' : 'removeClass'](o.css.buttonAction).end()
			.find('.ui-keyboard-lock')[(base.capsLock) ? 'addClass' : 'removeClass'](o.css.buttonAction).end()
			.find('.ui-keyboard-keyset').hide().end()
			.find('.ui-keyboard-keyset' + key + base.rows[toShow]).show().end()
			.find('.ui-keyboard-actionkey.ui-keyboard' + key).addClass(o.css.buttonAction);
                    base.lastKeyset = [base.shiftActive, base.altActive, base.metaActive];
                };

                // check for key combos (dead keys)
                base.checkCombos = function () {
                    var i, r, t, t2,
                    // use base.$preview.val() instead of base.preview.value (val.length includes carriage returns in IE).
			val = base.$preview.val(),
			pos = base.$preview.caret(),
			len = val.length; // save original content length

                    // silly IE caret hacks... it should work correctly, but navigating using arrow keys in a textarea is still difficult
                    if (pos.end < pos.start) { pos.end = pos.start; } // in IE, pos.end can be zero after input loses focus
                    if (pos.start > len) { pos.end = pos.start = len; }
                    // This makes sure the caret moves to the next line after clicking on enter (manual typing works fine)
                    if (base.msie && val.substr(pos.start, 1) === '\n') { pos.start += 1; pos.end += 1; }

                    if (o.useCombos) {
                        // keep 'a' and 'o' in the regex for ae and oe ligature (æ,œ)
                        // thanks to KennyTM: http://stackoverflow.com/questions/4275077/replace-characters-to-make-international-letters-diacritics
                        // original regex /([`\'~\^\"ao])([a-z])/mig moved to $.keyboard.comboRegex
                        val = val.replace(base.regex, function (s, accent, letter) {
                            return (o.combos.hasOwnProperty(accent)) ? o.combos[accent][letter] || s : s;
                        });
                    }

                    // check input restrictions - in case content was pasted
                    if (o.restrictInput && val !== '') {
                        t = val;
                        r = base.acceptedKeys.length;
                        for (i = 0; i < r; i++) {
                            if (t === '') { continue; }
                            t2 = base.acceptedKeys[i];
                            if (val.indexOf(t2) >= 0) {
                                // escape out all special characters
                                if (/[\[|\]|\\|\^|\$|\.|\||\?|\*|\+|\(|\)|\{|\}]/g.test(t2)) { t2 = '\\' + t2; }
                                t = t.replace((new RegExp(t2, "g")), '');
                            }
                        }
                        // what's left over are keys that aren't in the acceptedKeys array
                        if (t !== '') { val = val.replace(t, ''); }
                    }

                    // save changes, then reposition caret
                    pos.start += val.length - len;
                    pos.end += val.length - len;
                    base.$preview.val(val);

                    base.$preview.caret(pos.start, pos.end);

                    // calculate current cursor scroll location and set scrolltop to keep it in view
                    base.preview.scrollTop = base.lineHeight * (val.substring(0, pos.start).split('\n').length - 1); // find row, multiply by font-size

                    base.lastCaret = { start: pos.start, end: pos.end };

                    if (o.acceptValid) { base.checkValid(); }

                    return val; // return text, used for keyboard closing section
                };

                // Toggle accept button if validating
                base.checkValid = function () {
                    var valid = true;
                    if (o.validate && typeof o.validate === "function") {
                        valid = o.validate(base, base.$preview.val(), false);
                    }
                    // toggle accept button, "disabled" class defined in the css
                    base.$keyboard.find('.ui-keyboard-accept')
			[valid ? 'removeClass' : 'addClass']('disabled')
			[valid ? 'removeAttr' : 'attr']('disabled', 'disabled')
			.attr('aria-disabled', !valid);
                };

                // Decimal button for num pad - only allow one (not used by default)
                base.checkDecimal = function () {
                    // Check US "." or European "," format
                    if ((base.decimal && /\./g.test(base.preview.value)) || (!base.decimal && /\,/g.test(base.preview.value))) {
                        base.$decBtn
				.attr({ 'disabled': 'disabled', 'aria-disabled': 'true' })
				.removeClass(o.css.buttonDefault + ' ' + o.css.buttonHover)
				.addClass(o.css.buttonDisabled);
                    } else {
                        base.$decBtn
				.removeAttr('disabled')
				.attr({ 'aria-disabled': 'false' })
				.addClass(o.css.buttonDefault)
				.removeClass(o.css.buttonDisabled);
                    }
                };

                // get other layer values for a specific key
                base.getLayers = function (el) {
                    var key, keys;
                    key = el.attr('data-pos');
                    keys = el.closest('.ui-keyboard').find('button[data-pos="' + key + '"]').map(function () {
                        // added '> span' because jQuery mobile adds multiple spans inside the button
                        return $(this).find('> span').text();
                    }).get();
                    return keys;
                };

                // Go to next or prev inputs
                // goToNext = true, then go to next input; if false go to prev
                // isAccepted is from autoAccept option or true if user presses shift-enter
                base.switchInput = function (goToNext, isAccepted) {
                    if (typeof o.switchInput === "function") {
                        o.switchInput(base, goToNext, isAccepted);
                    } else {
                        base.close(isAccepted);
                        var all = $('.ui-keyboard-input:not(.ui-keyboard-preview)'),
				indx = all.index(base.$el) + (goToNext ? 1 : -1);
                        if (indx > all.length - 1) { indx = 0; } // go to first input
                        all.eq(indx).focus();
                    }
                    return false;
                };

                // Close the keyboard, if visible. Pass a status of true, if the content was accepted (for the event trigger).
                base.close = function (accepted) {
                    if (base.isVisible) {
                        clearTimeout(base.throttled);
                        base.isCurrent = false;
                        var val = (accepted) ? base.checkCombos() : base.originalContent;
                        // validate input if accepted
                        if (accepted && o.validate && typeof (o.validate) === "function" && !o.validate(base, val, true)) { return; }
                        base.$el
				.removeClass('ui-keyboard-input-current')
				.trigger((o.alwaysOpen) ? '' : 'beforeClose.keyboard', [base, base.el, (accepted || false)])
				.val(val)
				.scrollTop(base.el.scrollHeight)
				.trigger(((accepted || false) ? 'accepted.keyboard' : 'canceled.keyboard'), [base, base.el])
				.trigger((o.alwaysOpen) ? 'inactive.keyboard' : 'hidden.keyboard', [base, base.el]);
                        if (!o.usePreview && o.openOn !== '') {
                            // rebind input focus
                            base.$el.bind(o.openOn + '.keyboard', function () { base.focusOn(); });
                        }
                        if (!o.alwaysOpen) {
                            base.$keyboard.hide();
                            base.isVisible = false;
                        }
                        if (!base.watermark && base.el.value === '' && base.inPlaceholder !== '') {
                            base.$el
					.addClass('ui-keyboard-placeholder')
					.val(base.inPlaceholder);
                        }
                    }
                    return false;
                };

                base.accept = function () {
                    base.close(true);
                };

                base.escClose = function (e) {
                    if (!base.isVisible) { return; }
                    // ignore autoaccept if using escape - good idea?
                    if (e.type === 'keyup' && e.which === 27) { base.close(); }
                    if (e.type === 'mousedown' && (e.target !== base.el && $(e.target).closest('.ui-keyboard')[0] !== base.$keyboard[0])) {
                        // stop propogation in IE - an input getting focus doesn't open a keyboard if one is already open
                        if (base.allie) {
                            e.preventDefault();
                        }
                        base.close(o.autoAccept);
                    }
                };

                // Build default button
                base.keyBtn = $('<button />')
		.attr({ 'role': 'button', 'aria-disabled': 'false', 'tabindex': '-1' })
		.addClass('ui-keyboard-button');

                // Add key function
                // keyName = the name of the function called in $.keyboard.keyaction when the button is clicked
                // name = name added to key, or cross-referenced in the display options
                // newSet = keyset to attach the new button
                // regKey = true when it is not an action key
                base.addKey = function (keyName, name, regKey) {
                    var t, keyType, m, map, nm,
			n = (regKey === true) ? keyName : o.display[name] || keyName,
			kn = (regKey === true) ? keyName.charCodeAt(0) : keyName;
                    // map defined keys - format "key(A):Label_for_key"
                    // "key" = key that is seen (can any character; but it might need to be escaped using "\" or entered as unicode "\u####"
                    // "(A)" = the actual key on the real keyboard to remap, ":Label_for_key" ends up in the title/tooltip
                    if (/\(.+\)/.test(n)) { // n = "\u0391(A):alpha"
                        map = n.replace(/\(([^()]+)\)/, ''); // remove "(A)", left with "\u0391:alpha"
                        m = n.match(/\(([^()]+)\)/)[1]; // extract "A" from "(A)"
                        n = map;
                        nm = map.split(':');
                        map = (nm[0] !== '' && nm.length > 1) ? nm[0] : map; // get "\u0391" from "\u0391:alpha"
                        base.mappedKeys[m] = map;
                    }

                    // find key label
                    nm = n.split(':');
                    if (nm[0] === '' && nm[1] === '') { n = ':'; } // corner case of ":(:):;" reduced to "::;", split as ["", "", ";"]
                    n = (nm[0] !== '' && nm.length > 1) ? $.trim(nm[0]) : n;
                    t = (nm.length > 1) ? $.trim(nm[1]).replace(/_/g, " ") || '' : ''; // added to title

                    // Action keys will have the 'ui-keyboard-actionkey' class
                    // '\u2190'.length = 1 because the unicode is converted, so if more than one character, add the wide class
                    keyType = (n.length > 1) ? ' ui-keyboard-widekey' : '';
                    keyType += (regKey) ? '' : ' ui-keyboard-actionkey';
                    return base.keyBtn
			.clone()
			.attr({ 'data-value': n, 'name': kn, 'data-pos': base.temp[1] + ',' + base.temp[2], 'title': t })
			.data('key', { action: keyName, original: n, curTxt: n, curNum: 0 })
                    // add "ui-keyboard-" + keyName, if this is an action key (e.g. "Bksp" will have 'ui-keyboard-bskp' class)
                    // add "ui-keyboard-" + unicode of 1st character (e.g. "~" is a regular key, class = 'ui-keyboard-126' (126 is the unicode value - same as typing &#126;)
			.addClass('ui-keyboard-' + kn + keyType + ' ' + o.css.buttonDefault)
			.html('<span>' + n + '</span>')
			.appendTo(base.temp[0]);
                };

                base.buildKeyboard = function () {
                    var action, row, newSet,
			currentSet, key, keys, margin,
			sets = 0,

		container = $('<div />')
			.addClass('ui-keyboard ' + o.css.container + (o.alwaysOpen ? ' ui-keyboard-always-open' : ''))
			.attr({ 'role': 'textbox' })
			.hide();

                    // build preview display
                    if (o.usePreview) {
                        base.$preview = base.$el.clone(false)
				.removeAttr('id')
				.removeClass('ui-keyboard-placeholder')
				.addClass('ui-keyboard-preview ' + o.css.input)
				.show(); // for hidden inputs
                    } else {
                        // No preview display, use element and reposition the keyboard under it.
                        base.$preview = base.$el;
                        o.position.at = o.position.at2;
                    }
                    base.$preview.attr((o.lockInput) ? { 'readonly': 'readonly'} : {});

                    // build preview container and append preview display
                    if (o.usePreview) {
                        $('<div />')
				.addClass('ui-keyboard-preview-wrapper')
				.append(base.$preview)
				.appendTo(container);
                    }

                    // verify layout or setup custom keyboard
                    if (o.layout === 'custom' || !$.keyboard.layouts.hasOwnProperty(o.layout)) {
                        o.layout = 'custom';
                        $.keyboard.layouts.custom = o.customLayout || { 'default': ['{cancel}'] };
                    }

                    // Main keyboard building loop
                    $.each($.keyboard.layouts[o.layout], function (set, keySet) {
                        if (set !== "") {
                            sets++;
                            newSet = $('<div />')
					.attr('name', set) // added for typing extension
					.addClass('ui-keyboard-keyset ui-keyboard-keyset-' + set)
					.appendTo(container)[(set === 'default') ? 'show' : 'hide']();

                            for (row = 0; row < keySet.length; row++) {

                                // remove extra spaces before spliting (regex probably could be improved)
                                currentSet = $.trim(keySet[row]).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g, '{$1:$2}');
                                keys = currentSet.split(/\s+/);

                                for (key = 0; key < keys.length; key++) {
                                    // used by addKey function
                                    base.temp = [newSet, row, key];

                                    // ignore empty keys
                                    if (keys[key].length === 0) { continue; }

                                    // process here if it's an action key
                                    if (/^\{\S+\}$/.test(keys[key])) {
                                        action = keys[key].match(/^\{(\S+)\}$/)[1].toLowerCase();

                                        // add empty space
                                        if (/^sp:((\d+)?([\.|,]\d+)?)(em|px)?$/.test(action)) {
                                            // not perfect globalization, but allows you to use {sp:1,1em}, {sp:1.2em} or {sp:15px}
                                            margin = parseFloat(action.replace(/,/, '.').match(/^sp:((\d+)?([\.|,]\d+)?)(em|px)?$/)[1] || 0);
                                            $('<span>&nbsp;</span>')
                                            // previously {sp:1} would add 1em margin to each side of a 0 width span
                                            // now Firefox doesn't seem to render 0px dimensions, so now we set the 
                                            // 1em margin x 2 for the width
									.width((action.match('px') ? margin + 'px' : (margin * 2) + 'em'))
									.addClass('ui-keyboard-button ui-keyboard-spacer')
									.appendTo(newSet);
                                        }

                                        // meta keys
                                        if (/^meta\d+\:?(\w+)?/.test(action)) {
                                            base.addKey(action, action);
                                            continue;
                                        }

                                        // switch needed for action keys with multiple names/shortcuts or
                                        // default will catch all others
                                        switch (action) {

                                            case 'a':
                                            case 'accept':
                                                base
										.addKey('accept', action)
										.addClass(o.css.buttonAction);
                                                break;

                                            case 'alt':
                                            case 'altgr':
                                                base.addKey('alt', 'alt');
                                                break;

                                            case 'b':
                                            case 'bksp':
                                                base.addKey('bksp', action);
                                                break;

                                            case 'c':
                                            case 'cancel':
                                                base
										.addKey('cancel', action)
										.addClass(o.css.buttonAction);
                                                break;

                                            // toggle combo/diacritic key       
                                            case 'combo':
                                                base
										.addKey('combo', 'combo')
										.addClass(o.css.buttonAction);
                                                break;

                                            // Decimal - unique decimal point (num pad layout)       
                                            case 'dec':
                                                base.acceptedKeys.push((base.decimal) ? '.' : ',');
                                                base.addKey('dec', 'dec');
                                                break;

                                            case 'e':
                                            case 'enter':
                                                base
										.addKey('enter', action)
										.addClass(o.css.buttonAction);
                                                break;

                                            case 's':
                                            case 'shift':
                                                base.addKey('shift', action);
                                                break;

                                            // Change sign (for num pad layout)       
                                            case 'sign':
                                                base.acceptedKeys.push('-');
                                                base.addKey('sign', 'sign');
                                                break;

                                            case 'space':
                                                base.acceptedKeys.push(' ');
                                                base.addKey('space', 'space');
                                                break;

                                            case 't':
                                            case 'tab':
                                                base.addKey('tab', action);
                                                break;

                                            default:
                                                if ($.keyboard.keyaction.hasOwnProperty(action)) {
                                                    // base.acceptedKeys.push(action);
                                                    base.addKey(action, action);
                                                }

                                        }

                                    } else {

                                        // regular button (not an action key)
                                        base.acceptedKeys.push(keys[key].split(':')[0]);
                                        base.addKey(keys[key], keys[key], true);

                                    }
                                }
                                newSet.find('.ui-keyboard-button:last').after('<br class="ui-keyboard-button-endrow">');
                            }
                        }
                    });

                    if (sets > 1) { base.sets = true; }
                    base.hasMappedKeys = !($.isEmptyObject(base.mappedKeys)); // $.isEmptyObject() requires jQuery 1.4+
                    return container;
                };

                base.destroy = function () {
                    $(document).unbind('mousedown.keyboard keyup.keyboard');
                    if (base.$keyboard) { base.$keyboard.remove(); }
                    var unb = o.openOn + ' accepted beforeClose blur canceled change contextmenu hidden initialized keydown keypress keyup visible'.split(' ').join('.keyboard ');
                    base.$el
			.removeClass('ui-keyboard-input ui-keyboard-placeholder ui-keyboard-notallowed ui-keyboard-always-open ' + o.css.input)
			.removeAttr('aria-haspopup')
			.removeAttr('role')
			.unbind(unb + '.keyboard')
			.removeData('keyboard');
                };

                // Run initializer
                base.init();
            };

            // Action key function list
            $.keyboard.keyaction = {
                accept: function (base) {
                    base.close(true); // same as base.accept();
                    return false;     // return false prevents further processing
                },
                alt: function (base, el) {
                    base.altActive = !base.altActive;
                    base.showKeySet(el);
                },
                bksp: function (base) {
                    base.insertText('bksp'); // the script looks for the "bksp" string and initiates a backspace
                },
                cancel: function (base) {
                    base.close();
                    return false; // return false prevents further processing
                },
                clear: function (base) {
                    base.$preview.val('');
                },
                combo: function (base) {
                    var c = !base.options.useCombos;
                    base.options.useCombos = c;
                    base.$keyboard.find('.ui-keyboard-combo')[(c) ? 'addClass' : 'removeClass'](base.options.css.buttonAction);
                    if (c) { base.checkCombos(); }
                    return false;
                },
                dec: function (base) {
                    base.insertText((base.decimal) ? '.' : ',');
                },
                // el is the pressed key (button) object; it is null when the real keyboard enter is pressed
                enter: function (base, el, e) {
                    var tag = base.el.tagName, o = base.options;
                    // shift-enter in textareas
                    if (e.shiftKey) {
                        // textarea & input - enterMod + shift + enter = accept, then go to prev; base.switchInput(goToNext, autoAccept)
                        // textarea & input - shift + enter = accept (no navigation)
                        return (o.enterNavigation) ? base.switchInput(!e[o.enterMod], true) : base.close(true);
                    }
                    // input only - enterMod + enter to navigate
                    if (o.enterNavigation && (tag !== 'TEXTAREA' || e[o.enterMod])) {
                        return base.switchInput(!e[o.enterMod], o.autoAccept);
                    }
                    // pressing virtual enter button inside of a textarea - add a carriage return
                    // e.target is span when clicking on text and button at other times
                    if (tag === 'TEXTAREA' && $(e.target).closest('button').length) {
                        base.insertText('\n');
                    }
                },
                // caps lock key
                lock: function (base, el) {
                    base.lastKeyset[0] = base.shiftActive = base.capsLock = !base.capsLock;
                    base.showKeySet(el);
                },
                meta: function (base, el) {
                    base.metaActive = ($(el).hasClass(base.options.css.buttonAction)) ? false : true;
                    base.showKeySet(el);
                },
                shift: function (base, el) {
                    base.lastKeyset[0] = base.shiftActive = !base.shiftActive;
                    base.showKeySet(el);
                },
                sign: function (base) {
                    if (/^\-?\d*\.?\d*$/.test(base.$preview.val())) {
                        base.$preview.val((base.$preview.val() * -1));
                    }
                },
                space: function (base) {
                    base.insertText(' ');
                },
                tab: function (base) {
                    if (base.el.tagName === 'INPUT') { return false; } // ignore tab key in input
                    base.insertText('\t');
                }
            };

            // Default keyboard layouts
            $.keyboard.layouts = {
                'alpha': {
                    'default': [
				'` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
				'{tab} a b c d e f g h i j [ ] \\',
				'k l m n o p q r s ; \' {enter}',
				'{shift} t u v w x y z , . / {shift}',
				'{accept} {space} {cancel}'
			],
                    'shift': [
				'~ ! @ # $ % ^ & * ( ) _ + {bksp}',
				'{tab} A B C D E F G H I J { } |',
				'K L M N O P Q R S : " {enter}',
				'{shift} T U V W X Y Z < > ? {shift}',
				'{accept} {space} {cancel}'
			]
                },
                'qwerty': {
                    'default': [
				'` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
				'{tab} q w e r t y u i o p [ ] \\',
				'a s d f g h j k l ; \' {enter}',
				'{shift} z x c v b n m , . / {shift}',
				'{accept} {space} {cancel}'
			],
                    'shift': [
				'~ ! @ # $ % ^ & * ( ) _ + {bksp}',
				'{tab} Q W E R T Y U I O P { } |',
				'A S D F G H J K L : " {enter}',
				'{shift} Z X C V B N M < > ? {shift}',
				'{accept} {space} {cancel}'
			]
                },
                'international': {
                    'default': [
				'` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
				'{tab} q w e r t y u i o p [ ] \\',
				'a s d f g h j k l ; \' {enter}',
				'{shift} z x c v b n m , . / {shift}',
				'{accept} {alt} {space} {alt} {cancel}'
			],
                    'shift': [
				'~ ! @ # $ % ^ & * ( ) _ + {bksp}',
				'{tab} Q W E R T Y U I O P { } |',
				'A S D F G H J K L : " {enter}',
				'{shift} Z X C V B N M < > ? {shift}',
				'{accept} {alt} {space} {alt} {cancel}'
			],
                    'alt': [
				'~ \u00a1 \u00b2 \u00b3 \u00a4 \u20ac \u00bc \u00bd \u00be \u2018 \u2019 \u00a5 \u00d7 {bksp}',
				'{tab} \u00e4 \u00e5 \u00e9 \u00ae \u00fe \u00fc \u00fa \u00ed \u00f3 \u00f6 \u00ab \u00bb \u00ac',
				'\u00e1 \u00df \u00f0 f g h j k \u00f8 \u00b6 \u00b4 {enter}',
				'{shift} \u00e6 x \u00a9 v b \u00f1 \u00b5 \u00e7 > \u00bf {shift}',
				'{accept} {alt} {space} {alt} {cancel}'
			],
                    'alt-shift': [
				'~ \u00b9 \u00b2 \u00b3 \u00a3 \u20ac \u00bc \u00bd \u00be \u2018 \u2019 \u00a5 \u00f7 {bksp}',
				'{tab} \u00c4 \u00c5 \u00c9 \u00ae \u00de \u00dc \u00da \u00cd \u00d3 \u00d6 \u00ab \u00bb \u00a6',
				'\u00c4 \u00a7 \u00d0 F G H J K \u00d8 \u00b0 \u00a8 {enter}',
				'{shift} \u00c6 X \u00a2 V B \u00d1 \u00b5 \u00c7 . \u00bf {shift}',
				'{accept} {alt} {space} {alt} {cancel}'
			]
                },
                'dvorak': {
                    'default': [
				'` 1 2 3 4 5 6 7 8 9 0 [ ] {bksp}',
				'{tab} \' , . p y f g c r l / = \\',
				'a o e u i d h t n s - {enter}',
				'{shift} ; q j k x b m w v z {shift}',
				'{accept} {space} {cancel}'
			],
                    'shift': [
				'~ ! @ # $ % ^ & * ( ) { } {bksp}',
				'{tab} " < > P Y F G C R L ? + |',
				'A O E U I D H T N S _ {enter}',
				'{shift} : Q J K X B M W V Z {shift}',
				'{accept} {space} {cancel}'
			]
                },
                'num': {
                    'default': [
				'= ( ) {b}',
				'{clear} / * -',
				'7 8 9 +',
				'4 5 6 {sign}',
				'1 2 3 %',
				'0 . {a} {c}'
			]
                }
            };

            $.keyboard.defaultOptions = {

                // *** choose layout & positioning ***
                layout: 'qwerty',
                customLayout: null,

                position: {
                    of: null, // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
                    my: 'center top',
                    at: 'center top',
                    at2: 'center bottom' // used when "usePreview" is false (centers the keyboard at the bottom of the input/textarea)
                },

                // preview added above keyboard if true, original input/textarea used if false
                usePreview: true,

                // if true, the keyboard will always be visible
                alwaysOpen: false,

                // if true, keyboard will remain open even if the input loses focus, but closes on escape or when another keyboard opens.
                stayOpen: false,

                // *** change keyboard language & look ***
                display: {
                    'a': '\u2714:Accept (Shift-Enter)', // check mark - same action as accept
                    'accept': 'Accept:Accept (Shift-Enter)',
                    'alt': 'AltGr:Alternate Graphemes',
                    'b': '\u2190:Backspace',    // Left arrow (same as &larr;)
                    'bksp': 'Bksp:Backspace',
                    'c': '\u2716:Cancel (Esc)', // big X, close - same action as cancel
                    'cancel': 'Cancel:Cancel (Esc)',
                    'clear': 'C:Clear',             // clear num pad
                    'combo': '\u00f6:Toggle Combo Keys',
                    'dec': '.:Decimal',           // decimal point for num pad (optional), change '.' to ',' for European format
                    'e': '\u21b5:Enter',        // down, then left arrow - enter symbol
                    'enter': 'Enter:Enter',
                    'lock': '\u21ea Lock:Caps Lock', // caps lock
                    's': '\u21e7:Shift',        // thick hollow up arrow
                    'shift': 'Shift:Shift',
                    'sign': '\u00b1:Change Sign',  // +/- sign for num pad
                    'space': '&nbsp;:Space',
                    't': '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
                    'tab': '\u21e5 Tab:Tab'       // \u21b9 is the true tab symbol (left & right arrows)
                },

                // Message added to the key title while hovering, if the mousewheel plugin exists
                wheelMessage: 'Use mousewheel to see other keys',

                css: {
                    input: 'ui-widget-content ui-corner-all', // input & preview
                    container: 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix', // keyboard container
                    buttonDefault: 'ui-state-default ui-corner-all', // default state
                    buttonHover: 'ui-state-hover',  // hovered button
                    buttonAction: 'ui-state-active', // Action keys (e.g. Accept, Cancel, Tab, etc); this replaces "actionClass" option
                    buttonDisabled: 'ui-state-disabled' // used when disabling the decimal button {dec} when a decimal exists in the input area
                },

                // *** Useability ***
                // Auto-accept content when clicking outside the keyboard (popup will close)
                autoAccept: false,

                // Prevents direct input in the preview window when true
                lockInput: false,

                // Prevent keys not in the displayed keyboard from being typed in
                restrictInput: false,

                // Check input against validate function, if valid the accept button is clickable; if invalid, the accept button is disabled.
                acceptValid: false,

                // tab to go to next, shift-tab for previous (default behavior)
                tabNavigation: false,

                // enter for next input; shift-enter accepts content & goes to next
                // shift + "enterMod" + enter ("enterMod" is the alt as set below) will accept content and go to previous in a textarea
                enterNavigation: false,
                // mod key options: 'ctrlKey', 'shiftKey', 'altKey', 'metaKey' (MAC only)
                enterMod: 'altKey', // alt-enter to go to previous; shift-alt-enter to accept & go to previous

                // Set this to append the keyboard immediately after the input/textarea it is attached to. This option
                // works best when the input container doesn't have a set width and when the "tabNavigation" option is true
                appendLocally: false,

                // If false, the shift key will remain active until the next key is (mouse) clicked on; if true it will stay active until pressed again
                stickyShift: true,

                // Prevent pasting content into the area
                preventPaste: false,

                // Set the max number of characters allowed in the input, setting it to false disables this option
                maxLength: false,

                // Mouse repeat delay - when clicking/touching a virtual keyboard key, after this delay the key will start repeating
                repeatDelay: 500,

                // Mouse repeat rate - after the repeatDelay, this is the rate (characters per second) at which the key is repeated
                // Added to simulate holding down a real keyboard key and having it repeat. I haven't calculated the upper limit of
                // this rate, but it is limited to how fast the javascript can process the keys. And for me, in Firefox, it's around 20.
                repeatRate: 20,

                // Event (namespaced) on the input to reveal the keyboard. To disable it, just set it to ''.
                openOn: 'focus',

                // Event (namepaced) for when the character is added to the input (clicking on the keyboard)
                keyBinding: 'mousedown',

                // combos (emulate dead keys : http://en.wikipedia.org/wiki/Keyboard_layout#US-International)
                // if user inputs `a the script converts it to à, ^o becomes ô, etc.
                useCombos: true,
                combos: {
                    '`': { a: "\u00e0", A: "\u00c0", e: "\u00e8", E: "\u00c8", i: "\u00ec", I: "\u00cc", o: "\u00f2", O: "\u00d2", u: "\u00f9", U: "\u00d9", y: "\u1ef3", Y: "\u1ef2" }, // grave
                    "'": { a: "\u00e1", A: "\u00c1", e: "\u00e9", E: "\u00c9", i: "\u00ed", I: "\u00cd", o: "\u00f3", O: "\u00d3", u: "\u00fa", U: "\u00da", y: "\u00fd", Y: "\u00dd" }, // acute & cedilla
                    '"': { a: "\u00e4", A: "\u00c4", e: "\u00eb", E: "\u00cb", i: "\u00ef", I: "\u00cf", o: "\u00f6", O: "\u00d6", u: "\u00fc", U: "\u00dc", y: "\u00ff", Y: "\u0178" }, // umlaut/trema
                    '^': { a: "\u00e2", A: "\u00c2", e: "\u00ea", E: "\u00ca", i: "\u00ee", I: "\u00ce", o: "\u00f4", O: "\u00d4", u: "\u00fb", U: "\u00db", y: "\u0177", Y: "\u0176" }, // circumflex
                    '~': { a: "\u00e3", A: "\u00c3", e: "\u1ebd", E: "\u1ebc", i: "\u0129", I: "\u0128", o: "\u00f5", O: "\u00d5", u: "\u0169", U: "\u0168", y: "\u1ef9", Y: "\u1ef8", n: "\u00f1", N: "\u00d1"} // tilde
                },

                /*
                // *** Methods ***
                // commenting these out to reduce the size of the minified version
                // Callbacks - attach a function to any of these callbacks as desired
                initialized : function(e, keyboard, el) {},
                visible     : function(e, keyboard, el) {},
                change      : function(e, keyboard, el) {},
                beforeClose : function(e, keyboard, el, accepted) {},
                accepted    : function(e, keyboard, el) {},
                canceled    : function(e, keyboard, el) {},
                hidden      : function(e, keyboard, el) {},
                switchInput : null, // called instead of base.switchInput
                */

                // this callback is called just before the "beforeClose" to check the value
                // if the value is valid, return true and the keyboard will continue as it should (close if not always open, etc)
                // if the value is not value, return false and the clear the keyboard value ( like this "keyboard.$preview.val('');" ), if desired
                // The validate function is called after each input, the "isClosing" value will be false; when the accept button is clicked, "isClosing" is true
                validate: function (keyboard, value, isClosing) { return true; }

            };

            // for checking combos
            $.keyboard.comboRegex = /([`\'~\^\"ao])([a-z])/mig;

            $.fn.keyboard = function (options) {
                return this.each(function () {
                    if (!$(this).data('keyboard')) {
                        (new $.keyboard(this, options));
                    }
                });
            };

            $.fn.getkeyboard = function () {
                return this.data("keyboard");
            };

        })(jQuery);

        /* Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
        * Licensed under the MIT License:
        * http://www.opensource.org/licenses/mit-license.php
        * Highly modified from the original
        */
        (function ($, len, createRange, duplicate) {
            $.fn.caret = function (options, opt2) {
                if (typeof this[0] === 'undefined' || this.is(':hidden') || this.css('visibility') === 'hidden') { return this; }
                var n, s, start, e, end, selRange, range, stored_range, te, val,
		selection = document.selection, t = this[0], sTop = t.scrollTop,
		opera = window.opera && window.opera.toString() === '[object Opera]',
		ss = typeof t.selectionStart !== 'undefined';
                if (typeof options === 'number' && typeof opt2 === 'number') {
                    start = options;
                    end = opt2;
                }
                if (typeof start !== 'undefined') {
                    if (ss) {
                        // hack around Opera bug
                        if (t.tagName === 'TEXTAREA' && opera) {
                            val = this.val();
                            n = val.substring(0, start).split('\n')[len] - 1;
                            start += (n > 0) ? n : 0;
                            end += (n > 0) ? n : 0;
                        }
                        t.selectionStart = start;
                        t.selectionEnd = end;
                    } else {
                        selRange = t.createTextRange();
                        selRange.collapse(true);
                        selRange.moveStart('character', start);
                        selRange.moveEnd('character', end - start);
                        selRange.select();
                    }
                    // must be visible or IE8 crashes; IE9 in compatibility mode works fine - issue #56
                    if (this.is(':visible') || this.css('visibility') !== 'hidden') { this.focus(); }
                    t.scrollTop = sTop;
                    return this;
                } else {
                    if (ss) {
                        s = t.selectionStart;
                        e = t.selectionEnd;
                        // hack around Opera bug (reported)
                        // try this demo - http://jsfiddle.net/vwb3c/ - keep entering carriage returns
                        if (t.tagName === 'TEXTAREA' && opera) {
                            val = this.val();
                            n = val.substring(0, s).split('\n')[len] - 1;
                            s += (n > 0) ? -n : 0;
                            e += (n > 0) ? -n : 0;
                        }
                    } else {
                        if (t.tagName === 'TEXTAREA') {
                            val = this.val();
                            range = selection[createRange]();
                            stored_range = range[duplicate]();
                            stored_range.moveToElementText(t);
                            stored_range.setEndPoint('EndToEnd', range);
                            // thanks to the awesome comments in the rangy plugin
                            s = stored_range.text.replace(/\r\n/g, '\r')[len];
                            e = s + range.text.replace(/\r\n/g, '\r')[len];
                        } else {
                            val = this.val().replace(/\r\n/g, '\r');
                            range = selection[createRange]()[duplicate]();
                            range.moveEnd('character', val[len]);
                            s = (range.text === '' ? val[len] : val.lastIndexOf(range.text));
                            range = selection[createRange]()[duplicate]();
                            range.moveStart('character', -val[len]);
                            e = range.text[len];
                        }
                    }
                    te = t.value.substring(s, e);
                    return { start: s, end: e, text: te, replace: function (st) {
                        return t.value.substring(0, s) + st + t.value.substring(e, t.value[len]);
                    }
                    };
                }
            };
        })(jQuery, 'length', 'createRange', 'duplicate');

        /*
        * jQuery UI Virtual Keyboard Autocomplete v1.3 for Keyboard v1.8+ only
        *
        * By Rob Garrison (aka Mottie & Fudgey)
        * Licensed under the MIT License
        *
        * Use this extension with the Virtual Keyboard to get
        * the jQuery UI Autocomplete widget to work seamlessly
        *
        * Requires:
        *  jQuery
        *  jQuery UI & css
        *  Keyboard plugin : https://github.com/Mottie/Keyboard
        *
        * Setup:
        *  $('.ui-keyboard-input')
        *   .keyboard(options)
        *   .autocomplete(options)
        *   .addAutoComplete();
        *
        *  // or if targeting a specific keyboard
        *  $('#keyboard1')
        *   .keyboard(options)     // keyboard plugin
        *   .autocomplete(options) // jQuery UI autocomplete
        *   .addAutoComplete();    // this keyboard extension
        * 
        */

        (function ($) {
            $.fn.addAutocomplete = function () {
                return this.each(function () {
                    // make sure a keyboard is attached
                    var base = $(this).data('keyboard');
                    if (!base) { return; }

                    // Setup
                    base.autocomplete_init = function (txt, delay, accept) {

                        // visible event is fired before this extension is initialized, so check!
                        if (base.options.alwaysOpen && base.isVisible) {
                            base.autocomplete_setup();
                        }

                        base.$el
		.bind('visible.keyboard', function () {
		    base.autocomplete_setup();
		})
		.bind('change.keyboard', function (e) {
		    if (base.hasAutocomplete && base.isVisible) {
		        base.$el
					.val(base.$preview.val())
					.trigger('keydown.autocomplete');
		    }
		})
		.bind('hidden.keyboard', function (e) {
		    base.$el.autocomplete('close');
		})
		.bind('autocompleteopen', function (e, ui) {
		    if (base.hasAutocomplete) {
		        // reposition autocomplete window next to the keyboard
		        base.$el.data('autocomplete').menu.element.position({
		            of: base.$keyboard,
		            my: 'right top',
		            at: 'left top',
		            collision: 'flip'
		        });
		    }
		})
		.bind('autocompleteselect', function (e, ui) {
		    if (base.hasAutocomplete && ui.item.value !== '') {
		        base.$preview
					.val(ui.item.value)
					.focus();
		    }
		});
                    };

                    // set up after keyboard is visible
                    base.autocomplete_setup = function () {
                        // look for autocomplete
                        base.$autocomplete = base.$el.data('autocomplete');
                        base.hasAutocomplete = (typeof (base.$autocomplete) === 'undefined') ? false : (base.$autocomplete.options.disabled) ? false : true;
                        // only bind to keydown once
                        if (base.hasAutocomplete && !base.autocomplete_bind) {
                            base.$preview.bind('keydown.keyboard', function (e) {
                                // send keys to the autocomplete widget (arrow, pageup/down, etc)
                                return base.autocomplete_input(e);
                            });
                            base.autocomplete_bind = true;
                        }
                    };

                    // Navigate and select inside autocomplete popup
                    base.autocomplete_input = function (event) {
                        // copied from jquery ui autocomplete code to include autocomplete navigation
                        // there might be a better workaround
                        var t, keyCode = $.ui.keyCode;
                        switch (event.keyCode) {
                            case keyCode.PAGE_UP:
                                base.$autocomplete._move("previousPage", event);
                                break;
                            case keyCode.PAGE_DOWN:
                                base.$autocomplete._move("nextPage", event);
                                break;
                            case keyCode.UP:
                                base.$autocomplete._move("previous", event);
                                // prevent moving cursor to beginning of text field in some browsers
                                event.preventDefault();
                                break;
                            case keyCode.DOWN:
                                base.$autocomplete._move("next", event);
                                // prevent moving cursor to end of text field in some browsers
                                event.preventDefault();
                                break;
                            case keyCode.ENTER:
                            case keyCode.NUMPAD_ENTER:
                                t = base.$autocomplete.menu.element.find('#ui-active-menuitem').text() || '';
                                if (t !== '') { base.$preview.val(t); }
                                break;
                            default:
                                // keypress is triggered before the input value is changed
                                clearTimeout(base.$autocomplete.searching);
                                base.$autocomplete.searching = setTimeout(function () {
                                    // only search if the value has changed
                                    if (base.$autocomplete.term != base.$autocomplete.element.val()) {
                                        base.$autocomplete.selectedItem = null;
                                        base.$autocomplete.search(null, event);
                                    }
                                }, base.$autocomplete.options.delay);
                                break;
                        }
                    };

                    base.origEscClose = base.escClose;

                    // replace original function with this one
                    base.escClose = function (e) {
                        // prevent selecting an item in autocomplete from closing keyboard
                        if (base.hasAutocomplete && e.target.id === 'ui-active-menuitem') { return; }
                        base.origEscClose(e);
                    };

                    base.autocomplete_init();

                });
            };
        })(jQuery);

        /*
        * jQuery UI Virtual Keyboard for jQuery Mobile Themes v1.0.1 (updated 2/23/2012)
        *
        * By Rob Garrison (aka Mottie & Fudgey)
        * Licensed under the MIT License
        *
        * Use this extension with the Virtual Keyboard to apply
        * the necessary themes to make the keyboard compatible with
        * jQuery Mobile themes
        *
        * Requires:
        *  jQuery - http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js
        *  jQuery Mobile - http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.js
        *  jQuery Mobile themes -  http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.css
        *
        * Setup:
        *  $('.ui-keyboard-input')
        *   .keyboard(options)
        *   .addMobile(mobile-options);
        *
        *  // or if targeting a specific keyboard
        *  $('#keyboard1')
        *   .keyboard(options)     // keyboard plugin
        *   .addMobile(mobile-options);    // this keyboard extension
        *
        */

        (function ($) {
            $.fn.addMobile = function (options) {

                var o, defaults = {
                    // keyboard wrapper theme
                    container: { theme: 'a' },
                    // theme added to all regular buttons
                    buttonMarkup: { theme: 'a', shadow: 'true', corners: 'true' },
                    // theme added to all buttons when they are being hovered
                    buttonHover: { theme: 'c' },
                    // theme added to action buttons (e.g. tab, shift, accept, cancel);
                    // parameters here will override the settings in the buttonMarkup
                    buttonAction: { theme: 'b' },
                    // theme added to button when it is active (e.g. shift is down)
                    // All extra parameters will be ignored
                    buttonActive: { theme: 'e' }
                };

                return this.each(function () {
                    var base = $(this).data('keyboard');

                    // Stop if no keyboard attached or if jQuery Mobile isn't loaded
                    if (!base || typeof ($.fn.textinput) === 'undefined') { return; }

                    base.mobile_options = o = $.extend({}, defaults, options);
                    base.mobile_initialized = false;

                    // Setup
                    base.mobile_init = function () {

                        // Add theme to input - if not already done through the markup
                        $('.ui-keyboard-input').textinput();

                        // visible event is fired before this extension is initialized, so check!
                        if (base.options.alwaysOpen && base.isVisible) {
                            base.mobile_setup();
                        }

                        // Setup mobile theme on keyboard once it is visible
                        base.$el.bind('visible.keyboard', function () {
                            if (base.mobile_initialized !== true) {
                                base.mobile_setup();
                            }
                        });

                    }

                    base.mobile_setup = function () {
                        var p, actn = $.extend({}, o.buttonMarkup, o.buttonAction);

                        base.$keyboard
                        // 'ui-bar ui-bar-a' classes to apply swatch theme
		.addClass('ui-bar ui-bar-' + o.container.theme)
                        // removing 'ui-widget-content' will prevent jQuery UI theme from applying to the keyboard
		.removeClass('ui-widget ui-widget-content')
                        // apply jQuery Mobile button markup
                        // removed call to jQuery Mobile buttonMarkup function; replaced with base.modButton
		.find('button:not(.' + base.options.css.buttonAction + ')').addClass(base.modButton(o.buttonMarkup)).end()
		.find('.' + base.options.css.buttonAction).addClass(base.modButton(actn)).end()
		.find('button').removeClass('ui-corner-all ui-state-default')
		.hover(function () {
		    $(this).addClass('ui-btn-hover-' + o.buttonHover.theme);
		}, function () {
		    $(this).removeClass('ui-btn-hover-' + o.buttonHover.theme);
		});

                        // set actionClass (default for jQuery UI = 'ui-state-active'),
                        // which is the active state of the button (shift is down)
                        base.options.css.buttonAction = 'ui-btn-down-' + o.buttonActive.theme;

                        // update keyboard width if preview is showing... after applying mobile theme
                        if (base.msie && base.$preview[0] !== base.el) {
                            base.$preview.hide();
                            base.$keyboard.css('width', '');
                            base.width = base.$keyboard.outerWidth();
                            base.$keyboard.width(base.width + parseInt(base.$preview.css('fontSize'), 10)); // add about 1em to input width for extra padding
                            base.$preview.width(base.width);
                            base.$preview.show();
                        }

                        // adjust keyboard position after applying mobile theme
                        p = base.options.position;
                        p.of = p.of || base.$el.data('keyboardPosition') || base.$el;
                        p.collision = (base.options.usePreview) ? p.collision || 'fit fit' : 'flip flip';
                        base.$keyboard.position(p);

                        base.mobile_initialized = true;
                    };

                    base.modButton = function (t) {
                        // Using this instead of the jQuery Mobile buttonMarkup because it is expecting <a>'s instead of <button>
                        // theme:'a', shadow:'true', inline:'true', corners:'false'
                        return 'ui-btn ui-btn-up-' + t.theme + (t.shadow == 'true' ? ' ui-shadow' : '') + (t.corners == 'true' ? ' ui-btn-corner-all' : '');
                    };

                    base.mobile_init();

                });
            };
        })(jQuery);

        /*
        * jQuery UI Virtual Keyboard Navigation v1.2 for Keyboard v1.8.14+ only
        *
        * By Rob Garrison (aka Mottie & Fudgey)
        * Licensed under the MIT License
        *
        * Use this extension with the Virtual Keyboard to navigate
        * the virtual keyboard keys using the arrow, page, home and end keys
        * Using this extension WILL prevent keyboard navigation inside of all
        * input and textareas
        *
        * Requires:
        *  jQuery
        *  Keyboard plugin : https://github.com/Mottie/Keyboard
        *
        * Setup:
        *  $('.ui-keyboard-input')
        *   .keyboard(options)
        *   .addNavigation();
        *
        *  // or if targeting a specific keyboard
        *  $('#keyboard1')
        *   .keyboard(options)     // keyboard plugin
        *   .addNavigation();    // this keyboard extension
        * 
        */

        (function ($) {
            $.fn.addNavigation = function (options) {

                //Set the default values, use comma to separate the settings, example:
                var o, defaults = {
                    position: [0, 0],     // set start position [row-number, key-index]
                    toggleMode: false,     // true = navigate the virtual keyboard, false = navigate in input/textarea
                    toggleKey: 112,       // toggle key; F1 = 112 (event.which value for function 1 key)
                    focusClass: 'hasFocus' // css class added when toggle mode is on
                };

                return this.each(function () {
                    // make sure a keyboard is attached
                    var base = $(this).data('keyboard');
                    if (!base) { return; }

                    base.navigation_options = o = $.extend({}, defaults, options);
                    // save navigation settings - disabled when the toggled
                    base.saveNav = [base.options.tabNavigation, base.options.enterNavigation];

                    // Setup
                    base.navigation_init = function () {

                        base.$keyboard[(o.toggleMode) ? 'addClass' : 'removeClass'](o.focusClass)
		.find('.ui-keyboard-keyset:visible')
		.find('.ui-keyboard-button[data-pos="' + o.position[0] + ',' + o.position[1] + '"]')
		.addClass('ui-state-hover');

                        base.$preview
	.unbind('keydown.keyboardNav')
	.bind('keydown.keyboardNav', function (e) {
	    return base.checkKeys(e);
	});

                    };

                    base.checkKeys = function (e, disable) {
                        if (e.which === o.toggleKey || disable) {
                            o.toggleMode = (disable) ? false : !o.toggleMode;
                            base.options.tabNavigation = (o.toggleMode) ? false : base.saveNav[0];
                            base.options.enterNavigation = (o.toggleMode) ? false : base.saveNav[1];
                        }
                        base.$keyboard[(o.toggleMode) ? 'addClass' : 'removeClass'](o.focusClass);
                        if (o.toggleMode && e.which > 32 && e.which < 41) {
                            base.navigateKeys(e.which);
                            return false;
                        }
                        if (o.toggleMode && e.which === 13) {
                            base.$keyboard
			.find('.ui-keyboard-keyset:visible')
			.find('.ui-keyboard-button[data-pos="' + o.position[0] + ',' + o.position[1] + '"]')
			.trigger('repeater.keyboard');
                            return false;
                        }
                    };

                    base.navigateKeys = function (key) {
                        var indx = o.position[1],
		row = o.position[0],
		vis = base.$keyboard.find('.ui-keyboard-keyset:visible'),
		maxRow = vis.find('.ui-keyboard-button-endrow').length - 1,
		maxIndx = vis.find('.ui-keyboard-button[data-pos^="' + row + ',"]').length - 1,
		end = parseInt(vis.find('.ui-keyboard-button:last').attr('data-pos').split(',')[1], 10);

                        switch (key) {
                            case 33: row = 0; break; // pageUp
                            case 34: row = maxRow; break; // pageDown
                            case 35: indx = maxIndx; break; // End
                            case 36: indx = 0; break; // Home
                            case 37: indx += (indx > 0) ? -1 : 0; break; // Left
                            case 38: row += (row > 0) ? -1 : 0; break; // Up
                            case 39: indx += 1; break; // Right
                            case 40: row += (row + 1 > maxRow) ? 0 : 1; break; // Down
                        }

                        // get max index of new row
                        maxIndx = vis.find('.ui-keyboard-button[data-pos^="' + row + ',"]').length - 1;
                        if (indx > maxIndx) { indx = maxIndx; }

                        vis.find('.ui-state-hover').removeClass('ui-state-hover');
                        vis.find('.ui-keyboard-button[data-pos="' + row + ',' + indx + '"]').addClass('ui-state-hover');
                        o.position = [row, indx];
                    };

                    // visible event is fired before this extension is initialized, so check!
                    if (base.options.alwaysOpen && base.isVisible) {
                        base.navigation_init();
                    }
                    // capture and simulate typing
                    base.$el
	.bind('visible.keyboard', function (e) {
	    base.navigation_init();
	})
	.bind('inactive.keyboard hidden.keyboard', function (e) {
	    base.checkKeys(e, true); // disable toggle mode & revert navigation options
	});

                });
            };
        })(jQuery);

        /*
        * jQuery UI Virtual Keyboard Typing Simulator v1.3 for Keyboard v1.8.14+ only
        *
        * By Rob Garrison (aka Mottie & Fudgey)
        * Licensed under the MIT License
        *
        * Use this extension with the Virtual Keyboard to simulate
        * typing for tutorials or whatever else use you can find
        *
        * Requires:
        *  jQuery
        *  Keyboard plugin : https://github.com/Mottie/Keyboard
        *
        * Setup:
        *  $('.ui-keyboard-input')
        *   .keyboard(options)
        *   .addTyping(typing-options);
        *
        *  // or if targeting a specific keyboard
        *  $('#keyboard1')
        *   .keyboard(options)
        *   .addTyping(typing-options);
        *
        * Basic Usage:
        *  // To disable manual typing on the virtual keyboard, just set "showTyping" option to false
        *  $('#keyboard-input').keyboard(options).addTyping({ showTyping: false });
        *
        *  // Change the default typing delay (time the virtual keyboard highlights the manually typed key) - default = 250 milliseconds
        *  $('#keyboard-input').keyboard(options).addTyping({ delay: 500 });
        *
        *  // get keyboard object, open it, then start typing simulation
        *  $('#keyboard-input').getkeyboard().reveal().typeIn('Hello World', 700);
        *
        *  // get keyboard object, open it, type in "This is a test" with 700ms delay between types, then accept & close the keyboard
        *  $('#keyboard-input').getkeyboard().reveal().typeIn('This is a test', 700, function(){ $('#keyboard-input').getkeyboard().close(true); });
        */

        // EXAMPLES:
        // $('#inter').getkeyboard().reveal().typeIn('\tHello \b\n\tWorld', 500);
        // $('#meta').getkeyboard().reveal().typeIn('abCDd11123\u2648\u2649\u264A\u264B', 700, function(){ alert('all done!'); });

        (function ($) {
            $.fn.addTyping = function (options) {
                //Set the default values, use comma to separate the settings, example:
                var defaults = {
                    showTyping: true,
                    delay: 250
                };
                return this.each(function () {
                    // make sure a keyboard is attached
                    var base = $(this).data('keyboard');
                    if (!base) { return; }

                    // variables
                    base.typing_options = $.extend({}, defaults, options);
                    base.typing_keymap = {
                        ' ': 'space',
                        '"': '34',
                        "'": '39',
                        '&nbsp;': 'space',
                        '\b': 'bksp',
                        '\n': 'Enter',
                        '\r': 'Enter',
                        '\t': 'tab'
                    };
                    base.typing_xref = {
                        8: 'bksp',
                        9: 'tab',
                        13: 'enter',
                        32: 'space'
                    };
                    base.typing_event = base.typing_flag = false;
                    // no manual typing simulation if lockInput is true; but the typeIn() function still works
                    //			if (base.options.lockInput) { base.typing_options.showTyping = false; }

                    base.typing_setup = function () {
                        if (base.typing_flag) { return; }
                        base.typing_flag = true;
                        var el = (base.$preview) ? base.$preview : base.$el;

                        el
		.bind('keyup.keyboard', function (e) {
		    if (e.which >= 37 && e.which <= 40) { return; } // ignore arrow keys
		    if (e.which === 16) { base.shiftActive = false; }
		    if (e.which === 18) { base.altActive = false; }
		    if (e.which === 16 || e.which === 18) {
		        base.showKeySet();
		        setTimeout(function () { base.$preview.focus(); }, 200); // Alt key will shift focus to the menu - doesn't work in Windows
		        return;
		    }
		})
                        // change keyset when either shift or alt is held down
		.bind('keydown.keyboard', function (e) {
		    e.temp = false; // prevent repetitive calls while keydown repeats.
		    if (e.which === 16) { e.temp = (base.shiftActive) ? false : true; base.shiftActive = true; }
		    // it should be ok to reset e.temp, since both alt and shift will call this function separately
		    if (e.which === 18) { e.temp = (base.altActive) ? false : true; base.altActive = true; }
		    if (e.temp) {
		        base.showKeySet();
		        base.$preview.focus(); // Alt shift focus to the menu
		    }
		    base.typing_event = true;
		    // Simulate key press for tab and backspace since they don't fire the keypress event
		    if (e.which === 8 || e.which === 9) {
		        base.typeIn('', base.typing_options.delay || 250, function () {
		            base.typing_event = false;
		        }, e); // pass event object
		    }

		})
		.bind('keypress.keyboard', function (e) {
		    // Simulate key press on virtual keyboard
		    if (base.typing_event && !base.options.lockInput) {
		        base.typeIn('', base.typing_options.delay || 250, function () {
		            base.typing_event = false;
		        }, e); // pass event object
		    }
		});
                    }

                    // Store typing text
                    base.typeIn = function (txt, delay, callback, e) {
                        if (!base.isVisible) {
                            // keyboard was closed
                            base.typing_options.init = false;
                            clearTimeout(base.typing_timer);
                            return;
                        }
                        var o = base.typing_options, tar, m, n, k, key, ks, meta, set;
                        if (base.typing_options.init !== true) {
                            o.init = true;
                            o.text = txt;
                            o.len = txt.length;
                            o.delay = delay || 300;
                            o.current = 0; // position in text string
                            o.callback = callback;
                        }

                        // function that loops through and types each character
                        txt = o.text.substring(o.current, ++o.current);
                        ks = base.$keyboard.find('.ui-keyboard-keyset');
                        k = (base.typing_keymap.hasOwnProperty(txt)) ? base.typing_keymap[txt] : txt;

                        // typing_event is true when typing on the actual keyboard - look for actual key
                        // All of this breaks when the CapLock is on... unable to find a cross-browser method that works.
                        tar = '.ui-keyboard-button[data-value="' + k + '"]';
                        if (base.typing_event && e) {
                            if (base.typing_xref.hasOwnProperty(e.keyCode || e.which)) {
                                // special named keys: bksp, tab and enter
                                tar = '.ui-keyboard-' + base.typing_xref[e.keyCode || e.which];
                            } else {
                                m = String.fromCharCode(e.charCode || e.which);
                                tar = (base.mappedKeys.hasOwnProperty(m)) ? '.ui-keyboard-button[data-value="' + base.mappedKeys[m] + '"]' : '.ui-keyboard-' + (e.charCode || e.which);
                            }
                        }
                        // find key
                        key = ks.filter(':visible').find(tar);
                        if (key.length) {
                            // key is visible, simulate typing
                            base.typing_simulateKey(key, txt);
                        } else {
                            // key not found, check if it is in the keymap (tab, space, enter, etc)
                            if (base.typing_event) {
                                key = ks.find(tar);
                            } else {
                                // key not found, check if it is in the keymap (tab, space, enter, etc)
                                n = (base.typing_keymap.hasOwnProperty(txt)) ? base.typing_keymap[txt] : txt.charCodeAt(0);
                                if (n === 'bksp') { txt = n; }
                                // find actual key on keyboard
                                key = ks.find('.ui-keyboard-' + n);
                            }

                            // find the keyset
                            set = key.closest('.ui-keyboard-keyset');

                            // figure out which keyset the key is in then simulate clicking on that meta key, then on the key
                            if (set.attr('name')) {
                                // get meta key name
                                meta = set.attr('name');
                                // show correct key set
                                base.shiftActive = /shift/.test(meta);
                                base.altActive = /alt/.test(meta);
                                base.metaActive = base.lastKeyset[2] = (meta).match(/meta\d+/) || false;
                                // make the plugin think we're passing it a jQuery object with a name

                                base.showKeySet({ name: base.metaActive });

                                // Add the key
                                base.typing_simulateKey(key, txt);
                            } else {
                                if (!base.typing_event) {
                                    // Key doesn't exist on the keyboard, so just enter it
                                    base.insertText(txt);
                                    base.checkCombos();
                                }
                            }

                        }

                        if (o.current < o.len) {
                            if (!base.isVisible) { return; } // keyboard was closed, abort!!
                            setTimeout(function () { base.typeIn(); }, o.delay);
                        } else {
                            o.init = false;
                            if ($.isFunction(o.callback)) {
                                // ensure all typing animation is done before the callback
                                setTimeout(function () {
                                    o.callback();
                                }, o.delay);
                            }
                            return;
                        }
                    };

                    // mouseover the key, add the text directly, then mouseout on the key
                    base.typing_simulateKey = function (el, txt) {
                        var e = el.length;
                        if (e) { el.filter(':visible').trigger('mouseenter.keyboard'); }
                        base.typing_timer = setTimeout(function () {
                            if (e) { setTimeout(function () { el.trigger('mouseleave.keyboard'); }, base.typing_options.delay / 3); }
                            if (!base.isVisible) { return; }
                            if (!base.typing_event) {
                                base.insertText(txt);
                                base.checkCombos();
                            }
                        }, base.typing_options.delay / 3);
                    };

                    if (base.typing_options.showTyping) {
                        // visible event is fired before this extension is initialized, so check!
                        if (base.options.alwaysOpen && base.isVisible) {
                            base.typing_setup();
                        }
                        // capture and simulate typing
                        base.$el.bind('visible.keyboard', function (e) {
                            base.typing_setup();
                        });
                    }

                });
            };
        })(jQuery);

    }
});