(() => {
    if (!document.getElementById('post-comment')) return
    function initWaline() {
        const waline = Waline.init(Object.assign({
            el: '#waline-wrap',
            serverURL: GLOBAL_CONFIG.source.waline.serverURL,
            pageview: false,
            dark: 'html[data-theme="dark"]',
            path: window.location.pathname,
            comment: false,
        }, null))
    }

    const loadWaline = async () => {
        if (typeof Waline === 'object') initWaline()
        else {
            await getCSS(GLOBAL_CONFIG.source.waline.css)
            await getScript(GLOBAL_CONFIG.source.waline.js)
            initWaline()
        }
    }

    if ('Waline' === 'Waline' || !false) {
        if (false) btf.loadComment(document.getElementById('waline-wrap'), loadWaline)
        else setTimeout(loadWaline, 0)
    } else {
        window.loadOtherComment = loadWaline
    }
})()