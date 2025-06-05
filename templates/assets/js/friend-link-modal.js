/**
 * 友链申请弹窗功能
 */

// 弹窗管理
const friendLinkModal = {
  // 模态框DOM元素
  modal: null,
  form: null,
  nameInput: null,
  emailInput: null,
  nicknameInput: null,
  urlInput: null,
  avatarInput: null,
  descTextarea: null,
  submitBtn: null,
  cancelBtn: null,
  closeBtn: null,
  modalContent: null,

  // 初始化
  init: function() {
    // DOM元素获取
    this.modal = document.getElementById('friend-link-apply-modal');
    if (!this.modal) return;

    this.form = document.getElementById('friend-link-form');
    this.nameInput = document.getElementById('link-name');
    this.nicknameInput = document.getElementById('link-nickname');
    this.urlInput = document.getElementById('link-url');
    this.avatarInput = document.getElementById('link-avatar');
    this.descTextarea = document.getElementById('link-desc');
    this.submitBtn = document.getElementById('submit-friend-link');
    this.cancelBtn = document.getElementById('cancel-friend-link');
    this.closeBtn = document.querySelector('.close-modal');
    this.modalContent = this.modal.querySelector('.modal-content');

    // 获取评论配置信息
    this.getCommentConfig();

    // 替换申请友链按钮的事件
    const applyLinkBtn = document.querySelector('.banner-button[onclick="addFriendLink()"]');
    if (applyLinkBtn) {
      applyLinkBtn.removeAttribute('onclick');
      applyLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.show();
      });
    }

    // 绑定事件
    this.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件冒泡
      this.hide();
    });
    
    this.cancelBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件冒泡
      this.hide();
    });
    
    this.submitBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件冒泡
      this.submit();
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
      }
    });
  },

  // 获取评论配置
  getCommentConfig: function() {
    // 尝试从页面中获取评论配置
    if (typeof GLOBAL_CONFIG === 'undefined') {
      window.GLOBAL_CONFIG = window.GLOBAL_CONFIG || {};
      
      // 从页面元素中获取插件名称
      const commentEl = document.querySelector('[data-widget-name]');
      if (commentEl) {
        GLOBAL_CONFIG.pluginName = commentEl.getAttribute('data-widget-name');
      } else {
        GLOBAL_CONFIG.pluginName = "PluginLinks";
      }
    }
  },

  // 显示模态框
  show: function() {
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    
    // 延迟聚焦到第一个输入框
    setTimeout(() => {
      this.nameInput.focus();
    }, 50);
  },

  // 隐藏模态框
  hide: function() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
    this.resetForm();
  },

  // 检查模态框是否可见
  isVisible: function() {
    return this.modal && this.modal.style.display === 'flex';
  },

  // 重置表单
  resetForm: function() {
    this.form.reset();
  },

  // 表单验证
  validate: function() {
    const name = this.nameInput.value.trim();
    const nickname = this.nicknameInput.value.trim();
    const url = this.urlInput.value.trim();
    const avatar = this.avatarInput.value.trim();
    const desc = this.descTextarea.value.trim();

    if (!name) {
      btf.snackbarShow('博客名称不能为空', false, 3000);
      this.nameInput.focus();
      return false;
    }
    
    if (!nickname) {
      btf.snackbarShow('评论昵称不能为空', false, 3000);
      this.nicknameInput.focus();
      return false;
    }

    if (!url) {
      btf.snackbarShow('博客地址不能为空', false, 3000);
      this.urlInput.focus();
      return false;
    }

    // 简单验证URL格式
    try {
      new URL(url);
    } catch (e) {
      btf.snackbarShow('请输入有效的博客地址', false, 3000);
      this.urlInput.focus();
      return false;
    }

    if (!avatar) {
      btf.snackbarShow('头像地址不能为空', false, 3000);
      this.avatarInput.focus();
      return false;
    }

    // 简单验证头像URL格式
    try {
      new URL(avatar);
    } catch (e) {
      btf.snackbarShow('请输入有效的头像地址', false, 3000);
      this.avatarInput.focus();
      return false;
    }

    if (!desc) {
      btf.snackbarShow('博客描述不能为空', false, 3000);
      this.descTextarea.focus();
      return false;
    }

    return true;
  },

  // 提交表单
  submit: function() {
    if (!this.validate()) return;
    
    // 准备表单数据
    const formData = {
      name: this.nameInput.value.trim(),
      nickname: this.nicknameInput.value.trim(),
      url: this.urlInput.value.trim(),
      avatar: this.avatarInput.value.trim(),
      desc: this.descTextarea.value.trim()
    };
    
    // 格式化评论内容
    const commentContent = `博客名称：${formData.name}\n评论昵称：${formData.nickname}\n网站地址：${formData.url}\n头像图片url：${formData.avatar}\n描述：${formData.desc}`;
    
    // 提交到评论系统，并传递表单数据以便直接使用
    this.submitToCommentSystem(commentContent, formData);
  },

  // 提交到不同评论系统
  submitToCommentSystem: function(content, formData) {
    // 显示加载中提示
    btf.snackbarShow('正在提交申请...', false, 5000);
    
    // 首先尝试直接调用Halo评论API
    this.submitToHaloAPI(content, formData);
  },

  // 直接调用Halo评论API
  submitToHaloAPI: function(content, formData) {
    try {
      // 从页面中获取评论相关数据
      const commentData = this.buildCommentData(content, formData);
      
      // 发送API请求
      fetch('/apis/api.halo.run/v1alpha1/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': this.getXsrfToken()
        },
        body: JSON.stringify(commentData),
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          response.text().then(text => {
            try {
              const errorJson = JSON.parse(text);
            } catch (e) {
            }
          }).catch(err => {
          });
          this.tryFallbackMethod(content);
          return null;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          btf.snackbarShow('友链申请已提交成功！', false, 3000);
          this.hide();
        }
      })
      .catch(error => {
        this.tryFallbackMethod(content);
      });
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // 构建评论数据
  buildCommentData: function(content, formData) {
    // 获取评论主题参数
    let group = "plugin.halo.run";
    let kind = "Plugin";
    let name = GLOBAL_CONFIG.pluginName || "PluginLinks";
    
    // 首先尝试从元数据div获取
    const metadataEl = document.getElementById('comment-metadata');
    if (metadataEl) {
      group = metadataEl.getAttribute('data-group') || group;
      kind = metadataEl.getAttribute('data-kind') || kind;
      name = metadataEl.getAttribute('data-name') || name;
    } 
    // 其次尝试从评论组件获取
    else {
      const commentWidget = document.querySelector('comment-widget');
      if (commentWidget) {
        group = commentWidget.getAttribute('data-group') || group;
        kind = commentWidget.getAttribute('data-kind') || kind;
        name = commentWidget.getAttribute('data-name') || name;
      }
    }
    
    // 构建符合Halo评论API的数据结构
    return {
      allowNotification: true,
      content: content,
      owner: {
        kind: "Email",
        name: "",  // 无需邮箱
        displayName: formData ? formData.nickname : "友链申请", // 昵称作为displayName
        annotations: {
          avatar: formData ? formData.avatar : "",
          website: formData ? formData.url : ""
        }
      },
      raw: content,
      subjectRef: {
        group: group,
        kind: kind,
        name: name,
        version: "v1alpha1"
      }
    };
  },
  
  // 尝试备用方法
  tryFallbackMethod: function(content) {
    setTimeout(() => {
      try {
        // 查找评论区并填写内容
        const success = this.fillCommentAndSubmit(content);
        
        if (success) {
          btf.snackbarShow('友链申请已提交成功！', false, 3000);
          this.hide();
        } else {
          btf.snackbarShow('评论提交失败，请手动填写申请信息', false, 3000);
          // 转为手动填写模式
          this.fallbackToManualComment(content);
        }
      } catch (error) {
        btf.snackbarShow('评论提交出错，请手动填写申请信息', false, 3000);
        // 转为手动填写模式
        this.fallbackToManualComment(content);
      }
    }, 500);
  },
  
  // 获取XSRF令牌
  getXsrfToken: function() {
    // 从cookie中获取
    const cookies = document.cookie.split(';');
    let token = '';
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('XSRF-TOKEN=')) {
        token = cookie.substring('XSRF-TOKEN='.length, cookie.length);
        break;
      }
    }
    return token;
  },

  // 填写评论框并提交
  fillCommentAndSubmit: function(content) {
    // 获取评论区域
    const commentArea = document.getElementById("post-comment");
    if (!commentArea) {
      return false;
    }
    
    // 尝试获取不同评论系统的文本输入框和提交按钮
    let commentTextarea, submitButton;
    
    // 检查评论系统类型
    if (GLOBAL_CONFIG.source.comments.use === 'Twikoo') {
      commentTextarea = document.querySelector('.el-textarea__inner');
      submitButton = document.querySelector('.tk-submit');
    } else if (GLOBAL_CONFIG.source.comments.use === 'Artalk') {
      commentTextarea = document.querySelector('.atk-textarea');
      submitButton = document.querySelector('.atk-send-btn');
    } else if (GLOBAL_CONFIG.source.comments.use === 'Waline') {
      commentTextarea = document.querySelector('.wl-editor');
      submitButton = document.querySelector('.wl-btn');
    } else if (GLOBAL_CONFIG.source.comments.use === 'commentWidget') {
      // 对于Halo官方评论组件
      const commentWidget = commentArea.querySelector('comment-widget');
      if (commentWidget) {
        // 尝试在Shadow DOM中查找文本区域和提交按钮
        setTimeout(() => {
          const shadowRoot = commentWidget.shadowRoot;
          if (shadowRoot) {
            commentTextarea = shadowRoot.querySelector('textarea');
            submitButton = shadowRoot.querySelector('button[type="submit"]');
            if (commentTextarea && submitButton) {
              this.fillAndSubmit(commentTextarea, submitButton, content);
              return true;
            }
          }
        }, 500);
        return true; // 假设成功，因为我们使用了setTimeout
      }
      
      // 如果没有找到组件标签，尝试常规选择器
      commentTextarea = document.querySelector('textarea.appearance-none');
      submitButton = document.querySelector('button[type="submit"]');
    }
    
    // 如果找不到具体的评论框，尝试通用查找
    if (!commentTextarea) {
      commentTextarea = document.querySelector("#post-comment textarea") || 
                      document.querySelector('textarea[placeholder*="评论"]') ||
                      document.querySelector('textarea[placeholder*="留言"]') ||
                      document.querySelector('.comment-textarea textarea');
                      
      submitButton = document.querySelector('#post-comment button[type="submit"]') ||
                    document.querySelector('.submit-btn') ||
                    document.querySelector('.comment-btn');
    }
    
    // 如果找到了评论框和提交按钮
    if (commentTextarea && submitButton) {
      this.fillAndSubmit(commentTextarea, submitButton, content);
      return true;
    }
    
    return false;
  },
  
  // 填写内容并提交
  fillAndSubmit: function(textarea, button, content) {
    // 创建input事件
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true
    });
    
    // 填写内容
    textarea.value = content;
    textarea.dispatchEvent(inputEvent);
    
    // 聚焦到评论框
    textarea.focus();
    
    // 滚动到评论区
    heo.scrollTo("#post-comment");
    
    // 点击提交按钮
    setTimeout(() => {
      button.click();
    }, 300);
  },
  
  // 切换到手动评论模式
  fallbackToManualComment: function(content) {
    // 隐藏模态框
    this.hide();
    
    // 使用原始的addFriendLink函数
    if (typeof addFriendLink === 'function') {
      addFriendLink();
    } else {
      // 滚动到评论区
      heo.scrollTo("#post-comment");
      btf.snackbarShow('请在评论区手动填写友链申请信息', false, 5000);
    }
  }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  friendLinkModal.init();
});

// 支持PJAX
document.addEventListener('pjax:complete', function() {
  friendLinkModal.init();
}); 
