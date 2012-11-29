define(function (require, exports, module) {
    return function (KISSY) {
        KISSY.add('effect', function (S, undefined) {

            var DOM = S.DOM, Anim = S.Anim,
        DISPLAY = 'display', BLOCK = 'block', NONE = 'none',
        OPACITY = 'opacity', Z_INDEX = 'z-index',
        POSITION = 'position', RELATIVE = 'relative', ABSOLUTE = 'absolute',
        SCROLLX = 'scrollx', SCROLLY = 'scrolly', FADE = 'fade',
        LEFT = 'left', TOP = 'top', FLOAT = 'float', PX = 'px',
        Switchable = S.Switchable, Effects;

            /**
            * 添加默认配置
            */
            S.mix(Switchable.Config, {
                effect: NONE, // 'scrollx', 'scrolly', 'fade' 或者直接传入 custom effect fn
                duration: .5, // 动画的时长
                easing: 'easeNone', // easing method
                nativeAnim: true
            });

            /**
            * 定义效果集
            */
            Switchable.Effects = {

                // 最朴素的显示/隐藏效果
                none: function (fromEls, toEls, callback) {
                    DOM.css(fromEls, DISPLAY, NONE);
                    DOM.css(toEls, DISPLAY, BLOCK);
                    callback();
                },

                // 淡隐淡现效果
                fade: function (fromEls, toEls, callback) {
                    if (fromEls.length !== 1) {
                        S.error('fade effect only supports steps == 1.');
                    }
                    var self = this, cfg = self.config,
                fromEl = fromEls[0], toEl = toEls[0];

                    if (self.anim) self.anim.stop(true);

                    // 首先显示下一张
                    DOM.css(toEl, OPACITY, 1);

                    // 动画切换
                    self.anim = new Anim(fromEl, { opacity: 0 }, cfg.duration, cfg.easing, function () {
                        self.anim = undefined; // free

                        // 切换 z-index
                        DOM.css(toEl, Z_INDEX, 9);
                        DOM.css(fromEl, Z_INDEX, 1);

                        callback();
                    }, cfg.nativeAnim).run();
                },

                // 水平/垂直滚动效果
                scroll: function (fromEls, toEls, callback, index) {
                    var self = this, cfg = self.config,
                isX = cfg.effect === SCROLLX,
                diff = self.viewSize[isX ? 0 : 1] * index,
                props = {};

                    props[isX ? LEFT : TOP] = -diff + PX;
                    if (self.anim) self.anim.stop();

                    self.anim = new Anim(self.content, props, cfg.duration, cfg.easing, function () {
                        self.anim = undefined; // free
                        callback();
                    }, cfg.nativeAnim).run();
                }
            };
            Effects = Switchable.Effects;
            Effects[SCROLLX] = Effects[SCROLLY] = Effects.scroll;

            /**
            * 添加插件
            * attached members:
            *   - this.viewSize
            */
            Switchable.Plugins.push({

                name: 'effect',

                /**
                * 根据 effect, 调整初始状态
                */
                init: function (host) {
                    var cfg = host.config, effect = cfg.effect,
                panels = host.panels, content = host.content,
                steps = cfg.steps,
                activeIndex = host.activeIndex,
                len = panels.length;

                    // 1. 获取高宽
                    host.viewSize = [
                cfg.viewSize[0] || panels[0].offsetWidth * steps,
                cfg.viewSize[1] || panels[0].offsetHeight * steps
            ];
                    // 注：所有 panel 的尺寸应该相同
                    //    最好指定第一个 panel 的 width 和 height, 因为 Safari 下，图片未加载时，读取的 offsetHeight 等值会不对

                    // 2. 初始化 panels 样式
                    if (effect !== NONE) { // effect = scrollx, scrolly, fade

                        // 这些特效需要将 panels 都显示出来
                        S.each(panels, function (panel) {
                            DOM.css(panel, DISPLAY, BLOCK);
                        });

                        switch (effect) {
                            // 如果是滚动效果  
                            case SCROLLX:
                            case SCROLLY:
                                // 设置定位信息，为滚动效果做铺垫
                                DOM.css(content, POSITION, ABSOLUTE);
                                DOM.css(content.parentNode, POSITION, RELATIVE); // 注：content 的父级不一定是 container

                                // 水平排列
                                if (effect === SCROLLX) {
                                    DOM.css(panels, FLOAT, LEFT);

                                    // 设置最大宽度，以保证有空间让 panels 水平排布
                                    DOM.width(content, host.viewSize[0] * (len / steps));
                                }
                                break;

                            // 如果是透明效果，则初始化透明  
                            case FADE:
                                var min = activeIndex * steps,
                            max = min + steps - 1,
                            isActivePanel;

                                S.each(panels, function (panel, i) {
                                    isActivePanel = i >= min && i <= max;
                                    DOM.css(panel, {
                                        opacity: isActivePanel ? 1 : 0,
                                        position: ABSOLUTE,
                                        zIndex: isActivePanel ? 9 : 1
                                    });
                                });
                                break;
                        }
                    }

                    // 3. 在 CSS 里，需要给 container 设定高宽和 overflow: hidden
                }
            });

            /**
            * 覆盖切换方法
            */
            S.augment(Switchable, {

                _switchView: function (fromEls, toEls, index, direction) {
                    var self = this, cfg = self.config,
                effect = cfg.effect,
                fn = S.isFunction(effect) ? effect : Effects[effect];

                    fn.call(self, fromEls, toEls, function () {
                        self._fireOnSwitch(index);
                    }, index, direction);
                }

            });

        }, { host: 'switchable' });
        KISSY.add('autoplay', function (S, undefined) {

            var Event = S.Event,
        Switchable = S.Switchable;

            /**
            * 添加默认配置
            */
            S.mix(Switchable.Config, {
                autoplay: false,
                interval: 5, // 自动播放间隔时间
                pauseOnHover: true  // triggerType 为 mouse 时，鼠标悬停在 slide 上是否暂停自动播放
            });

            /**
            * 添加插件
            * attached members:
            *   - this.paused
            */
            Switchable.Plugins.push({

                name: 'autoplay',

                init: function (host) {
                    var cfg = host.config, interval = cfg.interval * 1000, timer;
                    if (!cfg.autoplay) return;

                    // 鼠标悬停，停止自动播放
                    if (cfg.pauseOnHover) {
                        Event.on(host.container, 'mouseenter', function () {
                            host.stop();
                            host.paused = true; // paused 可以让外部知道 autoplay 的当前状态
                        });
                        Event.on(host.container, 'mouseleave', function () {
                            host.paused = false;
                            startAutoplay();
                        });
                    }

                    function startAutoplay() {
                        // 设置自动播放
                        timer = S.later(function () {
                            if (host.paused) return;

                            // 自动播放默认 forward（不提供配置），这样可以保证 circular 在临界点正确切换
                            host.switchTo(host.activeIndex < host.length - 1 ? host.activeIndex + 1 : 0, 'forward');
                        }, interval, true);
                    }

                    // go
                    startAutoplay();

                    // 添加 stop 方法，使得外部可以停止自动播放
                    host.stop = function () {
                        if (timer) {
                            timer.cancel();
                            timer = undefined;
                        }
                    }
                }
            });

        }, { host: 'switchable' });
        KISSY.add('circular', function (S, undefined) {

            var DOM = S.DOM,
        POSITION = 'position', RELATIVE = 'relative',
        LEFT = 'left', TOP = 'top',
        EMPTY = '', PX = 'px',
        FORWARD = 'forward', BACKWARD = 'backward',
        SCROLLX = 'scrollx', SCROLLY = 'scrolly',
        Switchable = S.Switchable;

            /**
            * 添加默认配置
            */
            S.mix(Switchable.Config, {
                circular: false
            });

            /**
            * 循环滚动效果函数
            */
            function circularScroll(fromEls, toEls, callback, index, direction) {
                var self = this, cfg = self.config,
            len = self.length,
            activeIndex = self.activeIndex,
            isX = cfg.scrollType === SCROLLX,
            prop = isX ? LEFT : TOP,
            viewDiff = self.viewSize[isX ? 0 : 1],
            diff = -viewDiff * index,
            props = {},
            isCritical,
            isBackward = direction === BACKWARD;

                // 从第一个反向滚动到最后一个 or 从最后一个正向滚动到第一个
                isCritical = (isBackward && activeIndex === 0 && index === len - 1)
            || (direction === FORWARD && activeIndex === len - 1 && index === 0);

                if (isCritical) {
                    // 调整位置并获取 diff
                    diff = adjustPosition.call(self, self.panels, index, isBackward, prop, viewDiff);
                }
                props[prop] = diff + PX;

                // 开始动画
                if (self.anim) self.anim.stop();
                self.anim = new S.Anim(self.content, props, cfg.duration, cfg.easing, function () {
                    if (isCritical) {
                        // 复原位置
                        resetPosition.call(self, self.panels, index, isBackward, prop, viewDiff);
                    }
                    // free
                    self.anim = undefined;
                    callback();
                }, cfg.nativeAnim).run();
            }

            /**
            * 调整位置
            */
            function adjustPosition(panels, index, isBackward, prop, viewDiff) {
                var self = this, cfg = self.config,
            steps = cfg.steps,
            len = self.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

                // 调整 panels 到下一个视图中
                for (i = from; i < to; i++) {
                    DOM.css(panels[i], POSITION, RELATIVE);
                    DOM.css(panels[i], prop, (isBackward ? -1 : 1) * viewDiff * len);
                }

                // 偏移量
                return isBackward ? viewDiff : -viewDiff * len;
            }

            /**
            * 复原位置
            */
            function resetPosition(panels, index, isBackward, prop, viewDiff) {
                var self = this, cfg = self.config,
            steps = cfg.steps,
            len = self.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

                // 滚动完成后，复位到正常状态
                for (i = from; i < to; i++) {
                    DOM.css(panels[i], POSITION, EMPTY);
                    DOM.css(panels[i], prop, EMPTY);
                }

                // 瞬移到正常位置
                DOM.css(self.content, prop, isBackward ? -viewDiff * (len - 1) : EMPTY);
            }

            /**
            * 添加插件
            */
            Switchable.Plugins.push({

                name: 'circular',

                /**
                * 根据 effect, 调整初始状态
                */
                init: function (host) {
                    var cfg = host.config;

                    // 仅有滚动效果需要下面的调整
                    if (cfg.circular && (cfg.effect === SCROLLX || cfg.effect === SCROLLY)) {
                        // 覆盖滚动效果函数
                        cfg.scrollType = cfg.effect; // 保存到 scrollType 中
                        cfg.effect = circularScroll;
                    }
                }
            });

        }, { host: 'switchable' });
        KISSY.add('lazyload', function (S) {

            var DOM = S.DOM,
        EVENT_BEFORE_SWITCH = 'beforeSwitch',
        IMG_SRC = 'img-src',
        AREA_DATA = 'area-data',
        FLAGS = {},
        Switchable = S.Switchable;

            FLAGS[IMG_SRC] = 'data-ks-lazyload-custom';
            FLAGS[AREA_DATA] = 'ks-datalazyload-custom';

            /**
            * 添加默认配置
            */
            S.mix(Switchable.Config, {
                lazyDataType: AREA_DATA // or IMG_SRC
            });

            /**
            * 织入初始化函数
            */
            Switchable.Plugins.push({

                name: 'lazyload',

                init: function (host) {
                    var DataLazyload = S.DataLazyload,
                cfg = host.config,
                type = cfg.lazyDataType, flag = FLAGS[type];

                    if (!DataLazyload || !type || !flag) return; // 没有延迟项

                    host.on(EVENT_BEFORE_SWITCH, loadLazyData);

                    /**
                    * 加载延迟数据
                    */
                    function loadLazyData(ev) {
                        var steps = cfg.steps,
                    from = ev.toIndex * steps,
                    to = from + steps;

                        DataLazyload.loadCustomLazyData(host.panels.slice(from, to), type);
                        if (isAllDone()) {
                            host.detach(EVENT_BEFORE_SWITCH, loadLazyData);
                        }
                    }

                    /**
                    * 是否都已加载完成
                    */
                    function isAllDone() {
                        var elems, i, len,
                    isImgSrc = type === IMG_SRC,
                    tagName = isImgSrc ? 'img' : (type === AREA_DATA ? 'textarea' : '');

                        if (tagName) {
                            elems = S.query(tagName, host.container);
                            for (i = 0, len = elems.length; i < len; i++) {
                                if (isImgSrc ? DOM.attr(elems[i], flag) : DOM.hasClass(elems[i], flag)) return false;
                            }
                        }
                        return true;
                    }
                }
            });

        }, { host: 'switchable' });
        KISSY.add('countdown', function (S, undefined) {

            var DOM = S.DOM, Event = S.Event, Anim = S.Anim,
        Switchable = S.Switchable,
        CLS_PREFIX = 'ks-switchable-trigger-',
        TRIGGER_MASK_CLS = CLS_PREFIX + 'mask',
        TRIGGER_CONTENT_CLS = CLS_PREFIX + 'content',
        STYLE = 'style';

            /**
            * 添加默认配置
            */
            S.mix(Switchable.Config, {
                countdown: false,
                countdownFromStyle: '',      // 倒计时的初始样式
                countdownToStyle: 'width: 0' // 初始样式由用户在 css 里指定，配置里仅需要传入有变化的最终样式
            });

            /**
            * 添加插件
            */
            Switchable.Plugins.push({

                name: 'countdown',

                init: function (host) {
                    var cfg = host.config, interval = cfg.interval,
                triggers = host.triggers, masks = [],
                fromStyle = cfg.countdownFromStyle, toStyle = cfg.countdownToStyle,
                anim;

                    // 必须保证开启 autoplay 以及有 trigger 时，才能开启倒计时动画
                    if (!cfg.autoplay || !cfg.hasTriggers || !cfg.countdown) return;

                    // 为每个 trigger 增加倒计时动画覆盖层
                    S.each(triggers, function (trigger, i) {
                        trigger.innerHTML = '<div class="' + TRIGGER_MASK_CLS + '"></div>' +
                    '<div class="' + TRIGGER_CONTENT_CLS + '">' + trigger.innerHTML + '</div>';
                        masks[i] = trigger.firstChild;
                    });

                    // 鼠标悬停，停止自动播放
                    if (cfg.pauseOnHover) {
                        Event.on(host.container, 'mouseenter', function () {
                            // 先停止未完成动画
                            stopAnim();

                            // 快速平滑回退到初始状态
                            var mask = masks[host.activeIndex];
                            if (fromStyle) {
                                anim = new Anim(mask, fromStyle, .2, 'easeOut').run();
                            } else {
                                DOM.removeAttr(mask, STYLE);
                            }
                        });

                        Event.on(host.container, 'mouseleave', function () {
                            // 鼠标离开时立即停止未完成动画
                            stopAnim();

                            // 初始化动画参数，准备开始新一轮动画
                            DOM.removeAttr(masks[host.activeIndex], STYLE);

                            // 重新开始倒计时动画
                            S.later(startAnim, 200);
                        });
                    }

                    // panels 切换前，当前 trigger 完成善后工作以及下一 trigger 进行初始化
                    host.on('beforeSwitch', function () {
                        // 恢复前，先结束未完成动画效果
                        stopAnim();

                        // 将当前 mask 恢复动画前状态
                        DOM.removeAttr(masks[host.activeIndex], STYLE);
                    });

                    // panel 切换完成时，开始 trigger 的倒计时动画
                    host.on('switch', function () {
                        // 悬停状态，当用户主动触发切换时，不需要倒计时动画
                        if (!host.paused) {
                            startAnim();
                        }
                    });

                    // 开始第一次
                    startAnim(host.activeIndex);

                    // 开始倒计时动画
                    function startAnim() {
                        stopAnim(); // 开始之前，先确保停止掉之前的
                        anim = new Anim(masks[host.activeIndex], toStyle, interval - 1).run(); // -1 是为了动画结束时停留一下，使得动画更自然
                    }

                    // 停止所有动画
                    function stopAnim() {
                        if (anim) {
                            anim.stop();
                            anim = undefined;
                        }
                    }
                }
            });

        }, { requires: 'switchable' });
    }
});