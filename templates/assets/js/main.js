"use strict";

function _typeof(t) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
    } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    })(t)
}

function _toConsumableArray(t) {
    return _arrayWithoutHoles(t) || _iterableToArray(t) || _unsupportedIterableToArray(t) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}

function _unsupportedIterableToArray(t, e) {
    if (t) {
        if ("string" == typeof t) return _arrayLikeToArray(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _arrayLikeToArray(t, e) : void 0
    }
}

function _iterableToArray(t) {
    if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t)
}

function _arrayWithoutHoles(t) {
    if (Array.isArray(t)) return _arrayLikeToArray(t)
}

function _arrayLikeToArray(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, o = new Array(e); n < e; n++) o[n] = t[n];
    return o
}

document.addEventListener("DOMContentLoaded", function () {
    function L(t) {
        0 < arguments.length && void 0 !== t && t && (i = o && o.offsetWidth, c = a && a.offsetWidth, s = r && r.offsetWidth);
        var e = document.getElementById("nav"), n = window.innerWidth < 768 || i + c + s > e.offsetWidth - 120;
        n ? e.classList.add("hide-menu") : e.classList.remove("hide-menu")
    }

    var o = document.getElementById("site-name"), i = o && o.offsetWidth,
        a = document.querySelector("#menus .menus_items"), c = a && a.offsetWidth,
        r = document.querySelector("#search-button"), s = r && r.offsetWidth;

    function l(t) {
        function e(t) {
            t.each(function (t, e) {
                var n = $(e), o = n.attr("data-lazy-src") || n.attr("src"), i = o + "_1600w", a = n.attr("alt") || "";
                -1 != o.indexOf("!blogimg") ? n.wrap('<a href="'.concat(o, '" data-fancybox="images" data-caption="').concat(a, '" class="fancybox" data-srcset="').concat(i, ' 1600w"></a>')) : n.wrap('<a href="'.concat(o, '" data-fancybox="images" data-caption="').concat(a, '" class="fancybox" data-srcset="').concat(o, ' 1600w"></a>'))
            }), $().fancybox({
                selector: "[data-fancybox]",
                loop: !0,
                transitionEffect: "slide",
                protect: !0,
                buttons: ["slideShow", "fullScreen", "thumbs", "close"],
                hash: !1
            })
        }

        void 0 === $.fancybox ? ($("head").append('<link rel="stylesheet" type="text/css" href="'.concat(GLOBAL_CONFIG.source.fancybox.css, '">')), $.getScript("".concat(GLOBAL_CONFIG.source.fancybox.js), function () {
            e($(t))
        })) : e($(t))
    }

    function w() {
        var n = "fancybox" === GLOBAL_CONFIG.lightbox ? document.querySelectorAll("#article-container :not(a):not(.gallery-group) > img, #article-container > img,.bber-content-img > img") : [],
            o = 0 < n.length, i = document.querySelectorAll("#article-container .justified-gallery"), a = 0 < i.length;
        (a || o) && btf.isJqueryLoad(function () {
            var t, e;
            a && (t = $(i), (e = t.find("img")).unwrap(), e.length && e.each(function (t, e) {
                $(e).attr("data-lazy-src") && $(e).attr("src", $(e).attr("data-lazy-src")), $(e).wrap("<div></div>")
            }), d ? btf.initJustifiedGallery(t) : ($("head").append('<link rel="stylesheet" type="text/css" href="'.concat(GLOBAL_CONFIG.source.justifiedGallery.css, '">')), $.getScript("".concat(GLOBAL_CONFIG.source.justifiedGallery.js), function () {
                btf.initJustifiedGallery(t)
            }), d = !0)), o && l(n)
        })
    }

    // function A() {
    //     var a, c, r, s, l, d, u = document.getElementById("rightside"), f = window.innerHeight + 56;
    //     document.body.scrollHeight <= f ? u.style.cssText = "opacity: 1; transform: translateX(-38px)" : (c = !(a = 0), r = document.getElementById("page-header"), document.getElementById("guli_top"), s = document.getElementById("cookies-window"), l = "function" == typeof chatBtnHide, d = "function" == typeof chatBtnShow, window.addEventListener("scroll", btf.throttle(function (t) {
    //         var e, n, o = window.scrollY || document.documentElement.scrollTop, i = (n = a < (e = o), a = e, n);
    //         56 < o ? (i ? (r.classList.contains("nav-visible") && r.classList.remove("nav-visible"), d && !0 === c && (chatBtnHide(), c = !1)) : (r.classList.contains("nav-visible") || r.classList.add("nav-visible"), l && !1 === c && (chatBtnShow(), c = !0)), r.classList.add("nav-fixed"), s.classList.add("cw-hide"), "0" === window.getComputedStyle(u).getPropertyValue("opacity") && (u.style.cssText = "opacity: 1; transform: translateX(-38px)")) : (0 === o && r.classList.remove("nav-fixed", "nav-visible"), u.style.cssText = "opacity: ''; transform: ''"), document.body.scrollHeight <= f && (u.style.cssText = "opacity: 1; transform: translateX(-38px)")
    //     }, 200)))
    // }

    function S() {
        var t = document.getElementById("card-toc"), r = t.getElementsByClassName("toc-content")[0],
            s = r.querySelectorAll(".toc-link"), c = document.getElementById("article-container");
        window.tocScrollFn = function () {
            return btf.throttle(function () {
                var t = window.scrollY || document.documentElement.scrollTop;
                e(t), i(t)
            }, 100)()
        }, window.addEventListener("scroll", tocScrollFn);
        var e = function (t) {
            var e = c.clientHeight, n = document.documentElement.clientHeight,
                o = (t - c.offsetTop) / (n < e ? e - n : document.documentElement.scrollHeight - n),
                i = Math.round(100 * o), a = 100 < i ? 100 : i <= 0 ? 0 : i;
            r.setAttribute("progress-percentage", a)
        }, l = GLOBAL_CONFIG.isanchor, n = function () {
            t.style.cssText = "animation: toc-open .3s; opacity: 1; right: 45px"
        }, o = function () {
            t.style.animation = "toc-close .2s", setTimeout(function () {
                t.style.cssText = "opacity:''; animation: ''; right: ''"
            }, 100)
        };
        document.getElementById("mobile-toc-button").addEventListener("click", function () {
            ("0" === window.getComputedStyle(t).getPropertyValue("opacity") ? n : o)()
        }), r.addEventListener("click", function (t) {
            t.preventDefault();
            var e = t.target.classList.contains("toc-link") ? t.target : t.target.parentElement;
            btf.scrollToDest(btf.getEleTop(document.getElementById(decodeURI(e.getAttribute("href")).replace("#", ""))), 300), window.innerWidth < 900 && o()
        });
        var d = c.querySelectorAll("h1,h2,h3,h4,h5,h6"), u = "", i = function (n) {
            if (0 === s.length || 0 === n) return !1;
            var t, e, o = "", i = "";
            if (d.forEach(function (t, e) {
                n > btf.getEleTop(t) - 80 && (o = "#" + encodeURI(t.getAttribute("id")), i = e)
            }), u !== i) {
                if (l && (t = o, window.history.replaceState && t !== window.location.hash && (t = t || location.pathname, e = GLOBAL_CONFIG_SITE.title, window.history.replaceState({
                    url: location.href,
                    title: e
                }, e, t))), "" === o) return r.querySelectorAll(".active").forEach(function (t) {
                    t.classList.remove("active")
                }), void (u = i);
                u = i, r.querySelectorAll(".active").forEach(function (t) {
                    t.classList.remove("active")
                });
                var a = s[i];
                a.classList.add("active"), setTimeout(function () {
                    var t, e;
                    t = a.getBoundingClientRect().top, e = r.scrollTop, t > document.documentElement.clientHeight - 100 && (r.scrollTop = e + 150), t < 100 && (r.scrollTop = e - 150)
                }, 0);
                for (var c = a.parentNode; !c.matches(".toc"); c = c.parentNode) c.matches("li") && c.classList.add("active")
            }
        }
    }

    var d = !1, e = function () {
        var e = document.body;
        e.classList.add("read-mode");
        var n = document.createElement("button");
        n.type = "button", n.className = "fas fa-sign-out-alt exit-readmode", e.appendChild(n), n.addEventListener("click", function t() {
            e.classList.remove("read-mode"), n.remove(), n.removeEventListener("click", t)
        })
    }, n = function () {
        "light" == ("dark" === document.documentElement.getAttribute("data-theme") ? "dark" : "light") ? (activateDarkMode(), saveToLocal.set("theme", "dark", 2), void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night, !1, 2e3)) : (activateLightMode(), saveToLocal.set("theme", "light", 2), void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day, !1, 2e3)), "function" == typeof utterancesTheme && utterancesTheme(), "object" === ("undefined" == typeof FB ? "undefined" : _typeof(FB)) && window.loadFBComment(), window.DISQUS && document.getElementById("disqus_thread").children.length && setTimeout(function () {
            return window.disqusReset()
        }, 200)
    }, u = function () {
        document.getElementById("rightside-config-hide").classList.toggle("show")
    }, f = function () {
        btf.scrollToDest(0, 500)
    }, m = function () {
        var t = document.documentElement.classList;
        t.contains("hide-aside") ? saveToLocal.set("aside-status", "show", 2) : saveToLocal.set("aside-status", "hide", 2), t.toggle("hide-aside")
    }, h = function (t) {
        var e = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--global-font-size")),
            n = "";
        if (t) {
            if (20 <= e) return;
            n = e + 1, document.documentElement.style.setProperty("--global-font-size", n + "px"), document.getElementById("nav").classList.contains("hide-menu") || L(!0)
        } else {
            if (e <= 10) return;
            n = e - 1, document.documentElement.style.setProperty("--global-font-size", n + "px"), document.getElementById("nav").classList.contains("hide-menu") && L(!0)
        }
        saveToLocal.set("global-font-size", n, 2)
    };
    document.getElementById("rightside").addEventListener("click", function (t) {
        switch (t.target.id || t.target.parentNode.id) {
            case"go-up":
                f();
                break;
            case"rightside_config":
                u();
                break;
            case"readmode":
                e();
                break;
            case"darkmode":
                n();
                break;
            case"hide-aside-btn":
                m();
                break;
            case"font-plus":
                h(!0);
                break;
            case"font-minus":
                h()
        }
    });

    function I(t) {
        t.forEach(function (t) {
            var e = t, n = e.getAttribute("datetime");
            e.innerText = btf.diffDate(n, !0), e.style.display = "inline"
        })
    }

    var g, O = function () {
        document.querySelectorAll("#article-container .tab > button").forEach(function (t) {
            t.addEventListener("click", function (t) {
                var e, n, o, i, a = this.parentNode;
                a.classList.contains("active") || (e = a.parentNode.nextElementSibling, (n = btf.siblings(a, ".active")[0]) && n.classList.remove("active"), a.classList.add("active"), o = this.getAttribute("data-href").replace("#", ""), _toConsumableArray(e.children).forEach(function (t) {
                    t.id === o ? t.classList.add("active") : t.classList.remove("active")
                }), 0 < (i = e.querySelectorAll("#".concat(o, " .justified-gallery"))).length && btf.initJustifiedGallery(i))
            })
        })
    }, G = function () {
        document.querySelectorAll("#article-container .tabs .tab-to-top").forEach(function (t) {
            t.addEventListener("click", function () {
                btf.scrollToDest(btf.getEleTop(btf.getParents(this, ".tabs")), 300)
            })
        })
    };
    window.refreshFn = function () {
        var t, e, n, o, i, a, c, r, s, l, d, u, f, m, h, g, y, p, b;

        function v() {
            f.style.overflow = "", f.style.paddingRight = "", btf.fadeOut(u, .5), d.classList.remove("open")
        }

        L(), document.getElementById("nav").classList.add("show"), GLOBAL_CONFIG_SITE.isPost ? (GLOBAL_CONFIG_SITE.isToc && S(), void 0 !== GLOBAL_CONFIG.noticeOutdate && (r = GLOBAL_CONFIG.noticeOutdate, (s = btf.diffDate(GLOBAL_CONFIG_SITE.postUpdate)) >= r.limitDay && ((a = document.createElement("div")).className = "post-outdate-notice", a.textContent = r.messagePrev + " " + s + " " + r.messageNext, c = document.getElementById("article-container"), "top" === r.position ? c.insertBefore(a, c.firstChild) : c.appendChild(a))), GLOBAL_CONFIG.relativeDate.post && I(document.querySelectorAll("#post-meta time"))) : (GLOBAL_CONFIG.relativeDate.homepage && I(document.querySelectorAll("#recent-posts time")), !GLOBAL_CONFIG.runtime || (i = document.getElementById("runtimeshow")) && (o = i.getAttribute("data-publishDate"), i.innerText = btf.diffDate(o) + " " + GLOBAL_CONFIG.runtime), (n = document.getElementById("last-push-date")) && (e = n.getAttribute("data-lastPushDate"), n.innerText = btf.diffDate(e, !0)), (t = document.querySelectorAll("#aside-cat-list .card-category-list-item.parent i")).length && t.forEach(function (t) {
            t.addEventListener("click", function (t) {
                t.preventDefault();
                this.classList.toggle("expand");
                var e = this.parentNode.nextElementSibling;
                btf.isHidden(e) ? e.style.display = "block" : e.style.display = "none"
            })
        })), l = document.getElementById("toggle-menu"), d = document.getElementById("sidebar-menus"), u = document.getElementById("menu-mask"), f = document.body, l.addEventListener("click", function () {
            btf.sidebarPaddingR(), f.style.overflow = "hidden", btf.fadeIn(u, .5), d.classList.add("open")
        }), window.addEventListener("resize", function (t) {
            btf.isHidden(l) && d.classList.contains("open") && v()
        }), GLOBAL_CONFIG.isPhotoFigcaption && document.querySelectorAll("#article-container img").forEach(function (t) {
            var e, n = t.parentNode;
            n.parentNode.classList.contains("justified-gallery") || ((e = document.createElement("div")).className = "img-alt is-center", e.textContent = t.getAttribute("alt"), n.insertBefore(e, t.nextSibling))
        }), w(), "mediumZoom" === GLOBAL_CONFIG.lightbox && (h = mediumZoom(document.querySelectorAll("#article-container :not(a)>img"))).on("open", function (t) {
            var e = "dark" === document.documentElement.getAttribute("data-theme") ? "#121212" : "#fff";
            h.update({background: e})
        }), A(), (g = document.querySelectorAll("#article-container :not(.highlight) > table, #article-container > table")).length && g.forEach(function (t) {
            btf.wrap(t, "div", "", "table-wrap")
        }), (y = document.querySelectorAll("#article-container .hide-button")).length && y.forEach(function (t) {
            t.addEventListener("click", function (t) {
                var e = this.nextElementSibling;
                this.classList.toggle("open"), this.classList.contains("open") && 0 < e.querySelectorAll(".justified-gallery").length && btf.initJustifiedGallery(e.querySelectorAll(".justified-gallery"))
            })
        }), O(), G(), p = !1, (b = document.querySelector("#comment-switch > .switch-btn")) && b.addEventListener("click", function () {
            this.classList.toggle("move"), document.querySelectorAll("#post-comment > .comment-wrap > div").forEach(function (t) {
                btf.isHidden(t) ? t.style.cssText = "display: block;animation: tabshow .5s" : t.style.cssText = "display: none;animation: ''"
            }), p || "function" != typeof loadOtherComment || (p = !0, loadOtherComment())
        })
    }, refreshFn(), window.addEventListener("resize", L), window.addEventListener("orientationchange", function () {
        setTimeout(L(!0), 100)
    }), document.querySelectorAll("#sidebar-menus .expand").forEach(function (t) {
        t.addEventListener("click", function () {
            this.classList.toggle("hide");
            var t = this.parentNode.nextElementSibling;
            btf.isHidden(t) ? t.style.display = "block" : t.style.display = "none"
        })
    }), window.addEventListener("touchmove", function (t) {
        document.querySelectorAll("#nav .menus_item_child").forEach(function (t) {
            btf.isHidden(t) || (t.style.display = "none")
        })
    }), GLOBAL_CONFIG.islazyload && (window.lazyLoadInstance = new LazyLoad({
        elements_selector: "img",
        threshold: 0,
        data_src: "lazy-src"
    })), void 0 !== GLOBAL_CONFIG.copyright && (g = GLOBAL_CONFIG.copyright, document.body.oncopy = function (t) {
        t.preventDefault();
        var e = window.getSelection(0).toString(),
            n = e.length > g.limitCount ? e + "\n\n\n" + g.languages.author + "\n" + g.languages.link + window.location.href + "\n" + g.languages.source + "\n" + g.languages.info : e;
        return t.clipboardData ? t.clipboardData.setData("text", n) : window.clipboardData.setData("text", n)
    })
});