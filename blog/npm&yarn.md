## node
### node版本升级
> mac使用`n`模块来安装，windows在原先安装node的目录再进行安装
````
npm install -g n --force

n stable //升级到最新稳定版本
n lastest // 升级到最新版本
n 8.9.3 //升级到指定版本：

````

## npm
本身为用来下载node的包的
只是用它来下载一些包
也可以用来下载前端的包

### 1.npm版本升级
```bash
npm i -g npm to update
```

### 2.基本使用

1. 打开cmd,切换到项目所在文件夹

2. 在cmd中输入命令: `npm init` ,会生成一个名为package.json的配置文件（省略设置配置信息 `npm init -y`）
> 这里会要求输入name，这个name直接使用小写英文就可以,不要用中文，大写，或者特殊符号!

**name值不要和我们要下载的包名一样**

3. 使用`npm install 包名` 来下载我们想要在在项目中使用的包
*注意这个包会下载到，当前cmd所在路径*
*是在cmd所在路径的node_modules/包名 中*

4. 指定版本号下载

```
npm install webpack@3.10.0 -g
```
5. 开发依赖及运行依赖

配置项 | 说明
---|---
devDependencies | 开发依赖，上线不需要
dependencies | 项目运行的依赖，上线依旧要使用
`--save` / `-S` | 配置信息写入**dependencies**
`--save–dev` / `-D` | 配置信息写入**devDependencies**
`npm i jquery -S` | 下载jquery并保存到package.json的开发依赖中
6. 移除模块

**删除全局模块**
```bash
npm uninstall -g <package>
```
**删除本地模块**
```bash

npm uninstall 模块
 
npm uninstall 模块：删除模块，但不删除模块留在package.json中的对应信息
npm uninstall 模块 --save 删除模块，同时删除模块留在package.json中dependencies下的对应信息
npm uninstall 模块 --save-dev 删除模块，同时删除模块留在package.json中devDependencies下的对应信息
 
```


### 3.npm 常用命令

命令说明 | header 2
---|---
npm init -y | 省略项目初始化需要填写的信息
npm config list  | 查看自己npm的配置信息
script **执行命令** | npm run 去执行这个命令。
npm list -g --depth 0 | 查看已全局安装的依赖
npm prefix -g | 查看全局node模块的安装路径

### 4. 切换淘宝源
````
npm config set registry https://registry.npm.taobao.org --global 
npm config set disturl https://npm.taobao.org/dist --global

````
### 5.版本
[官方计算版本范围](https://semver.npmjs.com/)

range  | 含义 |	例
---|---|---
^2.2.1  |	指定的 MAJOR 版本号下, 所有更新的版本 |  匹配 2.2.3, 2.3.0; 不匹配 1.0.3, 3.0.1
~2.2.1  |	指定 MAJOR.MINOR 版本号下，所有更新的版本  |  匹配 2.2.3, 2.2.9 ; 不匹配 2.3.0, 2.4.5
`>=2.1`  |	版本号大于或等于 2.1.0	|  匹配 2.1.2, 3.1
<=2.2  |	版本号小于或等于 2.2	|  匹配 1.0.0, 2.2.1, 2.2.11
1.0.0 - 2.0.0  |	版本号从 1.0.0 (含) 到 2.0.0 (含) |  匹配 1.0.0, 1.3.4, 2.0.0


任意两条规则，通过 || 连接起来，则表示两条规则的并集:

如 ^2 >=2.3.1 || ^3 >3.2 可以匹配:

````
* `2.3.1`, `2,8.1`, `3.3.1`
* 但不匹配 `1.0.0`, `2.2.0`, `3.1.0`, `4.0.0`
PS: 除了这几种，还有如下更直观的表示版本号范围的写法:
````

- `*` 或 x 匹配所有主版本
- 1 或 1.x 匹配 主版本号为 1 的所有版本
- 1.2 或 1.2.x 匹配 版本号为 1.2 开头的所有版本

PPS: 在常规仅包含数字的版本号之外，semver 还允许在 MAJOR.MINOR.PATCH 后追加 - 后跟点号分隔的标签，作为预发布版本标签 - Prerelese Tags，通常被视为不稳定、不建议生产使用的版本。例如：

- 1.0.0-alpha
- 1.0.0-beta.1
- 1.0.0-rc.3

上表中我们最常见的是 ^1.8.11 这种格式的 range, 因为我们在使用 npm install <package name> 安装包时，npm 默认安装当前最新版本，例如 1.8.11, 然后在所安装的版本号前加^号, 将 ^1.8.11 写入 package.json 依赖配置，意味着可以匹配 1.8.11 以上，2.0.0 以下的所有版本。

### 6.使用代理

1. 给命令行统一设置代理 windows

````
$ set http_proxy=http://proxy.mysite.com:8080

// 如果有要求用户名密码则输入:
$ set http_proxy_user=< username >
$ set http_proxy_pass=< password >
````

2. npm代理配置
````
npm config set proxy=http://proxy3.bj.petrochina:8080
npm config delete proxy // 取消
````
##### 参考
- [设置 git/npm/bower/gem 镜像或代理的方法](https://segmentfault.com/a/1190000002435496)
### 7.依赖版本升级
1. package.json中会记录各个依赖的版本，如果想要更新依赖，可以使用npm update，但是这样更新后，新版依赖的版本号在package.json中并不会作出相应的更新。使用下面的更新保存到配置文件中
````
npm update -S
npm update -D
````
2. 其他方式

[npm模块升级工具npm-check，提供命令行下的图形界面，可以手动选择升级哪些模块](https://cnodejs.org/topic/5705cd70c5f5b4a959e9192a)
## yarn

1. 下载地址
- https://yarn.bootcss.com/

2. 配置淘宝镜像

```
yarn config set registry https://registry.npm.taobao.org -g
```
3. 中文介绍说明

- [yarn cli 介绍](https://yarnpkg.com/zh-Hans/docs/cli)
4. 使用yarn

- 开始一个新工程
````bash
yarn init
````
- 添加一个依赖

````bash
# dependencies
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]

# devDependencies
yarn add redux-devtools-extension --dev
````
- 全局安装
```bash
yarn global add webapck@3.10.0
```
全局安装后仍然无法使用命令的话，需要添加`环境变量`配置
```bash
# 获取bin目录，复制粘贴到系统变量里面
yarn global bin
```
更新一个依赖
````bash
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
````
- 移除一个依赖
````bash
yarn remove [package]
````
- 查看yarn全局安装路径
````bash
yarn global bin
````
- 从全局移除一个依赖
````bash
yarn global remove @tarojs/cli
````
- 查看全局安装的列表
````bash
yarn global list
````












