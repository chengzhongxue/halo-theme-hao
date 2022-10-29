"use strict";

const btf = {
    debounce: function (func, wait, immediate) {
        let timeout
        return function () {
            const context = this
            const args = arguments
            const later = function () {
                timeout = null
                if (!immediate) func.apply(context, args)
            }
            const callNow = immediate && !timeout
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            if (callNow) func.apply(context, args)
        }
    },

    throttle: function (func, wait, options) {
        let timeout, context, args
        let previous = 0
        if (!options) options = {}

        const later = function () {
            previous = options.leading === false ? 0 : new Date().getTime()
            timeout = null
            func.apply(context, args)
            if (!timeout) context = args = null
        }

        const throttled = function () {
            const now = new Date().getTime()
            if (!previous && options.leading === false) previous = now
            const remaining = wait - (now - previous)
            context = this
            args = arguments
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout)
                    timeout = null
                }
                previous = now
                func.apply(context, args)
                if (!timeout) context = args = null
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining)
            }
        }

        return throttled
    },

    sidebarPaddingR: () => {
        const innerWidth = window.innerWidth
        const clientWidth = document.body.clientWidth
        const paddingRight = innerWidth - clientWidth
        if (innerWidth !== clientWidth) {
            document.body.style.paddingRight = paddingRight + 'px'
        }
    },

    snackbarShow: (text, showAction = false, duration = 2000) => {
        const { position, bgLight, bgDark } = GLOBAL_CONFIG.Snackbar
        const bg = document.documentElement.getAttribute('data-theme') === 'light' ? bgLight : bgDark
        Snackbar.show({
            text: text,
            backgroundColor: bg,
            showAction: showAction,
            duration: duration,
            pos: position,
            customClass: 'snackbar-css'
        })
    },

    // 图库排版
    // initJustifiedGallery: function (selector) {
    //     selector.forEach(function (i) {
    //         if (!btf.isHidden(i)) {
    //             fjGallery(i, {
    //                 itemSelector: '.fj-gallery-item',
    //                 rowHeight: 220,
    //                 gutter: 4,
    //                 onJustify: function () {
    //                     this.$container.style.opacity = '1'
    //                 }
    //             })
    //         }
    //     })
    // },

    scrollToDest: (pos, time = 500) => {
        const currentPos = window.pageYOffset
        if (currentPos > pos) pos = pos - 70

        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: pos,
                behavior: 'smooth'
            })
            return
        }

        let start = null
        pos = +pos
        window.requestAnimationFrame(function step (currentTime) {
            start = !start ? currentTime : start
            const progress = currentTime - start
            if (currentPos < pos) {
                window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos)
            } else {
                window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time))
            }
            if (progress < time) {
                window.requestAnimationFrame(step)
            } else {
                window.scrollTo(0, pos)
            }
        })
    },

    fadeIn: function (e, t) {
        e.style.cssText = "display:block;animation: to_show ".concat(t, "s")
    },

    fadeOut: function (t, e) {
        t.addEventListener("animationend", function e() {
            t.style.cssText = "display: none; animation: '' ", t.removeEventListener("animationend", e)
        }), t.style.animation = "to_hide ".concat(e, "s")
    },

    getParents: (elem, selector) => {
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (elem.matches(selector)) return elem
        }
        return null
    },

    siblings: (ele, selector) => {
        return [...ele.parentNode.children].filter((child) => {
            if (selector) {
                return child !== ele && child.matches(selector)
            }
            return child !== ele
        })
    },

    /**
     * @param {*} selector
     * @param {*} eleType the type of create element
     * @param {*} options object key: value
     */
    wrap: (selector, eleType, options) => {
        const creatEle = document.createElement(eleType)
        for (const [key, value] of Object.entries(options)) {
            creatEle.setAttribute(key, value)
        }
        selector.parentNode.insertBefore(creatEle, selector)
        creatEle.appendChild(selector)
    },

    unwrap: el => {
        const elParentNode = el.parentNode
        if (elParentNode !== document.body) {
            elParentNode.parentNode.insertBefore(el, elParentNode)
            elParentNode.parentNode.removeChild(elParentNode)
        }
    },

    isHidden: ele => ele.offsetHeight === 0 && ele.offsetWidth === 0,

    getEleTop: ele => {
        let actualTop = ele.offsetTop
        let current = ele.offsetParent

        while (current !== null) {
            actualTop += current.offsetTop
            current = current.offsetParent
        }

        return actualTop
    }

};