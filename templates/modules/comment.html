<th:block th:fragment="comment(group, kind, name, allowComment)" th:if="${allowComment && theme.config.comments.commentsEnable}">
    <!-- 已知问题 PJAX 下，comment 首次请求会出错。当前的临时解决办法是使用 js 重试 -->
    <div id="post-comment">
        <div class="comment-head">
            <div class="comment-headline"><i class="haofont hao-icon-chat--fill" style="font-size: 20px;"></i> <span>评论</span></div>
            <div  class="comment-randomInfo">
                <a th:if="${theme.config.comments.visitorMail.visitorMailEnable}"
                   onclick="heo.addRandomCommentInfo()" href="javascript:void(0)">匿名评论</a>
                <a href="/privacy">隐私政策</a>
            </div>
            <div class="comment-tips" id="comment-tips">
                <span>你无需删除空行，直接评论以获取最佳展示效果</span>
            </div>
        </div>


        <th:block th:if="${ #strings.equals(theme.config.comments.use, 'Twikoo') &&
                 not #strings.isEmpty(theme.config.comments.twikoos.envId)}">
            <div id="twikoo-wrap"></div>
            <style>
                #twikoo .tk-tag-green {
                    background-color: #3b70fc;
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                }

            </style>
        </th:block>

        <div th:if="${#strings.equals(theme.config.comments.use, 'Artalk') && not #strings.isEmpty(theme.config.comments.artalks.server)}"
             id="artalk-wrap"></div>

        <div th:if="${#strings.equals(theme.config.comments.use, 'Waline')
              && not #strings.isEmpty(theme.config.comments.walines.serverURL)}" id="waline-wrap"></div>

        <halo:comment th:if="${pluginFinder.available('PluginCommentWidget') && #strings.equals(theme.config.comments.use, 'commentWidget')}"
                      th:attr="name=${name},kind=${kind},group=${group}" colorScheme="document.documentElement.getAttribute('data-theme')"/>
    </div>
</th:block>