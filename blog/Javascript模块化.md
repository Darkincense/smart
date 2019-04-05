#  Javascript模块化 

## 前言

此篇文章研究怎样合理组织代码结构，如写业务代码，写原生组件等，与设计模式章节有部分重合。

## 模块模式（非 es6 场合常用）

使用 `jquery` 的 **getJSON** 方法来获取 github repoList 数据列表，未加 loading ...
````html
<div id="root"></div>
````
````js
var Module = {
        init: function () {
            var y = this;
            y.id = "root";
            y.error = null;
            y.fetchOrderList();// 若有可以扩展添加结束处理的逻辑
        },
        fetchOrderList: function () {
            var y = this;
            $.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars').then(
                value => {
                    y.render(value);
                },
                error => {
                    y.error = error; // 错误标记
                    y._fetchDataFailed(error);
                }
            )
        },
        render: function (data) {
            var y = this;
            let html;
            if (y.error === null) {
                html = this._resolveData(data);
            } else {
                html = data;
            }
            document.getElementById(y.id).innerHTML = html;
        },

        // 需要时格式化处理
        _resolveData: function (data) {
            var repos = data.items;
            var repoList = repos.map(function (repo, index) {
                return `<li> <a href=${repo.html_url}>${repo.name}</a> (${repo.stargazers_count} stars) <br /> ${repo.description}</li>`
            });
            return `<main>
            <h1>Most Popular JavaScript Projects in Github</h1>
            <ol> ${repoList.join('')}</ol>
              </main> `

        },
        // 错误处理
        _fetchDataFailed: function (error) {
            let errorHtml = `<span>Error: ${error.message}</span>`;
            this.render(errorHtml)
        }
    }
    Module.init();
````