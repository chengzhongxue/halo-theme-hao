let halo = {
    darkComment: () => {
        if (document.querySelector('#comment div').shadowRoot.querySelector('.halo-comment-widget').classList != null) {
            let commentDOMclass = document.querySelector('#comment div').shadowRoot.querySelector('.halo-comment-widget').classList
            if (commentDOMclass.contains('light'))
                commentDOMclass.replace('light', 'dark')
            else
                commentDOMclass.replace('dark', 'light')
        }

    },

    dataCodeTheme: () => {

        var t = document.documentElement.getAttribute('data-theme')
        var e = document.querySelector("link[data-code-theme=light]"),
            o = document.querySelector("link[data-code-theme=dark]");
        (o || e) && ("light" === t ? (o.disabled = !0, e.disabled = !1) : (e.disabled = !0, o.disabled = !1))

    },

    /**
     * 代码
     * 只适用于halo的代码渲染
     */
    addPrismTool: () => {
        if (typeof Prism === 'undefined' || typeof document === 'undefined') {
            return;
        }

        if (!Prism.plugins.toolbar) {
            console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.');

            return;
        }


        const enable = GLOBAL_CONFIG.prism.enable;
        if (!enable) return;
        const isEnableTitle = GLOBAL_CONFIG.prism.enable_title;
        const isEnableHr = GLOBAL_CONFIG.prism.enable_hr;
        const isEnableLine = GLOBAL_CONFIG.prism.enable_line;
        const isEnableCopy = GLOBAL_CONFIG.prism.enable_copy;
        const isEnableExpander = GLOBAL_CONFIG.prism.enable_expander;
        const prismLimit = GLOBAL_CONFIG.prism.prism_limit;
        const isEnableHeightLimit = GLOBAL_CONFIG.prism.enable_height_limit;

        // https://stackoverflow.com/a/30810322/7595472

        /** @param {CopyInfo} copyInfo */
        function fallbackCopyTextToClipboard(copyInfo) {
            var textArea = document.createElement('textarea');
            textArea.value = copyInfo.getText();

            // Avoid scrolling to bottom
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.position = 'fixed';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                setTimeout(function () {
                    if (successful) {
                        copyInfo.success();
                    } else {
                        copyInfo.error();
                    }
                }, 1);
            } catch (err) {
                setTimeout(function () {
                    copyInfo.error(err);
                }, 1);
            }

            document.body.removeChild(textArea);
        }

        /** @param {CopyInfo} copyInfo */
        function copyTextToClipboard(copyInfo) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(copyInfo.getText()).then(copyInfo.success, function () {
                    // try the fallback in case `writeText` didn't work
                    fallbackCopyTextToClipboard(copyInfo);
                });
            } else {
                fallbackCopyTextToClipboard(copyInfo);
            }
        }

        /**
         * Selects the text content of the given element.
         *
         * @param {Element} element
         */
        function selectElementText(element) {
            // https://stackoverflow.com/a/20079910/7595472
            window.getSelection().selectAllChildren(element);
        }

        /**
         * Traverses up the DOM tree to find data attributes that override the default plugin settings.
         *
         * @param {Element} startElement An element to start from.
         * @returns {Settings} The plugin settings.
         * @typedef {Record<"copy" | "copy-error" | "copy-success" | "copy-timeout", string | number>} Settings
         */
        function getSettings(startElement) {
            /** @type {Settings} */
            var settings = {
                'copy': 'Copy',
                'copy-error': 'Press Ctrl+C to copy',
                'copy-success': 'Copied!',
                'copy-timeout': 5000
            };

            var prefix = 'data-prismjs-';
            for (var key in settings) {
                var attr = prefix + key;
                var element = startElement;
                while (element && !element.hasAttribute(attr)) {
                    element = element.parentElement;
                }
                if (element) {
                    settings[key] = element.getAttribute(attr);
                }
            }
            return settings;
        }


        var r = Prism.plugins.toolbar.hook = function (a) {


            var r = a.element.parentNode;
            var toolbar = r.nextElementSibling;

            //标题
            isEnableTitle && toolbar.classList.add("c-title")
            //标题分割线
            isEnableHr && toolbar.classList.add("c-hr")
            var customItem = document.createElement("div");
            customItem.className = 'custom-item absolute top-0'

            //复制
            if (isEnableCopy) {
                var copy = document.createElement("i");

                copy.className = 'haofont hao-icon-paste copy-button code-copy cursor-pointer'
                customItem.appendChild(copy)

                copy.addEventListener('click', function () {
                    copyTextToClipboard({
                        getText: function () {
                            return a.element.textContent;
                        },
                        success: function () {
                            btf.snackbarShow('复制成功')
                            setState('copy-success');
                            resetText();
                        },
                        error: function () {
                            setState('copy-error');

                            setTimeout(function () {
                                selectElementText(a.element);
                            }, 1);

                            resetText();
                        }
                    });

                });

            }


            const prismToolsFn = function (e) {
                const $target = e.target.classList;
                if ($target.contains("code-expander")) prismShrinkFn(this);
            };

            //折叠
            if (isEnableExpander) {
                var expander = document.createElement("i");
                expander.className = 'fa-sharp fa-solid fa-caret-down code-expander cursor-pointer'
                customItem.appendChild(expander)

                expander.addEventListener('click', prismToolsFn)


            }


            const expandCode = function () {
                this.classList.toggle("expand-done");
                this.style.display = "none";
                r.classList.toggle("expand-done");
            };

            if (isEnableHeightLimit && r.offsetHeight > prismLimit) {

                r.classList.add("close")
                const ele = document.createElement("div");
                ele.className = "code-expand-btn";
                ele.innerHTML = '<i class="haofont hao-icon-angle-double-down"></i>';
                ele.addEventListener("click", expandCode);
                r.offsetParent.appendChild(ele);
            }


            const prismShrinkFn = ele => {
                const $nextEle = r.offsetParent.lastElementChild.classList
                toolbar.classList.toggle('c-expander')
                r.classList.toggle("expand-done-expander");
                if (toolbar.classList.contains('c-expander')) {
                    r.firstElementChild.style.display = "none";
                    if ($nextEle.contains('code-expand-btn')) {
                        r.offsetParent.lastElementChild.style.display = "none";
                    }
                } else {
                    r.firstElementChild.style.display = "block";
                    if ($nextEle.contains('code-expand-btn') && !r.classList.contains('expand-done')) {
                        r.offsetParent.lastElementChild.style.display = "block";
                    }
                }

            };


            toolbar.appendChild(customItem)

            var settings = getSettings(a.element);


            function resetText() {
                setTimeout(function () {
                    setState('copy');
                }, settings['copy-timeout']);
            }

            /** @param {"copy" | "copy-error" | "copy-success"} state */
            function setState(state) {
                copy.setAttribute('data-copy-state', state);
            }

        };
        Prism.hooks.add("complete", r)
    },
    changeBox: {
        changeBg: (e, t) => {
            let n = document.getElementById("web_bg");
            "#" == e.charAt(0) ? (n.style.backgroundColor = e,
                n.style.backgroundImage = "none") : n.style.backgroundImage = e,
            t || halo.changeBox.saveData("blogbg", e)
        },
        saveData: (e, t) => {
            localStorage.setItem(e, JSON.stringify({
                time: Date.now(),
                data: t
            }))
        },
        loadData: (e, t) => {
            let n = JSON.parse(localStorage.getItem(e));
            if (n) {
                let e = Date.now() - n.time;
                if (e < 60 * t * 1e3 && e > -1)
                    return n.data
            }
            return 0
        },
        winbox: "",
        createWinbox: () => {
            let e = document.createElement("div");
            document.body.appendChild(e),
                halo.changeBox.winbox = WinBox({
                    id: "changeBgBox",
                    index: 999,
                    title: "切换背景",
                    x: "center",
                    y: "center",
                    minwidth: "300px",
                    height: "60%",
                    background: "#9e9292cc",
                    onmaximize: () => {
                        e.innerHTML = "<style>body::-webkit-scrollbar {display: none;}div#changeBgBox {width: 100% !important;}#article-container {padding: 10px;}</style>"
                    }
                    ,
                    onrestore: () => {
                        e.innerHTML = ""
                    }
                }),
                halo.changeBox.winResize(),
                window.addEventListener("resize", halo.changeBox.winResize),
                halo.changeBox.winbox.body.innerHTML = '\n    <div id="console-content" class="console-insecmenu">\n    <div id="console-secmenu" style="opacity: 1; z-index: 1;">\n      <div id="blog-bg">\n      <div style="text-align: right;">\n        <span>\n        <button id="resetbg" onclick="localStorage.removeItem(\'blogbg\');localStorage.removeItem(\'autoTheme\');localStorage.removeItem(\'manualTheme\');location.reload();">\n        <a><i class="fa-solid fa-arrows-rotate"></i> 重置背景</a></div>\n        </button>\n        </span>\n        <h2 id="精选">\n          <a href="#精选" class="headerlink" title="精选"></a>精选\n          <span style="font-size:14px;font-weight:normal">(一天限定)</span>\n        </h2>\n    \n    <div class="bgbox">\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/99118291_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/99118291_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104805298_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104805298_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/94753933_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/94753933_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/102039193_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/102039193_p0.webp)\')"></a>\n  </div>\n\n\n  <h2 id="桌面端">\n    <a href="#桌面端" class="headerlink" title="桌面端"></a>\n    桌面端\n  </h2>\n  <div class="bgbox">\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104858108_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104858108_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104794003_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104794003_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/Fjy3RDqaMAAYj-j.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/Fjy3RDqaMAAYj-j.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/105246861_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/105246861_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/107065329_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/107065329_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/100917024_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/100917024_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/97246723_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/97246723_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/101057052_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/101057052_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/102891840_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/102891840_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/FovcuKBacAIuzGh.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/FovcuKBacAIuzGh.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/FoHgA2caEAUwc1J.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/FoHgA2caEAUwc1J.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/101592855_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/101592855_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104854285_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104854285_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104124365_p0.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/104124365_p0.webp)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/7f3b224bly1h87zi4xgm4j21hc0u0kds.webp)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/7f3b224bly1h87zi4xgm4j21hc0u0kds.webp)\')"></a>\n  </div></div>\n\n\n<h2 id="移动端">\n  <a href="#移动端" class="headerlink" title="移动端"></a>\n  移动端\n</h2>\n<div class="bgbox">\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/92388678_p0.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/92388678_p0.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/101199282_p0_502358.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/101199282_p0_502358.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/94944536_p0_1878082.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/94944536_p0_1878082.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/1830fe25730a9e816cbea5c5980e9a10.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/1830fe25730a9e816cbea5c5980e9a10.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/100848188_p0_3810321.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/100848188_p0_3810321.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/96558903_p0_2947130.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/96558903_p0_2947130.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/272ab044d85d2c0e55b528d0a387554d.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/272ab044d85d2c0e55b528d0a387554d.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/94288367_p2_2179695.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/94288367_p2_2179695.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/100613394_p0_1122006.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/100613394_p0_1122006.webp)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/94200795_p0.webp)" class="pimgbox" onclick="halo.changeBox.changeBg(\'url(https://gitcode.net/RedStone_Kun/apicx/raw/master/imgs/moe/mp/94200795_p0.webp)\')"></a>\n</div>\n\n\x3c!-- <h2 id="4K">4K</h2>\n<div class="bgbox">\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/104289966_p0.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/104289966_p0.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/104289966_p1.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/104289966_p1.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/101123738_p0.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/101123738_p0.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/1113371.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/1113371.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/1115199.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/1115199.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/1137402.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/1137402.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/1197417.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/1197417.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/1198589.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/1198589.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/1260845.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/1260845.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/1261011.png!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/1261011.png)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/1273976.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/1273976.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/763891.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/763891.jpg)\')"></a>\n  <a href="javascript:;" rel="noopener external nofollow" style="background-image:url(https://cdn.ichika.cc/WallPaper/800800.jpg!cover)" class="imgbox" onclick="halo.changeBox.changeBg(\'url(https://cdn.ichika.cc/WallPaper/800800.jpg)\')"></a>\n</div> --\x3e\n\n\n    <h2 id="渐变"><a href="#渐变" class="headerlink" title="渐变"></a>渐变</h2>\n    <div class="bgbox">\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #eecda3, #ef629f)" onclick="halo.changeBox.changeBg(\'linear-gradient(to right, #eecda3, #ef629f)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #B7D31E, #42CE1E)" onclick="halo.changeBox.changeBg(\'linear-gradient(to right, #B7D31E, #42CE1E)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #06DE86, #06A5DE)" onclick="halo.changeBox.changeBg(\'linear-gradient(to right, #06DE86, #06A5DE)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #189BC4, #183DC4)" onclick="halo.changeBox.changeBg(\'linear-gradient(to right, #189BC4, #183DC4)\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: linear-gradient(to right, #C018C4, #C41818)" onclick="halo.changeBox.changeBg(\'linear-gradient(to right, #C018C4, #C41818)\')"></a>\n    </div>\n\n    <h2 id="纯色"><a href="#纯色" class="headerlink" title="纯色"></a>纯色</h2>\n    <div class="bgbox">\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #fff" onclick="halo.changeBox.changeBg(\'#fff\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #49A6E9" onclick="halo.changeBox.changeBg(\'#49A6E9\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #F7CEFF" onclick="halo.changeBox.changeBg(\'#F7CEFF\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #FFFFCE" onclick="halo.changeBox.changeBg(\'#FFFFCE\')"></a>\n    <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #CFFFCE" onclick="halo.changeBox.changeBg(\'#CFFFCE\')"></a>\n    </div></div></div></div></div></div></div></div></div>\n  '
        },
        winResize: () => {
            let e = document.querySelector("#changeBgBox");
            if (e && !e.classList.contains("min") && !e.classList.contains("max")) {
                var t = document.documentElement.clientWidth;
                t <= 768 ? halo.changeBox.winbox.resize(.95 * t + "px", "90%").move("center", "center") : halo.changeBox.winbox.resize(.6 * t + "px", "70%").move("center", "center")
            }
        },
        toggleWinbox: () => {
            document.querySelector("#changeBgBox") ? halo.changeBox.winbox.toggleClass("hide") : halo.changeBox.createWinbox()
        }
    }
}