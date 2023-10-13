let halo = {
    darkComment : ()=>{
        if(document.querySelector('#comment div').shadowRoot.querySelector('.halo-comment-widget').classList != null){
            let commentDOMclass =  document.querySelector('#comment div').shadowRoot.querySelector('.halo-comment-widget').classList
            if(commentDOMclass.contains('light'))
                commentDOMclass.replace('light','dark')
            else
                commentDOMclass.replace('dark','light')
        }

    },

    dataCodeTheme : ()=>{

        var t = document.documentElement.getAttribute('data-theme')
        var e = document.querySelector("link[data-code-theme=light]"),
            o = document.querySelector("link[data-code-theme=dark]");
        (o || e) && ("light" === t ? (o.disabled = !0, e.disabled = !1) : (e.disabled = !0, o.disabled = !1))

    },

    /**
     * 代码
     * 只适用于halo的代码渲染
     */
    addPrismTool : ()=>{
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
            if(isEnableCopy){
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
            if(isEnableExpander){
                var expander = document.createElement("i");
                expander.className = 'fa-sharp fa-solid haofont hao-icon-angle-down code-expander cursor-pointer'
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
                    if($nextEle.contains('code-expand-btn')){
                        r.offsetParent.lastElementChild.style.display = "none";
                    }
                } else {
                    r.firstElementChild.style.display = "block";
                    if($nextEle.contains('code-expand-btn') &&  !r.classList.contains('expand-done')){
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

    addScript: (e,t,n)=>{
        if (document.getElementById(e))
            return n ? n() : void 0;
        let a = document.createElement("script");
        a.src = t,
            a.id = e,
        n && (a.onload = n),
            document.head.appendChild(a)
    },

    danmu: ()=>{
        const e = new EasyDanmakuMin({
            el: "#danmu",
            line: 10,
            speed: 20,
            hover: !0,
            loop: !0
        });
        let t = saveToLocal.get("danmu");
        if (t)
            e.batchSend(t, !0);
        else {
            let n = [];
            if(GLOBAL_CONFIG.source.comments.use == 'Twikoo'){
                fetch(GLOBAL_CONFIG.source.twikoo.twikooUrl, {
                    method: "POST",
                    body: JSON.stringify({
                        event: "GET_RECENT_COMMENTS",
                        accessToken: GLOBAL_CONFIG.source.twikoo.accessToken,
                        includeReply: !1,
                        pageSize: 5
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((e=>e.json())).then((({data: t})=>{
                        t.forEach((e=>{
                                null == e.avatar && (e.avatar = "https://cravatar.cn/avatar/d615d5793929e8c7d70eab5f00f7f5f1?d=mp"),
                                    n.push({
                                        avatar: e.avatar,
                                        content: e.nick + "：" + btf.changeContent(e.comment),
                                        href: e.url + '#' + e.id

                                    })
                            }
                        )),
                            e.batchSend(n, !0),
                            saveToLocal.set("danmu", n, .02)
                    }
                ))
            }
            if(GLOBAL_CONFIG.source.comments.use == 'Artalk'){
                const statheaderList = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Origin': window.location.origin
                    },
                    body: new URLSearchParams({
                        'site_name': GLOBAL_CONFIG.source.artalk.siteName,
                        'limit': '100',
                        'type':'latest_comments'
                    })
                }
                fetch(GLOBAL_CONFIG.source.artalk.artalkUrl + 'api/stat', statheaderList)
                    .then((e=>e.json())).then((({data: t})=>{
                        t.forEach((e=>{
                                n.push({
                                    avatar: 'https://cravatar.cn/avatar/' + e.email_encrypted + '?d=mp&s=240',
                                    content: e.nick + "：" + btf.changeContent(e.content_marked),
                                    href: e.page_url + '#atk-comment-' + e.id

                                })
                            }
                        )),
                            e.batchSend(n, !0),
                            saveToLocal.set("danmu", n, .02)
                    }
                ))
            }
            if(GLOBAL_CONFIG.source.comments.use == 'Waline'){
                const loadWaline = () => {
                    Waline.RecentComments({
                        serverURL: GLOBAL_CONFIG.source.waline.serverURL,
                        count: 50
                    }).then(({ comments }) => {
                        const walineArray = comments.map(e => {
                            return {
                                'content': e.nick + "：" + btf.changeContent(e.comment),
                                'avatar': e.avatar,
                                'href': e.url + '#' + e.objectId,
                            }
                        })
                        e.batchSend(walineArray, !0),
                            saveToLocal.set("danmu", walineArray, .02)
                    })
                }
                if (typeof Waline === 'object') loadWaline()
                else getScript(GLOBAL_CONFIG.source.waline.js).then(loadWaline)
            }

        }
        document.getElementById("danmuBtn").innerHTML = "<button class=\"hideBtn\" onclick=\"document.getElementById('danmu').classList.remove('hidedanmu')\">显示弹幕</button> <button class=\"hideBtn\" onclick=\"document.getElementById('danmu').classList.add('hidedanmu')\">隐藏弹幕</button>"
    },

    changeMarginLeft(element) {
        var randomMargin = Math.floor(Math.random() * 901) + 100; // 生成100-1000之间的随机数
        element.style.marginLeft = randomMargin + 'px';
    }


}