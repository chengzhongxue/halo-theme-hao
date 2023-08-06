let heo_cookiesTime = null;
// 第一次播放音乐
var heo_musicFirst = false;
// 音乐播放状态
var heo_musicPlaying = false;
let heo_keyboard = false;
let heo_intype = false;
let lastSayHello = "";
// 私有函数
var heo = {
    // 检测显示模式
    darkModeStatus: function () {
        let theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
        if (theme == 'light') {
            $(".menu-darkmode-text").text("深色模式");
        } else {
            $(".menu-darkmode-text").text("浅色模式");
        }
    },

    // //bb添加时间
    // changeTimeInEssay: function () {
    //     const relativeDate = function (selector) {
    //         selector.forEach(item => {
    //             const $this = item
    //             const timeVal = $this.getAttribute('datetime')
    //             $this.innerText = btf.diffDate(timeVal, true)
    //             $this.style.display = 'inline'
    //         })
    //     }
    //
    //     if (document.querySelector('#comment')) {
    //         relativeDate(document.querySelectorAll('#comment time'))
    //     }
    // },

    // 首页bb
    initIndexEssay: function() {
        if (document.querySelector("#bber-talk"))
            new Swiper(".swiper-container",{
                direction: "vertical",
                loop: !0,
                autoplay: {
                    delay: 3e3,
                    pauseOnMouseEnter: !0
                }
            })
    },


    // 只在首页显示
    onlyHome: function () {
        var urlinfo = window.location.pathname;
        urlinfo = decodeURIComponent(urlinfo);
        if (urlinfo == '/') {
            $('.only-home').attr('style', 'display: flex');
        } else {
            $('.only-home').attr('style', 'display: none');
        }
    },

    //是否在首页
    is_Post: function () {
        var url = window.location.href;  //获取url
        if (url.indexOf("/p/") >= 0) { //判断url地址中是否包含code字符串
            return true;
        } else {
            return false;
        }
    },


    //监测是否在页面开头
    addNavBackgroundInit: function() {
        var e = 0
            , t = 0;
        document.body && (e = document.body.scrollTop),
        document.documentElement && (t = document.documentElement.scrollTop),
        0 != (e - t > 0 ? e : t) && (document.getElementById("page-header").classList.add("nav-fixed"),
            document.getElementById("page-header").classList.add("nav-visible"),
            $("#cookies-window").hide())
    },

    // 标签页面
    //分类条
    // tagPageActive: function () {
    //     var urlinfo = window.location.pathname;
    //     urlinfo = decodeURIComponent(urlinfo)
    //     // console.log(urlinfo);
    //     // 验证是否是分类链接
    //     var pattern = /\/tags\/.*?\//;
    //     var patbool = pattern.test(urlinfo);
    //     // console.log(patbool);
    //     // 获取当前的分类
    //     if (patbool) {
    //         var valuegroup = urlinfo.split("/");
    //         // console.log(valuegroup[2]);
    //         // 获取当前分类
    //         var nowCategorie = valuegroup[2];
    //         if (document.querySelector('#tag-page-tags')) {
    //             $('a').removeClass('select')
    //             document.getElementById(nowCategorie).classList.add("select");
    //         }
    //     }
    // },

    //分类条
    // categoriesBarActive: function () {
    //     if (document.querySelector('#category-bar')) {
    //         $(".category-bar-item").removeClass("select")
    //     }
    //     var urlinfo = window.location.pathname;
    //     urlinfo = decodeURIComponent(urlinfo);
    //     // console.log(urlinfo);
    //     //判断是否是首页
    //     if (urlinfo == '/') {
    //         if (document.querySelector('#category-bar')) {
    //             document.getElementById('category-bar-home').classList.add("select");
    //         }
    //     } else {
    //         // 验证是否是分类链接
    //         var pattern = /\/categories\/.*?\//;
    //         var patbool = pattern.test(urlinfo);
    //         // console.log(patbool);
    //         // 获取当前的分类
    //         if (patbool) {
    //             var valuegroup = urlinfo.split("/");
    //             // console.log(valuegroup[2]);
    //             // 获取当前分类
    //             var nowCategorie = valuegroup[2];
    //             if (document.querySelector('#category-bar')) {
    //                 document.getElementById(nowCategorie).classList.add("select");
    //             }
    //         }
    //     }
    // },

    // 页脚友链
    addFriendLinksInFooter: function () {
        const linksUrl = GLOBAL_CONFIG.source.links.linksUrl
        const links = GLOBAL_CONFIG.source.links.linksData
        const num = GLOBAL_CONFIG.source.links.linksNum
        var randomFriendLinks = getArrayItems(links, num);
        var htmlText = '';
        for (let i = 0; i < randomFriendLinks.length; ++i) {
            var item = randomFriendLinks[i]
            htmlText += `<a class='footer-item' href='${item.spec.url}'  target="_blank" rel="noopener nofollow">${item.spec.displayName}</a>`;
        }
        htmlText += `<a class='footer-item' href='${linksUrl}'>更多</a>`
        document.getElementById("friend-links-in-footer").innerHTML = htmlText;
    },

    //禁止图片右键单击
    stopImgRightDrag: function () {
        var img = $("img");
        img.on("dragstart", function () {
            return false;
        });
    },

    //置顶文章横向滚动
    topPostScroll: function () {
        if (document.getElementById("recent-post-top")) {
            let xscroll = document.getElementById("recent-post-top");
            xscroll.addEventListener("mousewheel", function (e) {
                //计算鼠标滚轮滚动的距离
                let v = -e.wheelDelta / 2;
                xscroll.scrollLeft += v;
                //阻止浏览器默认方法
                if (document.body.clientWidth < 1300) {
                    e.preventDefault();
                }
            }, false);
        }
    },

    topCategoriesBarScroll: function () {
        if (document.getElementById("category-bar-items")) {
            let xscroll = document.getElementById("category-bar-items");
            xscroll.addEventListener("mousewheel", function (e) {
                //计算鼠标滚轮滚动的距离
                let v = -e.wheelDelta / 2;
                xscroll.scrollLeft += v;
                //阻止浏览器默认方法
                e.preventDefault();
            }, false);
        }
    },

    //作者卡片问好
    sayhi: function () {
        if (GLOBAL_CONFIG.profileStyle == 'default') {
            if (document.querySelector('#author-info__sayhi')) {
                document.getElementById("author-info__sayhi").innerHTML = getTimeState() + "！我是";
            }
        }else{
            if (document.querySelector('#author-info__sayhi')) {
                document.getElementById("author-info__sayhi").innerHTML = getTimeState();
            }
        }

    },

    // 添加标签
    addTag: function () {
        //添加new标签
        if (document.querySelector('.heo-tag-new')) {
            $(".heo-tag-new").append(`<sup class="heo-tag heo-tag-new-view">N</sup>`)
        }
        //添加hot标签
        if (document.querySelector('.heo-tag-hot')) {
            $(".heo-tag-hot").append(`<sup class="heo-tag heo-tag-hot-view">H</sup>`)
        }
    },

    // 二维码
    qrcodeCreate: function () {
        if (document.getElementById('qrcode')) {
            document.getElementById("qrcode").innerHTML = "";
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: window.location.href,
                width: 250,
                height: 250,
                colorDark: "#000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    },

    // 刷新即刻短文瀑布流
    reflashEssayWaterFall: function() {
        document.querySelector("#waterfall") && setTimeout((function() {
                waterfall("#waterfall"),
                    document.getElementById("waterfall").classList.add("show")
            }
        ), 500)
    },

    // 即刻短文添加灯箱
    addMediumInEssay: function () {
        if (document.querySelector('#waterfall')) {
            mediumZoom(document.querySelectorAll('[data-zoomable]'))
        }
    },

    // 下载图片
    downloadImage: function (imgsrc, name) { //下载图片地址和图片名
        rm.hideRightMenu();
        if (rm.downloadimging == false) {
            rm.downloadimging = true;
            btf.snackbarShow('正在下载中，请稍后', false, 10000)
            setTimeout(function () {
                let image = new Image();
                // 解决跨域 Canvas 污染问题
                image.setAttribute("crossOrigin", "anonymous");
                image.onload = function () {
                    let canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, image.width, image.height);
                    let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
                    let a = document.createElement("a"); // 生成一个a元素
                    let event = new MouseEvent("click"); // 创建一个单击事件
                    a.download = name || "photo"; // 设置图片名称
                    a.href = url; // 将生成的URL设置为a.href属性
                    a.dispatchEvent(event); // 触发a的单击事件
                };
                image.src = imgsrc;
                btf.snackbarShow('图片已添加盲水印，请遵守版权协议');
                rm.downloadimging = false;
            }, "10000");
        } else {
            btf.snackbarShow('有正在进行中的下载，请稍后再试');
        }
    },

    //控制评论弹幕
    switchCommentBarrage: function () {
        let commentBarrage = document.querySelector('.comment-barrage');
        if (commentBarrage) {
            if ($(".comment-barrage").is(":visible")) {
                $(".comment-barrage").hide();
                $(".menu-commentBarrage-text").text("显示热评");
                document.querySelector("#consoleCommentBarrage").classList.remove("on");
                localStorage.setItem('commentBarrageSwitch', 'false');
                btf.snackbarShow("✨ 已关闭评论弹幕", false, 2000)
            } else if ($(".comment-barrage").is(":hidden")) {
                $(".comment-barrage").show();
                $(".menu-commentBarrage-text").text("关闭热评");
                document.querySelector("#consoleCommentBarrage").classList.add("on");
                localStorage.removeItem('commentBarrageSwitch');
                btf.snackbarShow("✨ 已开启评论弹幕", false, 2000)
            }
        }
        if(GLOBAL_CONFIG.rightMenuEnable){
            rm.hideRightMenu();
        }
    },

    //隐藏cookie窗口
    hidecookie: function() {
        heo_cookiesTime = setTimeout((()=>{
                document.getElementById("cookies-window").classList.add("cw-hide"),
                    setTimeout((()=>{
                            $("#cookies-window").hide()
                        }
                    ), 1e3)
            }
        ), 3e3)
    },

    //隐藏今日推荐
    hideTodayCard: function () {
        if (document.getElementById("todayCard")) {
            document.getElementById("todayCard").classList.add('hide');
        }
    },

    //更改主题色
    changeThemeColor: function (color) {
        if (document.querySelector('meta[name="theme-color"]') !== null) {
            document.querySelector('meta[name="theme-color"]').setAttribute('content', color)
        }
    },

    //自适应主题色
    initThemeColor: function () {
        if (heo.is_Post()) {
            const currentTop = window.scrollY || document.documentElement.scrollTop
            if (currentTop === 0) {
                let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--heo-main');
                heo.changeThemeColor(themeColor);
            } else {
                let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--heo-background');
                heo.changeThemeColor(themeColor);
            }
        } else {
            let themeColor = getComputedStyle(document.documentElement).getPropertyValue('--heo-background');
            heo.changeThemeColor(themeColor);
        }
    },

    //跳转到指定位置
    jumpTo: function (dom) {
        $(document).ready(function () {
            $("html,body").animate({
                scrollTop: $(dom).eq(i).offset().top
            }, 500 /*scroll实现定位滚动*/); /*让整个页面可以滚动*/
        });
    },

    //显示加载动画
    showLoading: function () {
        document.querySelector("#loading-box").classList.remove("loaded");
        let cardColor = getComputedStyle(document.documentElement).getPropertyValue('--heo-card-bg');
        heo.changeThemeColor(cardColor);
    },

    //隐藏加载动画
    hideLoading: function () {
        document.querySelector("#loading-box").classList.add("loaded");
    },

    //切换音乐播放状态
    musicToggle: function (changePaly = true) {
        const navMusicEl = document.getElementById("nav-music");
        if (!heo_musicFirst) {
            heo.musicBindEvent();
            heo_musicFirst = true;
        }
        let msgPlay = '<i class="haofont hao-icon-play"></i><span>播放音乐</span>';
        let msgPause = '<i class="haofont hao-icon-pause"></i><span>暂停音乐</span>';
        if (heo_musicPlaying) {
            navMusicEl.classList.remove("playing");
            if(GLOBAL_CONFIG.rightMenuEnable){
                document.getElementById("menu-music-toggle").innerHTML = msgPlay;
            }
            document.getElementById("nav-music-hoverTips").innerHTML = "音乐已暂停";
            document.querySelector("#consoleMusic").classList.remove("on");
            heo_musicPlaying = false;
            navMusicEl.classList.remove("stretch");
        } else {
            navMusicEl.classList.add("playing");
            if(GLOBAL_CONFIG.rightMenuEnable){
                document.getElementById("menu-music-toggle").innerHTML = msgPause;
            }
            document.querySelector("#consoleMusic").classList.add("on");
            heo_musicPlaying = true;
            navMusicEl.classList.add("stretch");
        }
        if (changePaly) document.querySelector("#nav-music meting-js").aplayer.toggle();
        if(GLOBAL_CONFIG.rightMenuEnable){
            rm.hideRightMenu();
        }
    },

    // 音乐绑定事件
    musicBindEvent: function () {
        document.querySelector("#nav-music .aplayer-music").addEventListener("click", function () {
            heo.musicTelescopic();
        });
        document.querySelector("#nav-music .aplayer-button").addEventListener("click", function () {
            heo.musicToggle(false);
        });
    },

    // 音乐伸缩
    musicTelescopic: function () {
        const navMusicEl = document.getElementById("nav-music");
        if (navMusicEl.classList.contains("stretch")) {
            navMusicEl.classList.remove("stretch");
        } else {
            navMusicEl.classList.add("stretch");
        }
    },

    //音乐上一曲
    musicSkipBack: function () {
        document.querySelector("meting-js").aplayer.skipBack(),
            rm.hideRightMenu()
    },

    //音乐下一曲
    musicSkipForward: function () {
        document.querySelector("meting-js").aplayer.skipForward(),
            rm.hideRightMenu()
    },

    //获取音乐中的名称
    musicGetName: function () {
        for (var e = $(".aplayer-title"), t = [], o = e.length - 1; o >= 0; o--)
            t[o] = e[o].innerText;
        return t[0]
    },


    // 显示打赏中控台
    rewardShowConsole: function () {
        $('.console-card-group-reward').attr('style', 'display: flex');
        $('.console-card-group').attr('style', 'display: none');
        document.querySelector("#console").classList.add("show");
        heo.initConsoleState()

    },

    //显示中控台
    showConsole: function () {
        $('.console-card-group-reward').attr('style', 'display: none');
        $('.console-card-group').attr('style', 'display: flex');
        document.querySelector("#console").classList.add("show");


    },

    //隐藏中控台
    hideConsole: function () {
        document.querySelector("#console").classList.remove("show");
    },

    //快捷键功能开关
    keyboardToggle: function () {
        if (heo_keyboard) {
            heo_keyboard = false;
            document.querySelector("#consoleKeyboard").classList.remove("on");
            localStorage.setItem('keyboardToggle', 'false');
        } else {
            heo_keyboard = true;
            document.querySelector("#consoleKeyboard").classList.add("on");
            localStorage.setItem('keyboardToggle', 'true');
        }
    },

    //滚动到指定id
    scrollTo: function (id) {
        var domTop = document.querySelector(id).offsetTop;
        window.scrollTo(0, domTop - 80);
    },

    //隐藏侧边栏
    hideAsideBtn: () => { // Hide aside
        const $htmlDom = document.documentElement.classList
        $htmlDom.contains('hide-aside')
            ? saveToLocal.set('aside-status', 'show', 2)
            : saveToLocal.set('aside-status', 'hide', 2)
        $htmlDom.toggle('hide-aside')
        $htmlDom.contains("hide-aside") ? document.querySelector("#consoleHideAside").classList.add("on") : document.querySelector("#consoleHideAside").classList.remove("on")
    },

    changeSayHelloText: function() {
        const e = GLOBAL_CONFIG.helloText.length == 0 ? ["🤖️ 数码科技爱好者", "🔍 分享与热心帮助", "🏠 智能家居小能手", "🔨 设计开发一条龙", "🤝 专修交互与设计", "🏃 脚踏实地行动派", "🧱 团队小组发动机", "💢 壮汉人狠话不多"] : GLOBAL_CONFIG.helloText
            , t = document.getElementById("author-info__sayhi");
        let o = e[Math.floor(Math.random() * e.length)];
        for (; o === lastSayHello; )
            o = e[Math.floor(Math.random() * e.length)];
        t.textContent = o,
            lastSayHello = o
    },


    //初始化console图标
    initConsoleState: function() {
        document.documentElement.classList.contains("hide-aside") ? document.querySelector("#consoleHideAside").classList.add("on") : document.querySelector("#consoleHideAside").classList.remove("on")
    },


    // 音乐节目切换背景
    changeMusicBg: function (isChangeBg = true) {
        if (window.location.pathname != "/music") {
            return;
        }
        const anMusicBg = document.getElementById("an_music_bg");

        if (isChangeBg) {
            // player listswitch 会进入此处
            const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
            anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
        } else {
            // 第一次进入，绑定事件，改背景
            let timer = setInterval(() => {
                const musiccover = document.querySelector("#anMusic-page .aplayer-pic");
                // 确保player加载完成
                if (musiccover) {
                    clearInterval(timer);
                    anMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
                    // 绑定事件
                    heo.addEventListenerChangeMusicBg();

                    // 暂停nav的音乐
                    if(GLOBAL_CONFIG.navMusicEnable){
                        if (
                            document.querySelector("#nav-music meting-js").aplayer &&
                            !document.querySelector("#nav-music meting-js").aplayer.audio.paused
                        ) {
                            heo.musicToggle();
                        }
                    }
                }
            }, 100);
        }
    },
    addEventListenerChangeMusicBg: function () {
        const anMusicPage = document.getElementById("anMusic-page");
        const aplayerIconMenu = anMusicPage.querySelector(".aplayer-info .aplayer-time .aplayer-icon-menu");

        anMusicPage.querySelector("meting-js").aplayer.on("loadeddata", function () {
            heo.changeMusicBg();
            console.info("player loadeddata");
        });

        aplayerIconMenu.addEventListener("click", function () {
            document.getElementById("menu-mask").style.display = "block";
            document.getElementById("menu-mask").style.animation = "0.5s ease 0s 1 normal none running to_show";
        });

        document.getElementById("menu-mask").addEventListener("click", function () {
            if (window.location.pathname != "/music") return;
            anMusicPage.querySelector(".aplayer-list").classList.remove("aplayer-list-hide");
        });
    },

}