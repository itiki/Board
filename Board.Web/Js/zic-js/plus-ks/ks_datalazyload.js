define(function (require, exports, module) {
    return function (KISSY) {
        KISSY.add('datalazyload', function (S, undefined) {

            var DOM = S.DOM, Event = S.Event,
        win = window, doc = document,

        IMG_SRC_DATA = 'data-ks-lazyload',
        AREA_DATA_CLS = 'ks-datalazyload',
        CUSTOM = '-custom',
        MANUAL = 'manual',
        DISPLAY = 'display', DEFAULT = 'default', NONE = 'none',
        SCROLL = 'scroll', RESIZE = 'resize',

        defaultConfig = {

            /**
            * 懒处理模式
            *   auto   - 自动化。html 输出时，不对 img.src 做任何处理
            *   manual - 输出 html 时，已经将需要延迟加载的图片的 src 属性替换为 IMG_SRC_DATA
            * 注：对于 textarea 数据，只有手动模式
            */
            mod: MANUAL,

            /**
            * 当前视窗往下，diff px 外的 img/textarea 延迟加载
            * 适当设置此值，可以让用户在拖动时感觉数据已经加载好
            * 默认为当前视窗高度（两屏以外的才延迟加载）
            */
            diff: DEFAULT,

            /**
            * 图像的占位图，默认无
            */
            placeholder: NONE,

            /**
            * 是否执行 textarea 里面的脚本
            */
            execScript: true
        };

            /**
            * 延迟加载组件
            * @constructor
            */
            function DataLazyload(containers, config) {
                var self = this;

                // factory or constructor
                if (!(self instanceof DataLazyload)) {
                    return new DataLazyload(containers, config);
                }

                // 允许仅传递 config 一个参数
                if (config === undefined) {
                    config = containers;
                    containers = [doc];
                }

                // containers 是一个 HTMLElement 时
                if (!S.isArray(containers)) {
                    containers = [S.get(containers) || doc];
                }

                /**
                * 图片所在容器（可以多个），默认为 [doc]
                * @type Array
                */
                self.containers = containers;

                /**
                * 配置参数
                * @type Object
                */
                self.config = S.merge(defaultConfig, config);

                /**
                * 需要延迟下载的图片
                * @type Array
                */
                //self.images

                /**
                * 需要延迟处理的 textarea
                * @type Array
                */
                //self.areaes

                /**
                * 和延迟项绑定的回调函数
                * @type object
                */
                self.callbacks = { els: [], fns: [] };

                /**
                * 开始延迟的 Y 坐标
                * @type number
                */
                //self.threshold

                self._init();
            }

            S.augment(DataLazyload, {

                /**
                * 初始化
                * @protected
                */
                _init: function () {
                    var self = this;
                    self.threshold = self._getThreshold();

                    self._filterItems();
                    self._initLoadEvent();
                },

                /**
                * 获取并初始化需要延迟的 images 和 areaes
                * @protected
                */
                _filterItems: function () {
                    var self = this,
                containers = self.containers,
                n, N, imgs, areaes, i, img,
                lazyImgs = [], lazyAreas = [];

                    for (n = 0, N = containers.length; n < N; ++n) {
                        imgs = S.query('img', containers[n]);
                        lazyImgs = lazyImgs.concat(S.filter(imgs, self._filterImg, self));

                        areaes = S.query('textarea', containers[n]);
                        lazyAreas = lazyAreas.concat(S.filter(areaes, self._filterArea, self));
                    }

                    self.images = lazyImgs;
                    self.areaes = lazyAreas;
                },

                /**
                * filter for lazyload image
                */
                _filterImg: function (img) {
                    var self = this,
                dataSrc = img.getAttribute(IMG_SRC_DATA),
                threshold = self.threshold,
                placeholder = self.config.placeholder,
                isManualMod = self.config.mod === MANUAL;

                    // 手工模式，只处理有 data-src 的图片
                    if (isManualMod) {
                        if (dataSrc) {
                            if (placeholder !== NONE) {
                                img.src = placeholder;
                            }
                            return true;
                        }
                    }
                    // 自动模式，只处理 threshold 外无 data-src 的图片
                    else {
                        // 注意：已有 data-src 的项，可能已有其它实例处理过，不用再次处理
                        if (DOM.offset(img).top > threshold && !dataSrc) {
                            DOM.attr(img, IMG_SRC_DATA, img.src);
                            if (placeholder !== NONE) {
                                img.src = placeholder;
                            } else {
                                img.removeAttribute('src');
                            }
                            return true;
                        }
                    }
                },

                /**
                * filter for lazyload textarea
                */
                _filterArea: function (area) {
                    return DOM.hasClass(area, AREA_DATA_CLS);
                },

                /**
                * 初始化加载事件
                * @protected
                */
                _initLoadEvent: function () {
                    var timer, self = this, resizeHandler;

                    // scroll 和 resize 时，加载图片
                    Event.on(win, SCROLL, loader);
                    Event.on(win, RESIZE, (resizeHandler = function () {
                        self.threshold = self._getThreshold();
                        loader();
                    }));

                    // 需要立即加载一次，以保证第一屏的延迟项可见
                    if (self._getItemsLength()) {
                        S.ready(function () {
                            loadItems();
                        });
                    }

                    // 加载函数
                    function loader() {
                        if (timer) return;
                        timer = S.later(function () {
                            loadItems();
                            timer = null;
                        }, 100); // 0.1s 内，用户感觉流畅
                    }

                    // 加载延迟项
                    function loadItems() {
                        self._loadItems();
                        if (self._getItemsLength() === 0) {
                            Event.remove(win, SCROLL, loader);
                            Event.remove(win, RESIZE, resizeHandler);
                        }
                    }
                },

                /**
                * 加载延迟项
                */
                _loadItems: function () {
                    var self = this;
                    self._loadImgs();
                    self._loadAreas();
                    self._fireCallbacks();
                },

                /**
                * 加载图片
                * @protected
                */
                _loadImgs: function () {
                    var self = this;
                    self.images = S.filter(self.images, self._loadImg, self);
                },

                /**
                * 监控滚动，处理图片
                */
                _loadImg: function (img) {
                    var self = this,
                scrollTop = DOM.scrollTop(),
                threshold = self.threshold + scrollTop,
                offset = DOM.offset(img);

                    if (offset.top <= threshold) {
                        self._loadImgSrc(img);
                    } else {
                        return true;
                    }
                },

                /**
                * 加载图片 src
                * @static
                */
                _loadImgSrc: function (img, flag) {
                    flag = flag || IMG_SRC_DATA;
                    var dataSrc = img.getAttribute(flag);

                    if (dataSrc && img.src != dataSrc) {
                        img.src = dataSrc;
                        img.removeAttribute(flag);
                    }
                },

                /**
                * 加载 textarea 数据
                * @protected
                */
                _loadAreas: function () {
                    var self = this;
                    self.areaes = S.filter(self.areaes, self._loadArea, self);
                },

                /**
                * 监控滚动，处理 textarea
                */
                _loadArea: function (area) {
                    var self = this, top,
                isHidden = DOM.css(area, DISPLAY) === NONE;

                    // 注：area 可能处于 display: none 状态，DOM.offset(area).top 返回 0
                    // 这种情况下用 area.parentNode 的 Y 值来替代
                    top = DOM.offset(isHidden ? area.parentNode : area).top;

                    if (top <= self.threshold + DOM.scrollTop()) {
                        self._loadAreaData(area.parentNode, area, self.config.execScript);
                    } else {
                        return true;
                    }
                },

                /**
                * 从 textarea 中加载数据
                * @static
                */
                _loadAreaData: function (container, area, execScript) {
                    // 采用隐藏 textarea 但不去除方式，去除会引发 Chrome 下错乱
                    area.style.display = NONE;
                    area.className = ''; // clear hook

                    var content = DOM.create('<div>');
                    container.insertBefore(content, area);
                    DOM.html(content, area.value, execScript === undefined ? true : execScript);

                    //area.value = ''; // bug fix: 注释掉，不能清空，否则 F5 刷新，会丢内容
                },

                /**
                * 触发回调
                */
                _fireCallbacks: function () {
                    var self = this,
                callbacks = self.callbacks,
                els = callbacks.els, fns = callbacks.fns,
                scrollTop = DOM.scrollTop(),
                threshold = self.threshold + scrollTop,
                i, el, fn, remainEls = [], remainFns = [];

                    for (i = 0; (el = els[i]) && (fn = fns[i++]); ) {
                        if (DOM.offset(el).top <= threshold) {
                            fn.call(el);
                        } else {
                            remainEls.push(el);
                            remainFns.push(fn);
                        }

                    }
                    callbacks.els = remainEls;
                    callbacks.fns = remainFns;
                },

                /**
                * 添加回调函数。当 el 即将出现在视图中时，触发 fn
                */
                addCallback: function (el, fn) {
                    var callbacks = this.callbacks;
                    el = S.get(el);

                    if (el && S.isFunction(fn)) {
                        callbacks.els.push(el);
                        callbacks.fns.push(fn);
                    }
                },

                /**
                * 获取阈值
                * @protected
                */
                _getThreshold: function () {
                    var diff = this.config.diff,
                vh = DOM['viewportHeight']();

                    if (diff === DEFAULT) return 2 * vh; // diff 默认为当前视窗高度（两屏以外的才延迟加载）
                    else return vh + (+diff); // 将 diff 转换成数值
                },

                /**
                * 获取当前延迟项的数量
                * @protected
                */
                _getItemsLength: function () {
                    var self = this;
                    return self.images.length + self.areaes.length + self.callbacks.els.length;
                },

                /**
                * 加载自定义延迟数据
                * @static
                */
                loadCustomLazyData: function (containers, type) {
                    var self = this, area, imgs;

                    // 支持数组
                    if (!S.isArray(containers)) {
                        containers = [S.get(containers)];
                    }

                    // 遍历处理
                    S.each(containers, function (container) {
                        switch (type) {
                            case 'img-src':
                                if (container.nodeName === 'IMG') { // 本身就是图片
                                    imgs = [container];
                                } else {
                                    imgs = S.query('img', container);
                                }

                                S.each(imgs, function (img) {
                                    self._loadImgSrc(img, IMG_SRC_DATA + CUSTOM);
                                });

                                break;

                            default:
                                area = S.get('textarea', container);
                                if (area && DOM.hasClass(area, AREA_DATA_CLS + CUSTOM)) {
                                    self._loadAreaData(container, area);
                                }
                        }
                    });
                }
            });

            // attach static methods
            S.mix(DataLazyload, DataLazyload.prototype, true, ['loadCustomLazyData', '_loadImgSrc', '_loadAreaData']);

            S.DataLazyload = DataLazyload;

        }, { requires: ['core'] });
    }
});