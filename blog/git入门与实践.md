# git入门与实践
###### 推荐
- [Git --everything-is-loca 官方文档](https://git-scm.com/book/zh/v2)
- [Git教程-廖雪峰](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

git客户端有图形化（小乌龟 ），有命令行（git bash）等...

## 基本配置

### 配置用户名和邮箱:

````bash

    git config --global user.name "自己的名字" //用户名
    git config --global user.email "自己的邮箱" // 邮箱
````
> 补充，其实是保存了用户名和邮箱到 C:\Users\[用户名]\.gitconfig 文件中

### 公用的电脑来备份(github)(远端仓库)

 github 本身是个网站,但是这个网站所在的电脑可以做为公用的电脑来备份代码!  

1. 注册 github 账号，并登陆
2. 先使用 git bash 窗口，输入
````bash

     ssh-keygen -t rsa || ssh-keygen
````
> 这个命令就会生成一个标识,我们需要把这个标识上传到服务器会在 【/c/Users/[用户名]/.ssh】目录中生成两个文件:【id_rsa, id_rsa.pub】, 我们用编辑器打开 id_rsa.pub,复制内容并关闭

3.在 github 网站上,把复制的密钥,添加到 github 上去! 
4.测试 `$ ssh -T git@github.com`

> 如果能看到类似于**Hi XXXX! You've successfully authenticated, but GitHub does not provide shell access.**这样的提示，则表示 ssh key 配置成功！

## 工作流

1. 在项目根目录下创建`.git`文件，暂存区和仓库的代码都在此文件夹下
````bash

     git init
````
2. 添加文件到暂存区

````bash

     git add A4.txt //添加单一文件
     git add -A    //把自上一次git commit后，修改过的文件全部添加到暂存区
````
3. 放到仓库

````bash

      git commit -m "注释" // 是把暂存区的代码，放到仓库
````
4. git 上传代码到远端分支

````bash

     git push git@github.com:xiaoyueyue165/fed02.git master

````

##### 简化命令

````bash

     git remote add origin git@github.com:xiaoyueyue165/fed02.git
     git push origin master  
````
>  // 这个 origin 随便起, 就相当于设置` var origin =       "git@github.com:xiaoyueyue165/fed02.git"`

5.  忽略清单文件(.gitignore)

在项目根目录，新建一个名为 .gitignore 的文件 。假如，我们希望 test 文件中的内容不被备份, 就在.gitignore 文件中添加一行

```bash
# 忽略项目根目录的test文件夹中的内容
/test
# 忽略项目中所有名为test的文件夹，或者文件
test
# 忽略项目中的名为app.js的文件
app.js
# 忽略项目中的所有js
*.js
/test/*.*
```

## 常用命令:

* `git status` // 查看有哪些修改后的文件在暂存区，哪些不在
* `git log`      //只能看到 head 指向之前的提交记录
* `git reflog` // 查看所有的操作记录

## 版本回退

默认 head 指向 master,就会把 master 中的提交的代码拿到工作区

* `git reset --hard 提交的id`
* `git reset --hard 53bd6a3cd5b9ff5782af4837985c1e3023412d23`

*注意，如果是回退到最近的一次提交的状态，不需要添加 commit_id*
_git reset --hard head

## 使用分支

 默认只有一个 master 分支（主分支），可以创建一个新的分支

* `git branch dev` // 创建dev分支
* `git checkout dev` // 切换到 dev分支!
*  `git checkout -b dev` 创建dev分支并切换到dev分支中,相当于以上两条命令
* `git branch -d dev` // 删除dev的分支
* `git branch` // 查看有多少个分支
* `git merge dev` // 合并分支，// 把 dev分支合并到当前分支 


## 流程(针对于一个项目 project)

> 代码还是像以前一样去写

1. git init (一个项目一次)
2. git add -A / git commit -m (当我们觉得有必要去备份时执行!)
3. 继续写代码,如果完成了一个功能，就 git add -A / git commit -m
4. `git status`|| `git log` || `git push origin`
5. 实际开发永远先`git pull`再`git push`

> 使用分支的情况当我想要备份代码,代码的功能才写了一部分,如果如果此时备份到 master，由于 master 分支会共享给别人,
> 别人得到的代码就只有一部分，运行不了!  

【创建分支，然后在分支中提交代码!，直到这个功能完成了，就可以回到 master 分支，然后合并】

````bash

    git branch dev
    git checkout dev
    git add -A, git commit -m //一样是这两个命令功能完成之后回到 master 分支
    git checkout master
    git merge dev
    # 删除本地 dev分支和远程的dev分支
    git branch -d dev
    git push origin --delete dev
````

## git常用命令速查表

![image](https://xiaoyueyue165.github.io/static/blog/Git-common-commands.jpg)
