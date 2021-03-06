## 介绍

[FIS3](http://fis.baidu.com/fis3/docs/beginning/intro.html) 是面向前端的工程构建工具。解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。（官方文档）

我把它定义为一个项目后期部署上线的工具,可以使用它压缩 css，js 与图片压缩（png），支持 Css 精灵图的合并，做到文件指纹（添加 md5 戳），方便项目部署的更新迭代，本地调试可模拟线上发布后的状态，便于调试。

## 安装

```
npm install -g fis3
```

## 配置文件

> 默认为 fis.conf.js 文件

#### fis.match()

```
fis.match(selector, props);
```

> 使用 props 配置规则编译 selector 匹配到的文件

#### fis.media()

fis.media() 接口提供多种状态功能，比如有些配置是仅供开发环境下使用，有些则是仅供生产环境使用的。

```
fis.match('*', {
  useHash: false
});

fis.media('prod').match('*.js', {
  optimizer: fis.plugin('uglify-js')
});
```

```
fis3 release <media>
```

- <media> 配置的 media 值

```
fis3 release prod
```

编译时使用 prod 指定的编译配置，即对 js 进行压缩。

如上，fis.media() 可以使配置文件变为多份（多个状态，一个状态一份配置）。

```
fis.media('rd').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://remote-rd-host/receiver.php'
  })
});

fis.media('qa').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://remote-qa-host/receiver.php'
  })
});
```

- fis3 release rd push 到 RD 的远端机器上
- fis3 release qa push 到 QA 的远端机器上
  > media dev 已经被占用，默认情况下不加 <media> 参数时默认为 dev

#### fis3 inspect

```
// 在项目根目录下执行查看项目文件将如何被编译处理
fis3 inspect
//查看指定media的分配情况
fis3 inspect <media>
```

## 内置插件

在本地执行`npm install -g fis3`安装 fis3 命令行工具后，将会支持一下内置的插件，可直接使用命令行工具配置，操作使用。

- [fis-optimizer-clean-css](https://github.com/fex-team/fis-optimizer-clean-css) 压缩 css

```
fis
  .media('prod')
  .match('*.css', {
    optimizer: fis.plugin('clean-css')
  });
```

- [fis-optimizer-uglify-js](https://github.com/fex-team/fis-optimizer-uglify-js) 压缩 js(+混淆)

```
fis
  .media('prod')
  .match('*.js', {
    optimizer: fis.plugin('uglify-js', {
    })
  });

```

- [fis-optimizer-png-compressor](https://github.com/fex-team/fis-optimizer-png-compressor) 压缩 png 图片

```
fis
  .media('prod')
  .match('*.png', {
    optimizer: fis.plugin('png-compressor', {

      // pngcrush or pngquant
      // default is pngcrush
      type : 'pngquant'
    })
  });

```

- [fis-spriter-csssprites](https://github.com/fex-team/fis-spriter-csssprites) CssSprite 图片合并

```
// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
})

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

```

针对 css 规则中的 background-image 做图片优化，将多张零碎小图片合并，并自动修改 css 背景图片位置。

> 此插件并不会处理所有的 background-image 规则，而只会处理 url 中带 ?\_\_sprite 图片的规则。

## 一套配置

FIS3 做压缩、文件指纹、图片合并、资源定位，现在把这些功能组合起来，配置文件如下

```
// 加 md5
fis.match('*.{js,css,png}', {
  useHash: true
});

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});
```

可能有时候开发的时候不需要压缩、合并图片、也不需要 hash。那么给上面配置追加如下配置；

```
fis.media('debug').match('*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
})
```

> fis3 release debug 启用 media debug 的配置，覆盖上面的配置，把诸多功能关掉。

## 构建发布

在项目根目录执行下面命令构建发布，在项目根目录下的`fis-conf.js`文件内书写配置文件。

```
// 构建发布到当前项目父级目录的 dist 目录下
fis3 release -d ../dist

//构建发布到当前项目下的 output 目录下
fis3 release -d ./output

//发布到其他盘 （Windows）
fis3 release -d D:\output


```

> 在构建发布命令执行后，相对于`根目录`进行版本发布，这使用做`线上使用`的

## 调试

FIS3 构建后，默认情况下会对资源的 URL 进行修改，改成绝对路径。这时候本地双击打开文件是无法正常工作的。这给开发调试带来了绝大的困惑。

FIS3 内置一个简易 Web Server，可以方便调试构建结果。

#### 1. 本地发布

```
fis3 release
fis3 release -w  // 文件监听
fis3 release -wL //浏览器自动刷新
```

不加`-d` 参数默认被发布到内置 Web Server 的根目录下，当启动服务时访问此目录下的资源。

#### 2.启动

```
fis3 server start
```

启动本地 Web Server，当此 Server 启动后，会自动浏览器打开 http://127.0.0.1:8080，默认监听端口 8080

通过执行以下命令得到更多启动参数，可以设置不同的端口号（当 8080 占用时）

```
fis3 server -h
```

#### 3.预览

FIS3 内置的 Server 是常驻的，如果不重启计算机或者调用命令关闭是不会关闭的。

所以后续只需访问对应链接即可，而不需要每次 release 就启动一次 server。

> 程序停止用快捷键 `CTRL+c`,测试不管用

## 安装一些插件

- fis-parser-less：less 预处理插件
- fis3-postpackager-loader：可对页面散列文件进行合并

  > 给 loader 插件配置 allInOne 属性，即可对散列的引用链接进行合并，而不需要进行配置 packTo 指定合并包名。

- es6 的打包使用 babel
- 使用相对路径
  - https://github.com/fex-team/fis3/issues/990
  - https://github.com/fex-team/fis3-hook-relative
- fis3 实战
  - https://github.com/zhiqiang21/blog/issues/41
