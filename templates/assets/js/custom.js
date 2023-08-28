/* 获取直属子元素 */
function getChildren(el, className) {
    for (let item of el.children) if (item.className === className) return item;
    return null;
}


// 跳转链接的卡片
document.addEventListener("DOMContentLoaded", () => {

    customElements.define(
        "hao-introduction-card",
        class HaoIntroductionCard extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    link: this.getAttribute("link") || 'https://0206.ink/',
                    img: this.getAttribute("img"),
                    tip: this.getAttribute("tip") || '小标题',
                    cardTitle: this.getAttribute("cardTitle") || '标题',
                    logo: this.getAttribute("logo"),
                    title: this.getAttribute("title"),
                    subTitle: this.getAttribute("subTitle"),
                };
                let style1 = ''
                let style2 = ''
                if(this.options.logo==null && this.options.title==null && this.options.subTitle==null){
                    style1 = 'height:416px'
                    style2 = 'height:100%;border-radius:15px'
                }
                let innerHTMLs =  `
					<div class="introduction-card" style="${style1}">
						<div class="introduction-card-top" style="${style2}">
							<div class="int-card-info">
								<div class="int-tip">${this.options.tip}</div>
								<div class="int-cardTitle">${this.options.cardTitle}</div>
							</div>
							<img src="${this.options.img}"
								class="no-lightbox" alt="introduction">

						</div>
				`;
                if(this.options.logo!=null && this.options.title!=null && this.options.subTitle!=null){
                    innerHTMLs += `
					
						<div class="introduction-card-bottom">
							<div class="left">
								<img src="${this.options.logo}"
								class="no-lightbox" alt="introduction">
								<div class="info">
									<div class="title">${this.options.title}</div>
									<div class="subTitle">${this.options.subTitle}</div>
								</div>
							</div>
							<div class="right">
								<a href="${this.options.link}" tableindex="-1" class="no-text-decoration"
									data-pjax-state="">前往
								</a>
							</div>
						</div>
                    `;
                }
                innerHTMLs += `
				   </div>
				`;
                this.innerHTML = innerHTMLs;
            }
        }
    );

    // 折叠框 folding
    customElements.define(
        "hao-folding",
        class HaoFolding extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    title: this.getAttribute("title"),
                    color: this.getAttribute("color") || '',
                    type:  this.getAttribute("type") || ''
                };
                const _temp = getChildren(this, "_tpl");
                let contents = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");

                let htmlStr = `
                <details class="folding-tag" ${this.options.color} ${this.options.type}>
                    <summary>${this.options.title}</summary>
                    <div class="content">
                       ${contents}
                    </div>
                </details>
            `;
                this.innerHTML = htmlStr;
            }
        }
    );


    // 链接卡片 link
    customElements.define(
        "hao-tag-link",
        class HaoTagLink extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    link: this.getAttribute("link"),
                    logo: this.getAttribute("logo"),
                    title: this.getAttribute("title") || '',
                    described: this.getAttribute("described") || '',
                };
                let htmlStr = `
				<div calss="hao-tag-link">
					<a class="tag-Link" target="_blank"
						href="${this.options.link}" rel="external nofollow noreferrer"
						draggable="false">
						<div class="tag-link-tips">引用站外地址</div>
						<div class="tag-link-bottom">
							<div class="tag-link-left"
								style="background-image:url(${this.options.logo})">
							</div>
							<div class="tag-link-right">
								<div class="tag-link-title">${this.options.title}</div>
								<div class="tag-link-sitename">${this.options.described}</div>
							</div><i class="haofont hao-icon-angle-right"></i>
						</div>
					</a>
				</div>
            `;
                this.innerHTML = htmlStr;
            }
        }
    );


    // Note (Bootstrap Callout)
    customElements.define(
        "hao-note",
        class HaoNote extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    class: this.getAttribute("class") || '',
                    noIcon: this.getAttribute("noIcon") || '',
                    style: this.getAttribute("style") || '',
                    content: this.getAttribute("content") || '',
                };
                let htmlStr = `
				<div class="note ${this.options.class} ${this.options.noIcon} ${this.options.style}"><p>${this.options.content}</p></div>
            `;
                this.innerHTML = htmlStr;
            }

        }
    );

    // 上标标签 tip
    customElements.define(
        "hao-tip",
        class HaoTip extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    class: this.getAttribute("class") || '',
                    noIcon: this.getAttribute("noIcon") || '',
                    content: this.getAttribute("content") || '',
                };
                let htmlStr = `
				<div class="tip ${this.options.class} ${this.options.noIcon}"><p>${this.options.content}</p></div>
            `;
                this.innerHTML = htmlStr;
            }

        }
    );


    // timeline
    customElements.define(
        "hao-timeline",
        class HaoTimeline extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    title: this.getAttribute("title") || '',
                    color: this.getAttribute("color") || ''
                };
                const _temp = getChildren(this, "_tpl");
                let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                let content = "";
                _innerHTML.replace(
                    /{timeline-item([^}]*)}([\s\S]*?){\/timeline-item}/g,
                    function ($0, $1, $2) {
                        content += `
					<div class="timeline-item">
						<div class="timeline-item-title">
						<div class="item-circle">
							<p>${$1}</p>
						</div>
						</div>
						<div class="timeline-item-content">
						<p>${$2
                            .trim()
                            .replace(/^(<br>)|(<br>)$/g, "")}</p>
						</div>
					</div>	
				`;
                    }
                );
                let htmlStr = `

					<div class="timeline ${this.options.color}">
						<div class="timeline-item headline">
							<div class="timeline-item-title">
							<div class="item-circle">
								<p>${this.options.title}</p>
							</div>
							</div>
						</div>
						${content}
						
					</div>
			
				`;
                this.innerHTML = htmlStr;
            }
        }
    );


    // 按钮 btns
    customElements.define(
        "hao-btns",
        class HaoBtns extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    class: this.getAttribute("class") || '',
                    style: this.getAttribute("style") || '',
                    grid: this.getAttribute("grid") || '',
                };
                const _temp = getChildren(this, "_tpl");
                let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                let content = "";
                if(this.options.class == 'rounded'){
                    _innerHTML.replace(
                        /{btns-item([^}]*)}/g,
                        function ($0, $1) {
                            var str = $1.split(",", 5);
                            if(str.length==5){
                                content += `
									<a target="_blank" rel="noopener external nofollow noreferrer"
										href="${str[2]}"
										class="no-text-decoration"><i class="${str[4]}"></i> <b>${str[0]}</b>
										<p class="p red">${str[1]}</p><img
											src="${str[3]}">
									</a>
								`;
                            }else{
                                content += `
								<a class="button no-text-decoration" href="${str[1]}" title="${str[0]}">
									<i class="${str[2]}"></i> ${str[0]}
								</a>
							`;
                            }
                        }

                    );
                }

                if(this.options.class == 'circle'){
                    _innerHTML.replace(
                        /{btns-item([^}]*)}/g,
                        function ($0, $1) {
                            var str = $1.split(",", 5);
                            if(str.length==5){
                                content += `
									<a target="_blank" rel="noopener external nofollow noreferrer"
										href="${str[2]}"
										class="no-text-decoration"><i class="${str[4]}"></i> <b>${str[0]}</b>
										<p class="p red">${str[1]}</p><img
											src="${str[3]}">
									</a>
								`;
                            }else{
                                content += `
									<a class="button no-text-decoration" target="_blank" rel="noopener external nofollow noreferrer"
										href="${str[1]}" title="${str[0]}">
										<img
											src="${str[2]}"/>${str[0]}
									</a>
								`;
                            }
                        }
                    );
                }

                let htmlStr = `
					<div class="btns ${this.options.class} ${this.options.style} ${this.options.grid}">
						${content}
					</div>
				`;
                this.innerHTML = htmlStr;
            }
        }
    );


    // 分栏 tab
    customElements.define(
        "hao-tabs",
        class HaoTabs extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    id: this.getAttribute("id") || '',
                    index: this.getAttribute("index") || ''
                };
                const id = this.options.id
                const index = this.options.index
                const _temp = getChildren(this, "_tpl");
                let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                let navs = "";
                let contents = "";
                let newIndex = 0;

                _innerHTML.replace(
                    /{tabs-item([^}]*)}([\s\S]*?){\/tabs-item}/g,
                    function ($0, $1, $2) {
                        newIndex +=1;
                        let active =''
                        if(index!='' && index!=null){
                            if(newIndex == index){
                                active = 'active';
                            }
                        }else{
                            if(newIndex==1){
                                active = 'active'
                            }
                        }
                        navs += `
						 	<li class="tab ${active}"><button type="button" data-href="#${id}-${newIndex}">${$1}</button></li>
						`;
                        contents += `
							<div class="tab-item-content  ${active}" id="${id}-${newIndex}">
							 ${$2.trim().replace(/^(<br>)|(<br>)$/g, "")}
							   <button type="button" class="tab-to-top" aria-label="scroll to top"><i class="haofont hao-icon-arrow-up"></i></button>
							</div>
						`;
                    }
                );
                let htmlStr = `
					<div class="tabs" id="${this.options.id}">
					   <ul class="nav-tabs">${navs}</ul>
					   <div class="tab-contents">${contents}</div>
					</div>
			
				`;
                this.innerHTML = htmlStr;
            }
        }
    );

    // gallerygroup 相册图库
    customElements.define(
        "hao-gallery-group",
        class HaoGalleryGroup extends HTMLElement {
            constructor() {
                super();
                const _temp = getChildren(this, "_tpl");
                let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                let contents = "";
                _innerHTML.replace(
                    /{gallery-group-item([^}]*)}/g,
                    function ($0, $1) {
                        var str = $1.split(",",4);
                        contents += `
							<figure class="gallery-group no-lightbox group-two"">
								<img class="gallery-group-img" 
								src="${str[3]}" 
								alt="Group Image Gallery" >
								<figcaption>
									<div class="gallery-group-name">${str[0]}</div>
									<p>${str[1]}</p><a target="_blank" rel="noopener" href="${str[2]}"></a>
								</figcaption>
							</figure>
						`;
                    }

                );
                let htmlStr = `
				    <div class="gallery-group-main">
					   ${contents}
					</div>
				`;
                this.innerHTML = htmlStr;
            }
        }
    );

    // gallery 相册
    customElements.define(
        "hao-gallery",
        class HaoGallery extends HTMLElement {
            constructor() {
                super();
                const _temp = getChildren(this, "_tpl");
                let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, "");
                let contents = "";
                _innerHTML.replace(
                    /{([^}]*)}/g,
                    function ($0, $1) {
                        var str = $1.split(",");
                        str.forEach((item) => {
                            contents += `
								<div class="fj-gallery-item">
									<img src="${item}">
								</div>
							`;
                        });
                    }
                );
                let htmlStr = `
					<section class="page-1 loadings">
						<div class="type-gallery ">
							<div class="gallery">
									${contents}	
							</div>
						</div>
					</section>
				`;
                this.innerHTML = htmlStr;
            }
        }
    );

    customElements.define(
        "hao-dplayer",
        class HaoDplayer extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    src: this.getAttribute("src") || "",
                    player:
                        this.getAttribute("player") ||
                        `/themes/theme-hao/assets/libs/dplayer/dplayer.html?url=`,
                    width: this.getAttribute("width") || "100%",
                    height: this.getAttribute("height") || "500px",
                };
                this.render();
            }
            render() {
                if (this.options.src)
                    this.innerHTML = `<iframe allowfullscreen="true" class="hao_vplayer" src="${
                        this.options.player + this.options.src
                    }" style="width:${this.options.width};height:${
                        this.options.height
                    }"></iframe>`;
                else this.innerHTML = "视频地址未填写！";
            }
        }
    );

    customElements.define(
        "hao-bilibili",
        class HaoBilibili extends HTMLElement {
            constructor() {
                super();
                this.options = {
                    bvid: this.getAttribute("bvid"),
                    page: +(this.getAttribute("page") || "1"),
                    width: this.getAttribute("width") || "100%",
                    height: this.getAttribute("height") || "500px",
                };
                this.render();
            }
            render() {
                if (this.options.bvid)
                    this.innerHTML = `<iframe allowfullscreen="true" class="hao_vplayer" src="//player.bilibili.com/player.html?bvid=${this.options.bvid}&page=${this.options.page}" style="width:${this.options.width};height:${this.options.height}"></iframe>`;
                else this.innerHTML = "bvid未填写！";
            }
        }
    );

    // customElements.define(
    //     "hao-pdf",
    //     class HaoPdf extends HTMLElement {
    //         constructor() {
    //             super();
    //             this.options = {
    //                 src: this.getAttribute("src") || "",
    //                 width: this.getAttribute("width") || "100%",
    //                 height: this.getAttribute("height") || "500px",
    //             };
    //             this.render();
    //         }
    //         render() {
    //             if (!this.options.src) return (this.innerHTML = "pdf地址未填写！");
    //             this.innerHTML = `
    // 			<div >
    // 				<iframe src="/themes/theme-hao/assets/libs/pdfjs/web/viewer.html?file=${this.options.src}" style="width:${this.options.width};height:${this.options.height}"></iframe>
    // 			</div>`;
    //         }
    //     }
    // );

});
