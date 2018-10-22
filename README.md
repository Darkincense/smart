# smart

> :octocat: 日常代码库

## 导航栏

- [Show MyCode](#show-mycode)
- [周刊](#周刊)
- [社区](#社区)
- [Follow blog](#follow-blog)
- [F2E](#f2e)
- [教程及学习平台](#教程及学习平台)
- [优秀的文章](#优秀的文章)
- [代码格式](#代码格式)
### Show-mycode

- https://leetcode-cn.com/xiaoyueyue165/
- https://freecodecamp.cn/
- https://codesandbox.io/u/xiaoyueyue165

### 周刊

- [阮一峰的网络日志](http://www.ruanyifeng.com/blog/)
- [奇舞周刊](https://weekly.75team.com/)
- [FEX](http://fex.baidu.com/weekly/)
- [weekly](https://github.com/dt-fe/weekly) 前端精读周刊
- [50weekly](https://ihtml5.github.io/50weekly/) 发现高质量的前端资源 
### 社区

- [stackoverflow](https://stackoverflow.com/) / [segmentfault](https://segmentfault.com/)
- [cnode](https://cnodejs.org/)

#### 团队
- [奇舞团](https://75team.com/)

### Follow-blog

各平台 | 查看
---|---
web | [月影](https://www.h5jun.com/archives/) / [颜海镜](http://yanhaijing.com/)
知乎 |[方正](https://www.zhihu.com/people/fang-zheng-3-34/posts)
CSDN |[谢杨易](https://blog.csdn.net/u013510838)
Github |[xufei](https://github.com/xufei/blog) / [mqyqingfeng](https://github.com/mqyqingfeng/Blog) / [dunizb](https://github.com/dunizb/blog) / [youngwind](https://github.com/youngwind/blog) / [jawil](https://github.com/jawil/blog/issues)

### F2E

- [learning-article](https://github.com/webproblem/learning-article) 学习资源汇总，持续更新
- [ES5](http://yanhaijing.com/es5/) / [ES6](http://es6.ruanyifeng.com/) / [MDN](https://developer.mozilla.org/zh-CN/)
- [Best of Javascript](https://bestof.js.org/) / [2017](https://risingstars.js.org/2017/zh) 
- [developer-roadmap](https://github.com/kamranahmedse/developer-roadmap) - 2018年路线图成为web开发人员
- [f2e-awesome/knowledge](https://github.com/f2e-awesome/knowledge) 文档着重构建一个完整的「前端技术架构图谱」，方便 F2E 学习与进阶
- [前端圈](https://fequan.com/) 
- [fetool](https://github.com/nieweidong/fetool) 大前端的瑞士军刀，只记录有用的

### 教程及学习平台

- [rails365](https://www.rails365.net/)
- [Frontend Masters 2018 前端学习手册](https://frontendmasters.com/books/front-end-handbook/2018/)
- [U学在线](http://www.buptict.cn/index)
- [奇舞学院](https://t.75team.com/video) / [ppt在线](https://webzhao.github.io/fe-camp/index.html) / [声享hot](https://ppt.baomitu.com/hot)
- [phodal/growth-ebook](https://github.com/phodal/growth-ebook) 全栈增长工程师指南 http://growth.phodal.com/
- [菜鸟教程](http://www.runoob.com/)
- [网易云课堂](https://study.163.com/)

### 优秀的文章

- [2015前端组件化框架之路](https://github.com/xufei/blog/issues/19) by [xufei](https://github.com/xufei)
- [为什么整个互联网行业都缺前端工程师？](https://zhuanlan.zhihu.com/p/20598089)
- [如何在疲劳的JS世界中持续学习](https://github.com/ProtoTeam/blog/blob/master/201805/1.md)
- [我如何零基础转行成为一个自信的前端](https://juejin.im/post/5bb9aed1e51d451a3f4c3923?utm_source=gold_browser_extension)
- [工作五年，后面四年重复着第一年的活儿？](https://www.barretlee.com/blog/2016/07/21/donnot-repeat-yourself/)
- [页面可视化搭建工具前生今世](https://zhuanlan.zhihu.com/p/37171897)


### 代码格式

- [javascript](https://github.com/airbnb/javascript) - Javascript风格指导
- [project-guidelines](https://github.com/wearehive/project-guidelines/blob/master/README-zh.md) - JS 项目行军指南
- [You-Dont-Need-jQuery](https://github.com/nefe/You-Dont-Need-jQuery/blob/master/README.zh-CN.md) - 你不需要使用jquery
- [clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript) - 干净的概念用于JavaScript代码
- [frontend-guidelines](https://github.com/bendc/frontend-guidelines) - Some HTML, CSS and JS best practices.
- [TGideas](http://tguide.qq.com/main/index.htm) TGideas整体WEB解决方案 

#### git commit log
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


**[⬆ 回到顶部](#smart)**
