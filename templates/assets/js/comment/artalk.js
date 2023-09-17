(() => {
    if (!document.getElementById('post-comment')) return
    const initArtalk = () => {

        window.artalkItem = new Artalk(Object.assign({
            el: '#artalk-wrap',
            server: GLOBAL_CONFIG.source.artalk.artalkUrl,
            site: GLOBAL_CONFIG.source.artalk.siteName,
            pageKey: location.pathname,
            darkMode: document.documentElement.getAttribute('data-theme') === 'dark',
            countEl: '#ArtalkCount'
        }, null))

        if (GLOBAL_CONFIG.lightbox === 'null') return
        window.artalkItem.use(ctx => {
            ctx.on('list-loaded', () => {
                ctx.getCommentList().forEach(comment => {
                    const $content = comment.getRender().$content
                    btf.loadLightbox($content.querySelectorAll('img:not([atk-emoticon])'))
                })
            })
        })
    }

    const loadArtalk = async () => {
        if (typeof window.artalkItem === 'object') initArtalk()
        else {
            await getCSS(GLOBAL_CONFIG.source.artalk.css)
            await getScript(GLOBAL_CONFIG.source.artalk.js)
            initArtalk()
        }
    }

    document.getElementById('darkmode') && document.getElementById('darkmode').addEventListener('click', () => {
        setDarkMode()
    })
    document.getElementById('menu-darkmode') && document.getElementById('menu-darkmode').addEventListener('click', () => {
        setDarkMode()
    })
    document.getElementById('darkmode_switchbutton') && document.getElementById('darkmode_switchbutton').addEventListener('click', () => {
        setDarkMode()
    })
    function setDarkMode() {
        if (typeof window.artalkItem !== 'object') return
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark'
        window.artalkItem.setDarkMode(!isDark)
    }
    if ('Artalk' === 'Artalk' || !false) {
        if (false) btf.loadComment(document.getElementById('artalk-wrap'), loadArtalk)
        else loadArtalk()
    } else {
        window.loadOtherComment = loadArtalk
    }
})()