"use strict";

function _createForOfIteratorHelper(e, t) {
    var o = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
    if (!o) {
        if (Array.isArray(e) || (o = _unsupportedIterableToArray(e)) || t && e && "number" == typeof e.length) {
            o && (e = o);
            var n = 0, r = function () {
            };
            return {
                s: r, n: function () {
                    return n >= e.length ? {done: !0} : {done: !1, value: e[n++]}
                }, e: function (e) {
                    throw e
                }, f: r
            }
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    var a, i = !0, c = !1;
    return {
        s: function () {
            o = o.call(e)
        }, n: function () {
            var e = o.next();
            return i = e.done, e
        }, e: function (e) {
            c = !0, a = e
        }, f: function () {
            try {
                i || null == o.return || o.return()
            } finally {
                if (c) throw a
            }
        }
    }
}

function _unsupportedIterableToArray(e, t) {
    if (e) {
        if ("string" == typeof e) return _arrayLikeToArray(e, t);
        var o = Object.prototype.toString.call(e).slice(8, -1);
        return "Object" === o && e.constructor && (o = e.constructor.name), "Map" === o || "Set" === o ? Array.from(e) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? _arrayLikeToArray(e, t) : void 0
    }
}

function _arrayLikeToArray(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var o = 0, n = new Array(t); o < t; o++) n[o] = e[o];
    return n
}

function _typeof(e) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    })(e)
}

function checkOpen() {
}

function coverColor() {
    var _document$getElementB,
        path = null === (_document$getElementB = document.getElementById("post-cover")) || void 0 === _document$getElementB ? void 0 : _document$getElementB.src,
        httpRequest;
    void 0 !== path ? (httpRequest = new XMLHttpRequest, httpRequest.open("GET", path + "?imageAve", !0), httpRequest.send(), httpRequest.onreadystatechange = function () {
        var json, obj, value, value;
        4 == httpRequest.readyState && 200 == httpRequest.status && (json = httpRequest.responseText, obj = eval("(" + json + ")"), value = obj.RGB, value = "#" + value.slice(2), "light" == getContrastYIQ(value) && (value = LightenDarkenColor(colorHex(value), -40)), document.styleSheets[0].addRule(":root", "--heo-main:" + value + "!important"), document.styleSheets[0].addRule(":root", "--heo-main-op:" + value + "23!important"), document.styleSheets[0].addRule(":root", "--heo-main-none:" + value + "00!important"), heo.initThemeColor(), document.getElementById("coverdiv").classList.add("loaded"))
    }) : (document.styleSheets[0].addRule(":root", "--heo-main: var(--heo-theme)!important"), document.styleSheets[0].addRule(":root", "--heo-main-op: var(--heo-theme-op)!important"), document.styleSheets[0].addRule(":root", "--heo-main-none: var(--heo-theme-none)!important"), heo.initThemeColor())
}

function colorHex(e) {
    var t = e;
    if (/^(rgb|RGB)/.test(t)) {
        for (var o = t.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(","), n = "#", r = 0; r < o.length; r++) {
            var a = Number(o[r]).toString(16);
            "0" === a && (a += a), n += a
        }
        return 7 !== n.length && (n = t), n
    }
    if (!/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(t)) return t;
    var i = t.replace(/#/, "").split("");
    if (6 === i.length) return t;
    if (3 === i.length) {
        for (var c = "#", r = 0; r < i.length; r += 1) c += i[r] + i[r];
        return c
    }
}

function colorRgb(e) {
    var t = e.toLowerCase();
    if (t && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(t)) {
        if (4 === t.length) {
            for (var o = "#", n = 1; n < 4; n += 1) o += t.slice(n, n + 1).concat(t.slice(n, n + 1));
            t = o
        }
        for (var r = [], n = 1; n < 7; n += 2) r.push(parseInt("0x" + t.slice(n, n + 2)));
        return "rgb(" + r.join(",") + ")"
    }
    return t
}

function LightenDarkenColor(e, t) {
    var o = !1;
    "#" == e[0] && (e = e.slice(1), o = !0);
    var n = parseInt(e, 16), r = (n >> 16) + t;
    255 < r ? r = 255 : r < 0 && (r = 0);
    var a = (n >> 8 & 255) + t;
    255 < a ? a = 255 : a < 0 && (a = 0);
    var i = (255 & n) + t;
    return 255 < i ? i = 255 : i < 0 && (i = 0), (o ? "#" : "") + String("000000" + (i | a << 8 | r << 16).toString(16)).slice(-6)
}

function getContrastYIQ(e) {
    var t = colorRgb(e).match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/), o = 299 * t[1] + 587 * t[2] + 114 * t[3];
    return .5 <= (o /= 255e3) ? "light" : "dark"
}

function navTitle() {
    var e = document.title.replace(" | 张洪Heo", "");
    document.getElementById("page-name-text").innerHTML = e
}

function showcopy() {
    var e;
    void 0 !== GLOBAL_CONFIG.Snackbar ? btf.snackbarShow(GLOBAL_CONFIG.copy.success) : ((e = ctx.previousElementSibling).innerText = GLOBAL_CONFIG.copy.success, e.style.opacity = 1, setTimeout(function () {
        e.style.opacity = 0
    }, 700))
}

checkOpen.toString = function () {
    this.opened = !0
}, window.onload = function () {
    for (var e = document.getElementsByClassName("copybtn"), t = 0; t < e.length; t++) document.getElementsByClassName("copybtn")[t].addEventListener("click", function () {
        showcopy()
    });
    heo.initThemeColor()
};
var getTimeState = function () {
    var e = (new Date).getHours(), t = "";
    return 0 <= e && e <= 5 ? t = "晚安" : 5 < e && e <= 10 ? t = "早上好" : 10 < e && e <= 14 ? t = "中午好" : 14 < e && e <= 18 ? t = "下午好" : 18 < e && e <= 24 && (t = "晚上好"), t
};

function fly_to_top() {
    document.getElementById("guli_top").classList.add("open_wing"), setTimeout(function () {
        document.getElementById("guli_top").classList.add("flying"), btf.scrollToDest(0, 300)
    }, 300), setTimeout(function () {
        document.getElementById("guli_top").classList.remove("flying"), document.getElementById("guli_top").classList.remove("open_wing"), document.getElementById("guli_top").style.cssText = "opacity: ''; transform: ''"
    }, 600)
}

var navFn = {
    switchDarkMode: function () {
        "light" == ("dark" === document.documentElement.getAttribute("data-theme") ? "dark" : "light") ? (activateDarkMode(), saveToLocal.set("theme", "dark", 2), void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night, !1, 2e3)) : (activateLightMode(), saveToLocal.set("theme", "light", 2), void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day, !1, 2e3)), "function" == typeof utterancesTheme && utterancesTheme(), "object" === ("undefined" == typeof FB ? "undefined" : _typeof(FB)) && window.loadFBComment(), window.DISQUS && document.getElementById("disqus_thread").children.length && setTimeout(function () {
            return window.disqusReset()
        }, 200);
        var e, t, o, n = "light" === document.documentElement.getAttribute("data-theme") ? "#363636" : "#F7F7FA";
        document.getElementById("posts-chart") && ((e = postsOption).textStyle.color = n, e.title.textStyle.color = n, e.xAxis.axisLine.lineStyle.color = n, e.yAxis.axisLine.lineStyle.color = n, postsChart.setOption(e)), document.getElementById("tags-chart") && ((t = tagsOption).textStyle.color = n, t.title.textStyle.color = n, t.xAxis.axisLine.lineStyle.color = n, t.yAxis.axisLine.lineStyle.color = n, tagsChart.setOption(t)), document.getElementById("categories-chart") && ((o = categoriesOption).textStyle.color = n, o.title.textStyle.color = n, o.legend.textStyle.color = n, categoriesChart.setOption(o))
    }
};

function RemoveRewardMask() {
    $(".reward-main").attr("style", "display: none"), $("#quit-box").attr("style", "display: none")
}

function AddRewardMask() {
    $(".reward-main").attr("style", "display: flex")
}

function travelling() {
    fetch("https://moments.zhheo.com/randomfriend").then(function (e) {
        return e.json()
    }).then(function (e) {
        var t = e.name, o = e.link,
            n = "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + t + "」";
        document.styleSheets[0].addRule(":root", "--heo-snackbar-time:8000ms!important"), Snackbar.show({
            text: n,
            duration: 1e4,
            pos: "top-center",
            actionText: "前往",
            onActionClick: function (e) {
                $(e).css("opacity", 0), window.open(o, "_blank")
            }
        })
    })
}

function toforeverblog() {
    Snackbar.show({
        text: "点击前往按钮进入「十年之约」项目中的成员博客，不保证跳转网站的安全性和可用性",
        duration: 8e3,
        pos: "top-center",
        actionText: "前往",
        onActionClick: function (e) {
            $(e).css("opacity", 0), window.open(link, "https://www.foreverblog.cn/go.html")
        }
    })
}

function totraveling() {
    btf.snackbarShow("即将跳转到「开往」项目的成员博客，不保证跳转网站的安全性和可用性", !1, 5e3), setTimeout(function () {
        window.open("https://travellings.link/")
    }, "5000")
}

function removeLoading() {
    setTimeout(function () {
        preloader.endLoading()
    }, 3e3)
}

function addFriendLink() {
    var e = document.getElementsByClassName("el-textarea__inner")[0], t = document.createEvent("HTMLEvents");
    t.initEvent("input", !0, !0), e.value = "昵称：\n网站地址：\n头像图片url：\n描述：\n", e.dispatchEvent(t);
    var o = document.querySelector("#post-comment").offsetTop;
    window.scrollTo(0, o - 80), e.focus(), e.setSelectionRange(-1, -1)
}

function getArrayItems(e, t) {
    var o = new Array;
    for (var n in e) o.push(e[n]);
    for (var r = new Array, a = 0; a < t && 0 < o.length; a++) {
        var i = Math.floor(Math.random() * o.length);
        r[a] = o[i], o.splice(i, 1)
    }
    return r
}

function owoBig() {
    document.getElementById("post-comment").addEventListener("DOMNodeInserted", function (e) {
        var t, o, n, a;
        !e.target.classList || "OwO-body" != e.target.classList.value || (t = e.target) && (n = !(o = ""), (a = document.createElement("div")).id = "owo-big", document.querySelector("body").appendChild(a), t.addEventListener("contextmenu", function (e) {
            return e.preventDefault()
        }), t.addEventListener("mouseover", function (r) {
            "LI" == r.target.tagName && n && (n = !1, o = setTimeout(function () {
                var e = 3 * r.path[0].clientHeight, t = 3 * r.path[0].clientWidth,
                    o = r.x - r.offsetX - (t - r.path[0].clientWidth) / 2, n = r.y - r.offsetY;
                a.style.height = e + "px", a.style.width = t + "px", a.style.left = o + "px", a.style.top = n + "px", a.style.display = "flex", a.innerHTML = '<img src="'.concat(r.target.querySelector("img").src, '">')
            }, 300))
        }), t.addEventListener("mouseout", function (e) {
            a.style.display = "none", n = !0, clearTimeout(o)
        }))
    })
}

function percent() {
    var e = document.documentElement.scrollTop || window.pageYOffset,
        t = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight,
        o = Math.round(e / t * 100), n = document.querySelector("#percent"),
        r = window.scrollY + document.documentElement.clientHeight,
        a = document.getElementById("post-tools") || document.getElementById("footer");
    a.offsetTop + a.offsetHeight / 2 < r || 90 < o ? (document.querySelector("#nav-totop").classList.add("long"), n.innerHTML = "返回顶部") : (document.querySelector("#nav-totop").classList.remove("long"), n.innerHTML = o)
}

document.addEventListener("touchstart", function (e) {
    RemoveRewardMask()
}, !1), $(document).unbind("keydown").bind("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && 67 == e.keyCode && "" != selectTextNow) return btf.snackbarShow("复制成功，复制和转载请标注本文地址"), rm.rightmenuCopyText(selectTextNow), !1
}), document.addEventListener("scroll", btf.throttle(function () {
    heo.initThemeColor()
}, 200)), navigator.serviceWorker.getRegistrations().then(function (e) {
    var t, o = _createForOfIteratorHelper(e);
    try {
        for (o.s(); !(t = o.n()).done;) {
            t.value.unregister()
        }
    } catch (e) {
        o.e(e)
    } finally {
        o.f()
    }
}), window.onkeydown = function (e) {
    123 === e.keyCode && btf.snackbarShow("开发者模式已打开，请遵循GPL协议", !1, 3e3)
}, document.querySelector("#algolia-search").addEventListener("wheel", function (e) {
    e.preventDefault()
}), document.querySelector("#console").addEventListener("wheel", function (e) {
    e.preventDefault()
}), window.addEventListener("resize", function () {
    document.querySelector("#waterfall") && heo.reflashEssayWaterFall()
}), $(".topGroup").hover(function () {
    console.log("卡片悬浮")
}, function () {
    hoverOnCommentBarrage = !1, document.getElementById("todayCard").classList.remove("hide"), document.getElementById("todayCard").style.zIndex = 1, console.log("卡片停止悬浮")
}), document.getElementById("post-comment") && owoBig(), document.addEventListener("scroll", btf.throttle(function () {
    var e, t = window.scrollY + document.documentElement.clientHeight,
        o = (window.scrollY, document.getElementById("pagination")), n = document.getElementById("post-tools");
    n && o && (e = n.offsetTop + n.offsetHeight / 2, 1300 < document.body.clientWidth && (e < t ? o.classList.add("show-window") : o.classList.remove("show-window")))
}, 200)), "false" !== localStorage.getItem("keyboardToggle") ? document.querySelector("#consoleKeyboard").classList.add("on") : document.querySelector("#consoleKeyboard").classList.remove("on"), $(window).on("keydown", function (e) {
    if (27 == e.keyCode && (heo.hideLoading(), heo.hideConsole(), rm.hideRightMenu()), heo_keyboard && e.shiftKey) {
        if (16 == e.keyCode && document.querySelector("#keyboard-tips").classList.add("show"), 75 == e.keyCode) return heo.keyboardToggle(), !1;
        if (65 == e.keyCode) return heo.showConsole(), !1;
        if (77 == e.keyCode) return heo.musicToggle(), !1;
        if (82 == e.keyCode) return toRandomPost(), !1;
        if (66 == e.keyCode) return pjax.loadUrl("/"), !1;
        if (68 == e.keyCode) return rm.switchDarkMode(), !1;
        if (70 == e.keyCode) return pjax.loadUrl("/moments/"), !1
    }
}), $(window).on("keyup", function (e) {
    16 == e.keyCode && document.querySelector("#keyboard-tips").classList.remove("show")
}), document.addEventListener("pjax:send", function () {
    heo.showLoading()
}), document.addEventListener("pjax:complete", function () {
    heo.categoriesBarActive(), heo.tagPageActive(), heo.onlyHome(), heo.addNavBackgroundInit(), heo.initIndexEssay(), heo.changeTimeInEssay(), heo.reflashEssayWaterFall(), heo.darkModeStatus(), heo.initThemeColor(), percent(), window.onscroll = percent, heo.hideLoading()
}), heo.initThemeColor(), percent(), window.onscroll = percent;