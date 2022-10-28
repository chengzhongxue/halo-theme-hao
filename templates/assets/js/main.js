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

        const innerHeight = window.innerHeight + 56;
        if (document.body.scrollHeight <= innerHeight) {
            return
        }

        // 滚动方向
        function scrollDirection(currentTop) {
            const result = currentTop > initTop // true is down & false is up
            initTop = currentTop
            return result
        }

        let initTop = 0;
        let $header = document.getElementById("page-header");
        let $cookies = document.getElementById("cookies-window");

        window.scrollCollect = btf.throttle(function () {

            let currentTop = window.scrollY || document.documentElement.scrollTop;
            let isDown = scrollDirection(currentTop);

            if (56 < currentTop) {
                // 向下滚动
                if (isDown) {
                    // 隐藏 nav
                    if ($header.classList.contains("nav-visible")) {
                        $header.classList.remove("nav-visible");
                    }
                } else {
                    if (!$header.classList.contains("nav-visible")) {
                        $header.classList.add("nav-visible")
                    }
                }
                $header.classList.add("nav-fixed")
                $cookies.classList.add("cw-hide")
            } else {
                if (0 === currentTop) {
                    $header.classList.remove("nav-fixed", "nav-visible")
                }
            }
        }, 200)

        window.addEventListener('scroll', scrollCollect)
    }

    // 滚动处理
    const scrollFnToDo = function () {
        let $cardTocLayout = document.getElementById("card-toc");
        let $cardToc = $cardTocLayout.getElementsByClassName("toc-content")[0];
        let $tocLink = $cardToc.querySelectorAll(".toc-link");
        let $article = document.getElementById("article-container");


        const scrollPercent = function (currentTop) {
            const docHeight = $article.clientHeight;
            const winHeight = document.documentElement.clientHeight;
            const headerHeight = $article.offsetTop;
            const contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : (document.documentElement.scrollHeight - winHeight)
            const scrollPercent = (currentTop - headerHeight) / (contentMath);
            const scrollPercentRounded = Math.round(100 * scrollPercent);
            const percentage = 100 < scrollPercentRounded ? 100 : scrollPercentRounded <= 0 ? 0 : scrollPercentRounded;
            $cardToc.setAttribute("progress-percentage", percentage);
        }

        document.getElementById("mobile-toc-button")
            .addEventListener("click", function () {
                if ("0" === window.getComputedStyle($cardTocLayout).getPropertyValue("opacity")) {
                    window.mobileToc.open();
                } else {
                    window.mobileToc.close();
                }
            });

        window.mobileToc = {
            open: () => {
                $cardTocLayout.style.cssText = "animation: toc-open .3s; opacity: 1; right: 45px";
            },

            close: () => {
                $cardTocLayout.style.animation = "toc-close .2s"
                setTimeout(function () {
                    $cardTocLayout.style.cssText = "opacity:''; animation: ''; right: ''";
                }, 100);
            }
        }

        // toc 元素点击
        $cardToc.addEventListener("click", e => {
            e.preventDefault();
            const target = e.target.classList.contains("toc-link") ? e.target : e.target.parentElement;

            btf.scrollToDest(
                btf.getEleTop(
                    document.getElementById(
                        decodeURI(target.getAttribute("href")).replace("#", "")
                    )
                ),
                300
            );
            if (window.innerWidth < 900) {
                window.mobileToc.close();
            }
        });

        // find head position & add active class
        const list = $article.querySelectorAll("h1,h2,h3,h4,h5,h6");
        let detectItem = "";
        const findHeadPosition = function (top) {

            if (0 === $tocLink.length || 0 === top) {
                return false
            }

            let currentId = "";
            let currentIndex = "";

            list.forEach(function (ele, index) {
                if (top > btf.getEleTop(ele) - 80) {
                    currentId = "#" + encodeURI(ele.getAttribute("id"));
                    currentIndex = index
                }

            })
            if (detectItem === currentIndex) {
                return
            }

            detectItem = currentIndex

            $cardToc.querySelectorAll(".active").forEach(i => {
                i.classList.remove("active")
            })

            if (currentId === "") {
                return
            }

            const currentActive = $tocLink[currentIndex]
            currentActive.classList.add("active")

            setTimeout(() => {
                autoScrollToc(currentActive)
            }, 0)

            if (isExpand) return
            let parent = currentActive.parentNode

            for (; !parent.matches(".toc"); parent = parent.parentNode) {
                if (parent.matches("li")) parent.classList.add("active")
            }
        }

        window.tocScrollFn = function () {
            return btf.throttle(function () {
                let currentTop = window.scrollY || document.documentElement.scrollTop;
                scrollPercent(currentTop)
                findHeadPosition(currentTop);
            }, 100)();
        };
        window.addEventListener("scroll", tocScrollFn);
    };

    const tabsFn = {
        clickFnOfTabs() {
            document
                .querySelectorAll("#article-container .tab > button")
                .forEach(function (item) {
                    item.addEventListener("click", function (t) {
                        const $tabItem = this.parentNode;
                        if (!$tabItem.classList.contains("active")) {
                            const $tabContent = $tabItem.parentNode.nextElementSibling
                            const $siblings = btf.siblings($tabItem, ".active")[0]
                            $siblings && $siblings.classList.remove("active")
                            $tabItem.classList.add("active")
                            const tabId = this.getAttribute("data-href").replace("#", "")
                            const childList = [...$tabContent.children]
                            childList.forEach(function (item) {
                                item.id === tabId ? item.classList.add("active") : item.classList.remove("active");
                            })
                        }
                    })
                });
        },
        backToTop() {
            document.querySelectorAll("#article-container .tabs .tab-to-top")
                .forEach(function (t) {
                    t.addEventListener("click", function () {
                        btf.scrollToDest(btf.getEleTop(btf.getParents(this, ".tabs")), 300);
                    });
                });
        }
    }


    window.refreshFn = function () {

        initAdjust();

        scrollFnToDo();
        scrollFn();
        tabsFn.clickFnOfTabs();
        tabsFn.backToTop();
    }

    refreshFn()
    window.addEventListener("touchmove", function (t) {
        document.querySelectorAll("#nav .menus_item_child").forEach(function (t) {
            btf.isHidden(t) || (t.style.display = "none");
        });
    })
});
