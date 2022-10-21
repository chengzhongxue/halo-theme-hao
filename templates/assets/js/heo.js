"use strict";
var heo_keyboard = !0, heo = {
    darkModeStatus: function () {
        "light" == ("dark" === document.documentElement.getAttribute("data-theme") ? "dark" : "light") ? $(".menu-darkmode-text").text("深色模式") : $(".menu-darkmode-text").text("浅色模式")
    },

    onlyHome: function () {
        var e = window.location.pathname;
        "/" == (e = decodeURIComponent(e)) ? $(".only-home").attr("style", "display: flex") : $(".only-home").attr("style", "display: none")
    },

    is_Post: function () {
        return 0 <= window.location.href.indexOf("/p/")
    },

    addNavBackgroundInit: function () {
        var e, t = 0, o = 0;
        document.body && (t = document.body.scrollTop), document.documentElement && (o = document.documentElement.scrollTop), e = 0 < t - o ? t : o, console.log("滚动高度" + e), 0 != e && (document.getElementById("page-header").classList.add("nav-fixed"), document.getElementById("page-header").classList.add("nav-visible"), $("#cookies-window").hide(), console.log("已添加class"))
    },

    tagPageActive: function () {
        var e = window.location.pathname, e = decodeURIComponent(e);
        console.log(e);
        var t, o, n = /\/tags\/.*?\//.test(e);
        console.log(n), n && (t = e.split("/"), console.log(t[2]), o = t[2], document.querySelector("#tag-page-tags") && document.getElementById(o).classList.add("select"))
    },

    categoriesBarActive: function () {
        document.querySelector("#category-bar") && $(".category-bar-item").removeClass("select");
        var e, t = window.location.pathname, t = decodeURIComponent(t);
        console.log(t), "/" == t ? document.querySelector("#category-bar") && document.getElementById("category-bar-home").classList.add("select") : /\/categories\/.*?\//.test(t) && (e = t.split("/")[2], document.querySelector("#category-bar") && document.getElementById(e).classList.add("select"))
    },

    stopImgRightDrag: function () {
        $("img").on("dragstart", function () {
            return !1
        })
    },

    topPostScroll: function () {
        var o;
        document.getElementById("recent-post-top") && (o = document.getElementById("recent-post-top")).addEventListener("mousewheel", function (e) {
            var t = -e.wheelDelta / 2;
            o.scrollLeft += t, document.body.clientWidth < 1300 && e.preventDefault()
        }, !1)
    },

    topCategoriesBarScroll: function () {
        var o;
        document.getElementById("category-bar-items") && (o = document.getElementById("category-bar-items")).addEventListener("mousewheel", function (e) {
            var t = -e.wheelDelta / 2;
            o.scrollLeft += t, e.preventDefault()
        }, !1)
    },

    sayhi: function () {
        document.querySelector("#author-info__sayhi") && (document.getElementById("author-info__sayhi").innerHTML = getTimeState() + "！我是")
    },

    addTag: function () {
        document.querySelector(".heo-tag-new") && $(".heo-tag-new").append('<sup class="heo-tag heo-tag-new-view">N</sup>'), document.querySelector(".heo-tag-hot") && $(".heo-tag-hot").append('<sup class="heo-tag heo-tag-hot-view">H</sup>')
    },

    qrcodeCreate: function () {
        document.getElementById("qrcode") && new QRCode(document.getElementById("qrcode"), {
            text: window.location.href,
            width: 250,
            height: 250,
            colorDark: "#000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        })
    },

    reflashEssayWaterFall: function () {
        document.querySelector("#waterfall") && setTimeout(function () {
            waterfall("#waterfall"), document.getElementById("waterfall").classList.add("show")
        }, 500)
    },

    addMediumInEssay: function () {
        document.querySelector("#waterfall") && mediumZoom(document.querySelectorAll("[data-zoomable]"))
    },

    downloadImage: function (e, c) {
        rm.hideRightMenu(), 0 == rm.downloadimging ? (rm.downloadimging = !0, btf.snackbarShow("正在下载中，请稍后", !1, 1e4), setTimeout(function () {
            var a = new Image;
            a.setAttribute("crossOrigin", "anonymous"), a.onload = function () {
                var e = document.createElement("canvas");
                e.width = a.width, e.height = a.height, e.getContext("2d").drawImage(a, 0, 0, a.width, a.height);
                var t = e.toDataURL("image/png"), o = document.createElement("a"), n = new MouseEvent("click");
                o.download = c || "photo", o.href = t, o.dispatchEvent(n)
            }, a.src = e, btf.snackbarShow("图片已添加盲水印，请遵守版权协议"), rm.downloadimging = !1
        }, "10000")) : btf.snackbarShow("有正在进行中的下载，请稍后再试")
    },

    changeThemeColor: function (e) {
        null !== document.querySelector('meta[name="theme-color"]') && document.querySelector('meta[name="theme-color"]').setAttribute("content", e)
    },

    initThemeColor: function () {
        var e, t, o;
        heo.is_Post() ? 0 === (window.scrollY || document.documentElement.scrollTop) ? (e = getComputedStyle(document.documentElement).getPropertyValue("--heo-main"), heo.changeThemeColor(e)) : (t = getComputedStyle(document.documentElement).getPropertyValue("--heo-background"), heo.changeThemeColor(t)) : (o = getComputedStyle(document.documentElement).getPropertyValue("--heo-background"), heo.changeThemeColor(o))
    },


    // showLoading: function () {
    //     document.querySelector("#loading-box").classList.remove("loaded")
    // },

    // hideLoading: function () {
    //     document.querySelector("#loading-box").classList.add("loaded")
    // },

    // showConsole: function () {
    //     document.querySelector("#console").classList.add("show")
    // },

    // hideConsole: function () {
    //     document.querySelector("#console").classList.remove("show")
    // },

    // keyboardToggle: function () {
    //     heo_keyboard ? (heo_keyboard = !1, document.querySelector("#consoleKeyboard").classList.remove("on"), localStorage.setItem("keyboardToggle", "false")) : (heo_keyboard = !0, document.querySelector("#consoleKeyboard").classList.add("on"), localStorage.setItem("keyboardToggle", "true"))
    // }
};