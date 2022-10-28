"use strict";

document.addEventListener("DOMContentLoaded", function () {


    let $siteName = document.getElementById("site-name");
    let blogNameWidth = $siteName && $siteName.offsetWidth;
    let $menusEle = document.querySelector("#menus .menus_items");
    let menusWidth = $menusEle && $menusEle.offsetWidth;
    let $search = document.querySelector("#search-button");
    let searchWidth = $search && $search.offsetWidth;
    let $nav = document.getElementById("nav");

    // 菜单栏调整
    function adjustMenu(init) {

        0 < arguments.length && void 0 !== init && init && (blogNameWidth = $siteName && $siteName.offsetWidth, menusWidth = $menusEle && $menusEle.offsetWidth, searchWidth = $search && $search.offsetWidth);

        if (window.innerWidth < 768 || blogNameWidth + menusWidth + searchWidth > $nav.offsetWidth - 120) {
            $nav.classList.add("hide-menu")
        } else {
            $nav.classList.remove("hide-menu")
        }
    }

    // 初始化header
    const initAdjust = () => {
        adjustMenu(true);
        $nav.classList.add("show");
    };

    // 滚动处理
    function scrollFn() {
        let a;
        let c;
        let r;
        let s;
        let l;
        let d;
        const $rightside = document.getElementById("rightside");
        const innerHeight = window.innerHeight + 56;
        document.body.scrollHeight <= innerHeight
            ? ($rightside.style.cssText = "opacity: 1; transform: translateX(-38px)")
            : ((c = !(a = 0)),
                (r = document.getElementById("page-header")),
                document.getElementById("guli_top"),
                (s = document.getElementById("cookies-window")),
                (l = "function" == typeof chatBtnHide),
                (d = "function" == typeof chatBtnShow),
                window.addEventListener(
                    "scroll",
                    btf.throttle(function (t) {
                        var e,
                            n,
                            o = window.scrollY || document.documentElement.scrollTop,
                            i = ((n = a < (e = o)), (a = e), n);
                        56 < o
                            ? (i
                                ? (r.classList.contains("nav-visible") &&
                                r.classList.remove("nav-visible"),
                                d && !0 === c && (chatBtnHide(), (c = !1)))
                                : (r.classList.contains("nav-visible") ||
                                r.classList.add("nav-visible"),
                                l && !1 === c && (chatBtnShow(), (c = !0))),
                                r.classList.add("nav-fixed"),
                                s.classList.add("cw-hide"),
                            "0" ===
                            window.getComputedStyle($rightside).getPropertyValue("opacity") &&
                            ($rightside.style.cssText =
                                "opacity: 1; transform: translateX(-38px)"))
                            : (0 === o && r.classList.remove("nav-fixed", "nav-visible"),
                                ($rightside.style.cssText = "opacity: ''; transform: ''")),
                        document.body.scrollHeight <= innerHeight &&
                        ($rightside.style.cssText = "opacity: 1; transform: translateX(-38px)");
                    }, 200)
                ));
    }

    function scrollFnToDo() {
        const $cardTocLayout = document.getElementById("card-toc");
        const $cardToc = $cardTocLayout.getElementsByClassName("toc-content")[0];
        const $tocLink = $cardToc.querySelectorAll(".toc-link");
        const $article = document.getElementById("article-container");
        window.tocScrollFn = function () {
            return btf.throttle(function () {
                const currentTop = window.scrollY || document.documentElement.scrollTop;
                scrollPercent(currentTop)
                findHeadPosition(currentTop);
            }, 100)();
        }
        window.addEventListener("scroll", tocScrollFn);

        function scrollPercent(currentTop) {
            const docHeight = $article.clientHeight;
            const winHeight = document.documentElement.clientHeight;
            const headerHeight = $article.offsetTop;
            const scrollPercent = (currentTop - headerHeight) / (winHeight < docHeight ? docHeight - winHeight : document.documentElement.scrollHeight - winHeight);
            const scrollPercentRounded = Math.round(100 * scrollPercent);
            const percentage = 100 < scrollPercentRounded ? 100 : scrollPercentRounded <= 0 ? 0 : scrollPercentRounded;
            $cardToc.setAttribute("progress-percentage", percentage);
        }

        function close() {
            $cardTocLayout.style.animation = "toc-close .2s";
            setTimeout(function () {
                $cardTocLayout.style.cssText = "opacity:''; animation: ''; right: ''";
            }, 100);
        }

        function open() {
            $cardTocLayout.style.cssText = "animation: toc-open .3s; opacity: 1; right: 45px";
        }

        //
        document.getElementById("mobile-toc-button")
            .addEventListener("click", function () {
                ("0" === window.getComputedStyle($cardTocLayout).getPropertyValue("opacity") ? open() : close())();
            });
        // toc 元素点击
        $cardToc.addEventListener("click", e => {
            e.preventDefault();
            const $target = e.target.classList.contains("toc-link") ? e.target : e.target.parentElement;
            btf.scrollToDest(btf.getEleTop(document.getElementById(decodeURI($target.getAttribute("href")).replace("#", ""))), 300);
            window.innerWidth < 900 && close();
        });

        // find head position & add active class
        const list = $article.querySelectorAll("h1,h2,h3,h4,h5,h6");
        let detectItem = "";
        const findHeadPosition = function (top) {
            if (0 === $tocLink.length || 0 === top) {
                return false;
            }

            let currentId = "";
            let currentIndex = "";

            list.forEach(function (ele, index) {
                if (top > btf.getEleTop(ele) - 80) {
                    currentId = "#" + encodeURI(ele.getAttribute("id"));
                    currentIndex = index;
                }

            });
            if (detectItem === currentIndex) {
                return;
            }

            $cardToc.querySelectorAll(".active").forEach(function (i) {
                i.classList.remove("active");
            });

            if ("" === currentId) {
                return
            }

            detectItem = currentIndex;

            const currentActive = $tocLink[currentIndex];
            currentActive.classList.add("active");

            setTimeout(function () {
                autoScrollToc(currentActive);
            }, 0);

            for (; !parent.matches(".toc"); parent = parent.parentNode) {
                if (parent.matches("li")) parent.classList.add("active")
            }
        };


        function autoScrollToc(item) {
            const activePosition = item.getBoundingClientRect().top
            const sidebarScrollTop = $cardToc.scrollTop
            if (activePosition > (document.documentElement.clientHeight - 100)) {
                $cardToc.scrollTop = sidebarScrollTop + 150
            }
            if (activePosition < 100) {
                $cardToc.scrollTop = sidebarScrollTop - 150
            }
        }

    }



    window.refreshFn = function () {
        initAdjust();
        scrollFnToDo();
        scrollFn();
    };
    refreshFn();


    window.addEventListener("resize", adjustMenu);
    window.addEventListener("orientationchange", function () {
        setTimeout(adjustMenu, 100)
    });

    document.querySelectorAll("#sidebar-menus .expand").forEach(function (t) {
        t.addEventListener("click", function () {
            this.classList.toggle("hide");
            var t = this.parentNode.nextElementSibling;
            btf.isHidden(t) ? t.style.display = "block" : t.style.display = "none"
        })
    });
    window.addEventListener("touchmove", function (t) {
        document.querySelectorAll("#nav .menus_item_child").forEach(function (t) {
            btf.isHidden(t) || (t.style.display = "none")
        })
    });
});