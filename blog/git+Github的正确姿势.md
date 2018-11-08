此文章是笔者在github使用中的一些技巧性的总结，并非[git入门与实践](https://segmentfault.com/a/1190000004606816)，发表分享。

###### 入门推荐

- [Git --everything-is-loca 官方文档](https://git-scm.com/book/zh/v2)
- [Git教程-廖雪峰](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

## github帮助文档

- [官方网站](https://help.github.com/) / [基础中文翻译](https://github.com/waylau/github-help)
- [GitHub 漫游指南 by phodal](https://github.com/phodal/github)
- [github 图解教程，献给曾经的北京 Git 用户组 http://gitbeijing.com](https://github.com/happypeter/gitbeijing)
- [Git飞行规则(Flight Rules)](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md)
- [GitHub秘籍](https://github.com/tiimgreen/github-cheat-sheet/blob/master/README.zh-cn.md#%E8%B4%A1%E7%8C%AE%E8%80%85%E6%8C%87%E5%8D%97)
- [版本控制入门 – 搬进 Github](http://www.imooc.com/learn/390)
- [GotGitHub: an open source E-book about GitHub in Chinese](https://github.com/gotgit/gotgithub)
- [git-recipes](https://github.com/geeeeeeeeek/git-recipes) - 高质量的Git中文教程

## github flavord markdown语法介绍
- [guodongxiaren/README README文件语法解读](https://github.com/guodongxiaren/README)
- [中文技术文档的写作规范 by ruanyifeng](https://github.com/ruanyf/document-style-guide)
- [emoji-list/ github支持的emojj表情](https://github.com/caiyongji/emoji-list)
##### 栗子
- [掘金译文排版规则指北](https://github.com/xitu/gold-miner/wiki/%E8%AF%91%E6%96%87%E6%8E%92%E7%89%88%E8%A7%84%E5%88%99%E6%8C%87%E5%8C%97#%E4%B8%AD%E8%8B%B1%E6%96%87%E4%B9%8B%E9%97%B4%E9%9C%80%E8%A6%81%E5%A2%9E%E5%8A%A0%E7%A9%BA%E6%A0%BC)
- [markdown.md](https://github.com/xiaoyueyue165/smart/blob/dev/docs/markdown.md)

## github上传大文件
用于上传单个文件大于100M失败时使用
- [git-lfs](https://github.com/git-lfs/git-lfs)

## github.io添加项目展示

在自己的github项目上添加`gh-pages`分支，并保证里面有需要展示的代码，以`index.html`作为入口就ok，可以展示项目了

##### 栗子

- 项目地址： [vip](https://github.com/xiaoyueyue165/vip)
- 在线访问：https://xiaoyueyue165.github.io/vip/唯品会首页/

## github修改项目语言显示
在项目根目录添加文件名为`.gitattributes`的文本文件，写入:
````js
*.js linguist-language=Scala
*.css linguist-language=Scala
*.html linguist-language=Scala
````
意思就是将.js、css、html当作Scala语言来统计,简单粗暴
##### 栗子
将展示的语言变为`javascript`
- [King-of-glory](https://github.com/xiaoyueyue165/King-of-glory)
## github网站加载超时响应不完全的解决方法

1.修改  C:\Windows\System32\drivers\etc  中的hosts文件，将下面一段话添加到hosts文件中：

```
# GitHub Start 
192.30.253.113 github.com 
8.7.198.45 gist.github.com 
151.101.228.133 assets-cdn.github.com 
151.101.72.133 raw.githubusercontent.com 
151.101.72.133 gist.githubusercontent.com 
151.101.72.133 cloud.githubusercontent.com 
151.101.0.133 camo.githubusercontent.com 
151.101.228.133 avatars0.githubusercontent.com 
151.101.228.133 avatars1.githubusercontent.com 
151.101.228.133 avatars2.githubusercontent.com 
151.101.228.133 avatars3.githubusercontent.com 
151.101.228.133 avatars4.githubusercontent.com 
151.101.228.133 avatars5.githubusercontent.com 
151.101.228.133 avatars6.githubusercontent.com 
151.101.228.133 avatars7.githubusercontent.com 
151.101.228.133 avatars8.githubusercontent.com 
# GitHub End
```

2.修改hosts文件，直接通过IP访问github的CDN fastly.net，不用域名解析。

通过 www.ipaddress.com  这个网站查询github.global.ssl.fastly.net的IP地址，然后在hosts中增加一条。

```
#fix github cdn problem because of GFW
185.31.17.184  github.global.ssl.fastly.net
```

3.ping 网址链接，检测列表里的TTL值最小的IP输入到hosts里，如下修改
[Dns检测|Dns查询 - 站长工具](http://tool.chinaz.com/dns)

````bash
    # github
    192.30.253.113  github.com
    151.101.228.133 assets-cdn.github.com
    192.30.255.116  api.github.com
    151.101.0.133 camo.githubusercontent.com 
    151.101.76.133  avatars0.githubusercontent.com
    151.101.24.133 avatars2.githubusercontent.com
````

## 在公司的局域网使用git或github 设置代理
github上可以使用https进行访问。
````bash
    $ git config --global http.proxy http://web-proxy.oa.com:8080
````
> 但是这样可以clone了。但是如果要push代码，那就麻烦了。每次都需要输入密码。
###### 参考
-  http://www.cnblogs.com/lihaiping/p/4728993.html#commentform

## git push免密码

 每次提交代码时需要输入用户名密码，则说明你在从仓库中clone代码时使用的是HTTPS的key进行拉取代码。而使用SSH key拉取代码时，则不需要。
 
1.创建文件 `.git-credentials` 存储GIT用户名和密码

````bash
     # 创建
      touch .git-credentials
     # 在vim中打开 
      vim .git-credentials
     # 文件内容 
      https://{username}:{password}@github.com 
````

2.长期存储密码,进入git bash终端， 输入如下命令:
````bash
    git config --global credential.helper store
````
经过这样操作后就可以`免密登录`了

**注意事项**
文件结构要与下面的`git commit log`配置一样，3个配置文件保持这样的目录结构，并在同级目录下

![image](https://xiaoyueyue165.github.io/static/blog/Gitstructure.png)


## git commit log
优雅的提交，为 git 设置 commit template, 每次 git commit 的时候在 vim 中带出, 时刻提醒自己:

1.修改 ~/.gitconfig, 添加:
````bash
[commit]
template = ~/.gitmessage
````
2.新建 ~/.gitmessage 
````bash
  touch .gitmessage
````
**内容可以如下:**
````bash
* 简短的描述干了什么？
What: 

* 我为什么要这么做？
Why:

* 我是怎么做的？这么做会有什么副作用？
How:

````
or
````bash
* Head
  * type: feat, fix, docs, style, refactor, test, chore
  * scope:影响范围，可省略
  * subject:简短的提交信息
* Body
  * what：详细做了什么
  * why：为什么这样做
  * how：有什么后果
* Footer
       相关链接

````
名称 | 说明
---|---
type | commit 的类型
feat | 新特性
fix |修改问题
refactor| 代码重构
docs| 文档修改
style| 代码格式修改, 注意不是 css 修改
test|测试用例修改
chore| 其他修改, 比如构建流程, 依赖管理.
scope| commit 影响的范围, 比如: route, component, utils, build...
subject| commit 的概述, 建议符合 50/72 formatting
body|commit 具体修改内容, 可以分为多行, 建议符合 50/72 formatting
footer| 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.
###### 参考
- https://zhuanlan.zhihu.com/p/34223150
- https://zhuanlan.zhihu.com/p/26791124
- https://www.oschina.net/news/69705/git-commit-message-and-changelog-guide

3.在vscode中使用`git commit log`模板

##### 官方自定义
![image](https://xiaoyueyue165.github.io/static/questions/gitPush.png)

这条消息是笔者在[vscode](https://github.com/Microsoft/vscode)提交的`issues`答案，与上面的配置完全一致，配置的时候注意`关闭重启vscode`就没有问题了。
- https://www.github.com/Microsoft/vscode/issues/39048

##### 模板设置好后
![image](https://xiaoyueyue165.github.io/static/questions/gitCommitOk.png)

## Commit an issues

- `package` version:l
- `node` version: 
- `npm` (or `yarn`) version:  

Relevant code or config

```javascript

```

What you did:



What happened:

<!-- Please provide the full error message/screenshots/anything -->

Reproduction repository:

<!--
If possible, please create a repository that reproduces the issue with the
minimal amount of code possible.
-->

Problem description:



Suggested solution:

## Fork 工作流中的 Pull Request

 待完成

###### 参考
- https://github.com/geeeeeeeeek/git-recipes/wiki/3.3-%E5%88%9B%E5%BB%BA-Pull-Request
- https://help.github.com/articles/creating-a-pull-request/

## github上fork的项目如何保持同步

1.将自己主页fork的项目clone到本地

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate0.png)

此时，若我们查看项目的远程信息，发现结果都是关于我自己主页的，origin是分支名称：

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate1.png)

2.为项目添加远程分支：

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate2.png)

其中 upstream是远程分支名，后面的链接是原作者的仓库地址，此时再重新查看项目的远程信息，发现多了upstream的信息，是刚刚添加的原作者的仓库。

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate3.png)

3. 如果远程项目进行了更新，我们需要从upstream分支进行拉取，这样本地的代码就和原作者的代码同步了。

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate4.png)

4. 将本地代码提交到自己主页的分支，即origin上了，这样，我自己主页的项目就和原作者的项目进行了同步。

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate5.png)

5.确认更新

使用小乌龟对比一下当前版本与上一个版本的差异，会看到变更了两个文件：

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate8.png)

我们打开其中一个`book.md`文件进行查看，会看到最新版本比上一个版本删除了一行文字。

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate6.png)

再到github上面查看，可以看到刚才发起的merge从远程项目中合并更改的记录。

![](https://xiaoyueyue165.github.io/static/blog/forkUpdate/forkUpdate7.png)

## git 使用错误记录

**git 推送出现 "fatal: The remote end hung up unexpectedly"**

原因：上传的文件过大
解决办法：在项目.`git`文件夹下寻找`config`文件，添加如下代码：
````bash
[http]
postBuffer = 524288000
````
##### 参考
- https://blog.csdn.net/zcmain/article/details/76855595
## 附录
### 博客
初次发布于我个人博客上面
[git+Github的正确姿势](https://github.com/xiaoyueyue165/blog/issues/2)，github，欢迎star和follow，谢谢！