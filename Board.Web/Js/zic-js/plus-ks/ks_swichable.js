define(function (require, exports, module) {
    return function (KISSY) {
        KISSY.add('switchable', function (S, undefined) {

            var DOM = S.DOM, Event = S.Event,
                DISPLAY = 'display', BLOCK = 'block', NONE = 'none',
                FORWARD = 'forward', BACKWARD = 'backward',
                DOT = '.',

                EVENT_INIT = 'init',
                EVENT_BEFORE_SWITCH = 'beforeSwitch', EVENT_SWITCH = 'switch',
                CLS_PREFIX = 'ks-switchable-';

            /**
            * Switchable Widget
            * attached members：
            *   - this.container
            *   - this.config
            *   - this.triggers  可以为空值 []
            *   - this.panels    可以为空值 []
            *   - this.content
            *   - this.length
            *   - this.activeIndex
            *   - this.switchTimer
            */
            function Switchable(container, config) {
                var self = this;

                // 调整配置信息
                config = config || {};
                if (!('markupType' in config)) {
                    if (config.panelCls) {
                        config.markupType = 1;
                    } else if (config.panels) {
                        config.markupType = 2;
                    }
                }
                config = S.merge(Switchable.Config, config);

                /**
                * the container of widget
                * @type HTMLElement
                */
                self.container = S.get(container);

                /**
                * 配置参数
                * @type Object
                */
                self.config = config;

                /**
                * triggers
                * @type Array of HTMLElement
                */
                //self.triggers

                /**
                * panels
                * @type Array of HTMLElement
                */
                //self.panels

                /**
                * length = panels.length / steps
                * @type number
                */
                //self.length

                /**
                * the parentNode of panels
                * @type HTMLElement
                */
                //self.content

                /**
                * 当前激活的 index
                * @type Number
                */
                self.activeIndex = config.activeIndex;

                self._init();
            }

            // 默认配置
            Switchable.Config = {
                markupType: 0, // markup 的类型，取值如下：

                // 0 - 默认结构：通过 nav 和 content 来获取 triggers 和 panels
                navCls: CLS_PREFIX + 'nav',
                contentCls: CLS_PREFIX + 'content',

                // 1 - 适度灵活：通过 cls 来获取 triggers 和 panels
                triggerCls: CLS_PREFIX + 'trigger',
                panelCls: CLS_PREFIX + 'panel',

                // 2 - 完全自由：直接传入 triggers 和 panels
                triggers: [],
                panels: [],

                // 是否有触点
                hasTriggers: true,

                // 触发类型
                triggerType: 'mouse', // or 'click'
                // 触发延迟
                delay: .1, // 100ms

                activeIndex: 0, // markup 的默认激活项应与 activeIndex 保持一致
                activeTriggerCls: 'ks-active',
                //switchTo: 0,

                // 可见视图内有多少个 panels
                steps: 1,

                // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
                viewSize: []
            };

            // 插件
            Switchable.Plugins = [];

            S.augment(Switchable, S.EventTarget, {

                /**
                * init switchable
                */
                _init: function () {
                    var self = this, cfg = self.config;

                    // parse markup
                    self._parseMarkup();

                    // 切换到指定项
                    if (cfg.switchTo) {
                        self.switchTo(cfg.switchTo);
                    }

                    // bind triggers
                    if (cfg.hasTriggers) {
                        self._bindTriggers();
                    }

                    // init plugins
                    S.each(Switchable.Plugins, function (plugin) {
                        if (plugin.init) {
                            plugin.init(self);
                        }
                    });

                    self.fire(EVENT_INIT);
                },

                /**
                * 解析 markup, 获取 triggers, panels, content
                */
                _parseMarkup: function () {
                    var self = this, container = self.container,
                cfg = self.config,
                nav, content, triggers = [], panels = [], i, n, m;

                    switch (cfg.markupType) {
                        case 0: // 默认结构
                            nav = S.get(DOT + cfg.navCls, container);
                            if (nav) triggers = DOM.children(nav);
                            content = S.get(DOT + cfg.contentCls, container);
                            panels = DOM.children(content);
                            break;
                        case 1: // 适度灵活
                            triggers = S.query(DOT + cfg.triggerCls, container);
                            panels = S.query(DOT + cfg.panelCls, container);
                            break;
                        case 2: // 完全自由
                            triggers = cfg.triggers;
                            panels = cfg.panels;
                            break;
                    }


                    // get length
                    n = panels.length;
                    self.length = n / cfg.steps;

                    // 自动生成 triggers
                    if (cfg.hasTriggers && n > 0 && triggers.length === 0) {
                        triggers = self._generateTriggersMarkup(self.length);
                    }

                    // 将 triggers 和 panels 转换为普通数组
                    self.triggers = S.makeArray(triggers);
                    self.panels = S.makeArray(panels);

                    // get content
                    self.content = content || panels[0].parentNode;
                },

                /**
                * 自动生成 triggers 的 markup
                */
                _generateTriggersMarkup: function (len) {
                    var self = this, cfg = self.config,
                ul = DOM.create('<ul>'), li, i;

                    ul.className = cfg.navCls;
                    for (i = 0; i < len; i++) {
                        li = DOM.create('<li>');
                        if (i === self.activeIndex) {
                            li.className = cfg.activeTriggerCls;
                        }
                        li.innerHTML = i + 1;
                        ul.appendChild(li);
                    }

                    self.container.appendChild(ul);
                    return DOM.children(ul);
                },

                /**
                * 给 triggers 添加事件
                */
                _bindTriggers: function () {
                    var self = this, cfg = self.config,
                triggers = self.triggers, trigger,
                i, len = triggers.length;

                    for (i = 0; i < len; i++) {
                        (function (index) {
                            trigger = triggers[index];

                            Event.on(trigger, 'click', function () {
                                self._onFocusTrigger(index);
                            });

                            if (cfg.triggerType === 'mouse') {
                                Event.on(trigger, 'mouseenter', function () {
                                    self._onMouseEnterTrigger(index);
                                });
                                Event.on(trigger, 'mouseleave', function () {
                                    self._onMouseLeaveTrigger(index);
                                });
                            }
                        })(i);
                    }
                },

                /**
                * click or tab 键激活 trigger 时触发的事件
                */
                _onFocusTrigger: function (index) {
                    var self = this;
                    if (!self._triggerIsValid(index)) return; // 重复点击

                    this._cancelSwitchTimer(); // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
                    self.switchTo(index);
                },

                /**
                * 鼠标悬浮在 trigger 上时触发的事件
                */
                _onMouseEnterTrigger: function (index) {
                    var self = this;
                    if (!self._triggerIsValid(index)) return; // 重复悬浮。比如：已显示内容时，将鼠标快速滑出再滑进来，不必再次触发。

                    self.switchTimer = S.later(function () {
                        self.switchTo(index);
                    }, self.config.delay * 1000);
                },

                /**
                * 鼠标移出 trigger 时触发的事件
                */
                _onMouseLeaveTrigger: function () {
                    this._cancelSwitchTimer();
                },

                /**
                * 重复触发时的有效判断
                */
                _triggerIsValid: function (index) {
                    return this.activeIndex !== index;
                },

                /**
                * 取消切换定时器
                */
                _cancelSwitchTimer: function () {
                    var self = this;
                    if (self.switchTimer) {
                        self.switchTimer.cancel();
                        self.switchTimer = undefined;
                    }
                },

                /**
                * 切换操作
                */
                switchTo: function (index, direction) {
                    var self = this, cfg = self.config,
                triggers = self.triggers, panels = self.panels,
                activeIndex = self.activeIndex,
                steps = cfg.steps,
                fromIndex = activeIndex * steps, toIndex = index * steps;

                    if (!self._triggerIsValid(index)) return self; // 再次避免重复触发
                    if (self.fire(EVENT_BEFORE_SWITCH, { toIndex: index }) === false) return self;

                    // switch active trigger
                    if (cfg.hasTriggers) {
                        self._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
                    }

                    // switch active panels
                    if (direction === undefined) {
                        direction = index > activeIndex ? FORWARD : BACKWARD;
                    }

                    // switch view
                    self._switchView(
                panels.slice(fromIndex, fromIndex + steps),
                panels.slice(toIndex, toIndex + steps),
                index,
                direction);

                    // update activeIndex
                    self.activeIndex = index;

                    return self; // chain
                },

                /**
                * 切换当前触点
                */
                _switchTrigger: function (fromTrigger, toTrigger/*, index*/) {
                    var activeTriggerCls = this.config.activeTriggerCls;

                    if (fromTrigger) DOM.removeClass(fromTrigger, activeTriggerCls);
                    DOM.addClass(toTrigger, activeTriggerCls);
                },

                /**
                * 切换视图
                */
                _switchView: function (fromPanels, toPanels, index/*, direction*/) {
                    // 最简单的切换效果：直接隐藏/显示
                    DOM.css(fromPanels, DISPLAY, NONE);
                    DOM.css(toPanels, DISPLAY, BLOCK);

                    // fire onSwitch events
                    this._fireOnSwitch(index);
                },

                /**
                * 触发 switch 相关事件
                */
                _fireOnSwitch: function (index) {
                    this.fire(EVENT_SWITCH, { currentIndex: index });
                },

                /**
                * 切换到上一视图
                */
                prev: function () {
                    var self = this, activeIndex = self.activeIndex;
                    self.switchTo(activeIndex > 0 ? activeIndex - 1 : self.length - 1, BACKWARD);
                },

                /**
                * 切换到下一视图
                */
                next: function () {
                    var self = this, activeIndex = self.activeIndex;
                    self.switchTo(activeIndex < self.length - 1 ? activeIndex + 1 : 0, FORWARD);
                }
            });

            S.Switchable = Switchable;

        }, { requires: ['core'] });
        require("./ks_datalazyload")(KISSY);
        require("./ks_swich_effect")(KISSY);

        KISSY.add('tabs', function (S) {

            /**
            * Tabs Class
            * @constructor
            */
            function Tabs(container, config) {
                var self = this;

                // factory or constructor
                if (!(self instanceof Tabs)) {
                    return new Tabs(container, config);
                }

                Tabs.superclass.constructor.call(self, container, config);
            }

            S.extend(Tabs, S.Switchable);
            S.Tabs = Tabs;

        }, { host: 'switchable' });
        KISSY.add('slide', function (S) {

            /**
            * 默认配置，和 Switchable 相同的部分此处未列出
            */
            var defaultConfig = {
                autoplay: true,
                circular: true
            };

            /**
            * Slide Class
            * @constructor
            */
            function Slide(container, config) {
                var self = this;

                // factory or constructor
                if (!(self instanceof Slide)) {
                    return new Slide(container, config);
                }

                Slide.superclass.constructor.call(self, container, S.merge(defaultConfig, config));
            }

            S.extend(Slide, S.Switchable);
            S.Slide = Slide;

        }, { host: 'switchable' });
        KISSY.add('carousel', function (S, undefined) {

            var DOM = S.DOM, Event = S.Event,
        CLS_PREFIX = 'ks-switchable-', DOT = '.',
        PREV_BTN = 'prevBtn', NEXT_BTN = 'nextBtn',

            /**
            * 默认配置，和 Switchable 相同的部分此处未列出
            */
        defaultConfig = {
            circular: true,
            prevBtnCls: CLS_PREFIX + 'prev-btn',
            nextBtnCls: CLS_PREFIX + 'next-btn',
            disableBtnCls: CLS_PREFIX + 'disable-btn'
        };

            /**
            * Carousel Class
            * @constructor
            */
            function Carousel(container, config) {
                var self = this;

                // factory or constructor
                if (!(self instanceof Carousel)) {
                    return new Carousel(container, config);
                }

                // 插入 carousel 的初始化逻辑
                self.on('init', function () { init_carousel(self); });

                // call super
                Carousel.superclass.constructor.call(self, container, S.merge(defaultConfig, config));
            }

            S.extend(Carousel, S.Switchable);
            S.Carousel = Carousel;

            /**
            * Carousel 的初始化逻辑
            * 增加了:
            *   self.prevBtn
            *   self.nextBtn
            */
            function init_carousel(self) {
                var cfg = self.config, disableCls = cfg.disableBtnCls;

                // 获取 prev/next 按钮，并添加事件
                S.each(['prev', 'next'], function (d) {
                    var btn = self[d + 'Btn'] = S.get(DOT + cfg[d + 'BtnCls'], self.container);

                    Event.on(btn, 'click', function (ev) {
                        ev.preventDefault();
                        if (!DOM.hasClass(btn, disableCls)) self[d]();
                    });
                });

                // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
                // circular = true 时，无需处理
                if (!cfg.circular) {
                    self.on('switch', function (ev) {
                        var i = ev.currentIndex,
                    disableBtn = (i === 0) ? self[PREV_BTN]
                        : (i === self.length - 1) ? self[NEXT_BTN]
                        : undefined;

                        DOM.removeClass([self[PREV_BTN], self[NEXT_BTN]], disableCls);
                        if (disableBtn) DOM.addClass(disableBtn, disableCls);
                    });
                }

                // 触发 itemSelected 事件
                Event.on(self.panels, 'click focus', function () {
                    self.fire('itemSelected', { item: this });
                });
            }

        }, { host: 'switchable' });
        KISSY.add('accordion', function (S) {

            var DOM = S.DOM,
                DISPLAY = 'display', BLOCK = 'block', NONE = 'none',

            defaultConfig = {
                markupType: 1,
                triggerType: 'click',
                multiple: false
            };

            /**
            * Accordion Class
            * @constructor
            */
            function Accordion(container, config) {
                var self = this;

                // factory or constructor
                if (!(self instanceof Accordion)) {
                    return new Accordion(container, config);
                }

                Accordion.superclass.constructor.call(self, container, S.merge(defaultConfig, config));

                // multiple 模式时，switchTrigger 在 switchView 时已经实现
                if (self.config.multiple) {
                    self._switchTrigger = function () { }
                }
            }

            S.extend(Accordion, S.Switchable);
            S.Accordion = Accordion;

            S.augment(Accordion, {

                /**
                * 重复触发时的有效判断
                */
                _triggerIsValid: function (index) {
                    // multiple 模式下，再次触发意味着切换展开/收缩状态
                    return this.activeIndex !== index || this.config.multiple;
                },

                /**
                * 切换视图
                */
                _switchView: function (fromPanels, toPanels, index) {
                    var self = this, cfg = self.config,
                panel = toPanels[0];

                    if (cfg.multiple) {
                        DOM.toggleClass(self.triggers[index], cfg.activeTriggerCls);
                        DOM.css(panel, DISPLAY, panel.style[DISPLAY] == NONE ? BLOCK : NONE);
                        this._fireOnSwitch(index);
                    }
                    else {
                        Accordion.superclass._switchView.call(self, fromPanels, toPanels, index);
                    }
                }
            });

        }, { host: 'switchable' });
    }
});