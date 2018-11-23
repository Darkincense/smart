- master : 默认开发分支
- origin : 默认远程版本库
- Head^ : head 的父提交
- Head： 默认开发分支
## 创建版本库

```bash
# 克隆远程版本库
git clone <url> 

# 初始化本地版本库
git init

# 创建本地仓库
git init [project name]
```

## 修改和提交
```bash
# 查看状态
git status

# 查看变更内容
git diff 

# 跟踪所有改动过的文件
git add .

# 跟踪指定的文件
git add <file>

# 文件改名
git mv <old> <new>

# 删除文件
git rm <fild>

# 停止跟踪文件但不删除
git rm --cached <file>

# 提交所有更新过的文件
git commit -m "commit message"

# 修改最后一次提交
git commit --amend
````

## 查看提交历史

```bash
# 查看提交历史
git log

# 查看指定文件或文件夹的提交历史,终端查看 Q
git log -p <file/directory> 

# 以列表形式查看指定文件的提交历史
git blame <file>
```

## 撤销
```bash
# 撤销工作目录中所有未提交文件的修改内容
git reset --hard HEAD

# 撤销指定的未提交文件的修改内容
git checkout HEAD <file>

# 撤销指定的提交
git revert <commit>
```

## 分支与标签
```bash
# 显示所有本地分支
git branch

# 显示所有本地及远程分支
git branch -a

# 切换到指定分支或标签
git checkout <branch/tag>

# 创建新分支
git branch <new branch>

# 列出所有本地标签
git tag

# 基于最新提交创建标签
git tag <tagname>

# 删除标签
git tag -d <tagname>
```

## 合并与衍合
```bash
# 合并指定分支到当前分支
git merge <branch>

# 衍合指定分支到当前分支
git rebase <brach>
```

## 远程操作
```bash
# 查看远程版本库信息
git remote -v

# 查看指定远程版本库信息
git remote show <remote>

# 添加远程版本库版本
git remote add <remote> <url>

# 从远程库获取代码
git fetch <remote>

# 下载代码及快速合并
git pull <remote> <branch>

# 上传代码及快速合并
git push <remote> <branch>

# 删除远程分支或标签
git push <remote> :<branch/tagname>

# 上传所有标签
git push --tags 

```

## 最后
```bash
git --help
````

