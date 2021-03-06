## 安装

- [pandoc 官方文档](https://pandoc.org/getting-started.html)
- [pandoc’s download page](https://github.com/jgm/pandoc/releases/tag/2.1.3)
- [最佳方案 - typora](https://www.typora.io/)

## 命令

### markdown 转换为 html

```bash
// 只有关键标签
pandoc -f markdown -t html -o abc1.html abc.md
// 完整文档
pandoc -f markdown -t html -o abc2.html -s abc.md
```

##### 参考

- http://www.bagualu.net/wordpress/archives/5330

### markdown 转换为 word/pdf

```bash
pandoc -s m.md -o m.docx

```

##### 参考

- https://segmentfault.com/a/1190000004887280

### word(.docx)转化为 md

```
pandoc -s example30.docx -t markdown -o example35.md
```

### word 与 pdf 相互转换

> 直接使用 office word 软件将 word 另存为 pdf 格式，也可将 pdf 文档另存为 word 版

### Userful links

- https://lightpdf.com/zh/
- https://blog.csdn.net/liuguangrong/article/details/52858595?locationNum=2&fps=1#markdown%E6%96%87%E6%A1%A3%E8%BD%AC%E6%8D%A2
