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

    addScript: (e, t, n) => {
        if (document.getElementById(e))
            return n ? n() : void 0;
        let a = document.createElement("script");
        a.src = t,
            a.id = e,
        n && (a.onload = n),
            document.head.appendChild(a)
    },

    danmu: () => {
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
            if (GLOBAL_CONFIG.source.comments.use == 'Twikoo') {
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
                }).then((e => e.json())).then((({data: t}) => {
                        t.forEach((e => {
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
            if (GLOBAL_CONFIG.source.comments.use == 'Artalk') {
                const statheaderList = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Origin': window.location.origin
                    },
                    body: new URLSearchParams({
                        'site_name': GLOBAL_CONFIG.source.artalk.siteName,
                        'limit': '100',
                        'type': 'latest_comments'
                    })
                }
                fetch(GLOBAL_CONFIG.source.artalk.artalkUrl + 'api/stat', statheaderList)
                    .then((e => e.json())).then((({data: t}) => {
                        t.forEach((e => {
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
            if (GLOBAL_CONFIG.source.comments.use == 'Waline') {
                const loadWaline = () => {
                    Waline.RecentComments({
                        serverURL: GLOBAL_CONFIG.source.waline.serverURL,
                        count: 50
                    }).then(({comments}) => {
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
    },

    getTopSponsors() {
        function md5(string, bit) {
            function md5_RotateLeft(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            }

            function md5_AddUnsigned(lX, lY) {
                let lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }

            function md5_F(x, y, z) {
                return (x & y) | ((~x) & z);
            }

            function md5_G(x, y, z) {
                return (x & z) | (y & (~z));
            }

            function md5_H(x, y, z) {
                return (x ^ y ^ z);
            }

            function md5_I(x, y, z) {
                return (y ^ (x | (~z)));
            }

            function md5_FF(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            }

            function md5_GG(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            }

            function md5_HH(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            }

            function md5_II(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            }

            function md5_ConvertToWordArray(string) {
                let lWordCount;
                const lMessageLength = string.length;
                const lNumberOfWords_temp1 = lMessageLength + 8;
                const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                const lWordArray = Array(lNumberOfWords - 1);
                let lBytePosition = 0;
                let lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            }

            function md5_WordToHex(lValue) {
                let WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            }

            function md5_Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                let utfText = "";
                for (let n = 0; n < string.length; n++) {
                    const c = string.charCodeAt(n);
                    if (c < 128) {
                        utfText += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utfText += String.fromCharCode((c >> 6) | 192);
                        utfText += String.fromCharCode((c & 63) | 128);
                    } else {
                        utfText += String.fromCharCode((c >> 12) | 224);
                        utfText += String.fromCharCode(((c >> 6) & 63) | 128);
                        utfText += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utfText;
            }
            let x = Array();
            let k, AA, BB, CC, DD, a, b, c, d;
            const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
            const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
            const S41 = 6, S42 = 10, S43 = 15, S44 = 21;
            string = md5_Utf8Encode(string);
            x = md5_ConvertToWordArray(string);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = md5_FF(a, b, c, d, x[k], S11, 0xD76AA478);
                d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = md5_GG(b, c, d, a, x[k], S24, 0xE9B6C7AA);
                a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = md5_HH(d, a, b, c, x[k], S32, 0xEAA127FA);
                c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = md5_II(a, b, c, d, x[k], S41, 0xF4292244);
                d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = md5_AddUnsigned(a, AA);
                b = md5_AddUnsigned(b, BB);
                c = md5_AddUnsigned(c, CC);
                d = md5_AddUnsigned(d, DD);
            }
            if (bit === 32) {
                return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
            }
            return (md5_WordToHex(b) + md5_WordToHex(c)).toLowerCase();
        }

        var show_num = GLOBAL_CONFIG.source.power.showNum


        function getPower() {
            const url = "/apis/api.plugin.halo.run/v1alpha1/plugins/plugin-afdian/afdian/getSponsorList"
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (200 === data["ec"]) {
                        const values = data["data"]["list"];
                        saveToLocal.set('power-data', JSON.stringify(values), 10 / (60 * 24))
                        renderer(values);
                    }

                })
        }

        function renderer(values) {
            var data = getArrayItems(values, 1);
            let powerStar = document.getElementById("power-star")
            if (values.length === 0) {
                powerStar.href = GLOBAL_CONFIG.source.power.powerLink
                powerStar.innerHTML = ` 
                        <div id="power-star-image" style="background-image: url('/themes/theme-hao/assets/images/afadian/afadian.webp')">
                        </div>
                        <div class="power-star-body">
                            <div id="power-star-title">还没有人赞助～</div>
                            <div id="power-star-desc">为爱发电，点击赞助</div>
                        </div>`;
            } else {
                if (values.length === 1) {
                    powerStar.href = "https://afdian.net/u/" + data[0]["user"].user_id
                    powerStar.innerHTML = ` 
                        <div id="power-star-image" style="background-image: url(${data[0]["user"].avatar})">
                        </div>
                        <div class="power-star-body">
                            <div id="power-star-title">${data[0]["user"].name}</div>
                            <div id="power-star-desc">更多支持，为爱发电</div>
                        </div>`;
                }

                if (values.length > 1) {
                    var i = 0;
                    var htmlText = '';
                    for (let value of values) {
                        if (i > parseInt(show_num)) {
                            break;
                        }
                        htmlText += ` <a href="${"https://afdian.net/u/" + value["user"]["user_id"]}" rel="external nofollow" target="_blank" th:title="${value["user"]["name"]}">${value["user"]["name"]}</a>`;
                        i = i + 1;
                    }
                    if (document.getElementById("power-item-link")) {
                        document.getElementById("power-item-link").innerHTML = htmlText;
                    }
                }
            }
        }

        function init() {
            const data = saveToLocal.get('power-data')
            if (data) {
                renderer(JSON.parse(data))
            } else {
                getPower()
            }
        }

        document.getElementById("power-star") && init()
    }
    ,

    checkAd() {
        var default_enable = GLOBAL_CONFIG.source.footer.default_enable
        if (default_enable) {
            var adElement = document.getElementById("footer-banner");
            var notMusic = document.body.getAttribute("data-type") != "music"; // 检测是否为音乐页面
            if ((adElement.offsetWidth <= 0 || adElement.offsetHeight <= 0) && notMusic) {
                // 元素不可见，可能被拦截
                console.log("Element may be blocked by AdBlocker Ultimate");
                alert("页脚信息可能被AdBlocker Ultimate拦截，请检查广告拦截插件！")
            }
        }
    }


}
