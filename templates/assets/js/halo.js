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


            //折叠
            if(isEnableExpander){
                var expander = document.createElement("i");
                expander.className = 'fa-sharp fa-solid fa-caret-down code-expander cursor-pointer'
                customItem.appendChild(expander)


                const expanderCode = function () {
                    r.firstElementChild.classList.toggle('c-toggle')
                    toolbar.classList.toggle('c-expander')
                }

                expander.addEventListener('click', expanderCode)
            }

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
    }
}