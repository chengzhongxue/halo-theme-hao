(() => {
    if (!document.getElementById('post-comment')) return
    const initArtalk = () => {

        window.artalkItem = new Artalk(Object.assign({
            el: '#artalk-wrap',
            server: GLOBAL_CONFIG.source.artalk.artalkUrl,
            site: GLOBAL_CONFIG.source.artalk.siteName,
            pageKey: location.pathname.replace(/\/page\/\d$/, ""),
            darkMode: false,
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

    function setDarkMode() {
        if (typeof window.artalkItem !== 'object') return
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark'
        window.artalkItem.setDarkMode(!isDark)
    }
    if ('Artalk' === 'Artalk' || !GLOBAL_CONFIG.source.comments.lazyload) {
        if (GLOBAL_CONFIG.source.comments.lazyload) btf.loadComment(document.getElementById('artalk-wrap'), loadArtalk)
        else loadArtalk()
    } else {
        window.loadOtherComment = loadArtalk
    }
})()