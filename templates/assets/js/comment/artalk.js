(() => {
    if (!document.getElementById('post-comment')) return
    const initArtalk = () => {

        window.artalkItem = Artalk.init(Object.assign({
            el: '#artalk-wrap',
            server: GLOBAL_CONFIG.source.artalk.artalkUrl,
            site: GLOBAL_CONFIG.source.artalk.siteName,
            pageKey: location.pathname.replace(/\/page\/\d$/, ""),
            darkMode: false,
            countEl: '#ArtalkCount'
        }, null))

        function versionOld(ctx){
            // 旧版本兼容性补丁
            ctx.getCommentList().forEach(comment => {
                const $content = comment.getRender().$content
                btf.loadLightbox($content.querySelectorAll('img:not([atk-emoticon])'))
            })
        }

        function version_2_7_3_WithUpper(ctx){
            // 2.7.3 版本及以后版本支持
            ctx.get('list').getCommentNodes().forEach(comment => {
                const $content = comment .getRender().$content
                btf.loadLightbox($content.querySelectorAll('img:not([atk-emoticon])'))
            })

        }

        function versionCheck(ctx){
            if(ctx.getCommentList != undefined){
                // Artalk 版本小于于 2.7.3
                versionOld(ctx);
            }else{
                version_2_7_3_WithUpper(ctx);
            }
        }

        if (GLOBAL_CONFIG.lightbox === 'null') return
        window.artalkItem.on('list-loaded', () => {
            versionCheck(window.artalkItem.ctx);
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