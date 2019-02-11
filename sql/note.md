## 查询数据
### 1. 基本查询
- 查询 students 表的所有内容
````bash
select * from students
````
### 2. 条件查询
- 查询学生成绩在80分往上的学生信息
````bash
select * from students where score >= 80
````
- 与 and
````bash
select * from students where score >= 80 and gender = 'M'
````
- 或 or
````bash
select * from students where score >= 80 or gender = 'M'
````
- 非 not
````bash
select * from students where not class_id = 2
````
- in 
````bash
select * from students where class_id in [1,3]
````
- 多个条件查询，括号改变优先级
````bash
select * from students where (score < 80 or score > 90) and gender = 'M'
````
### 3.投影查询
- 投影查询，并将列名重命名
````bash
select id, score points, name from students where gender = 'M'
````
### 4.排序
- 按 `score`从低到高升序排列
````bash
select id, name, gender, score from students order by score
````
- 按 `score`从高到低降序排列
````bash
select id, name, gender, score from students order by score desc
````
- 相同数据进一步排列，先按 `score` 倒序排列,再按 `gender`列排列
````bash
select id, name, gender, score from students order by score desc, gender
````
- 带where语句order by放到最后面
````bash
select id, name, gender, score from students where class_id = 1 order by score
````
### 4.分页查询
- 按 score 从高到低排列
````bash
select id, name, gender, score from students order by score desc
````
- 把结果页分页，每页3条记录，要获得第1页的记录,`LIMIT <M> OFFSET <N>`，索引从0 开始
````bash
select id, name, gender, score from students order by score desc limit 3 offset 0;
````
- 查询第二页,跳过前3条记录，数据从3号开始采集，offset设为 `3`
````bash
select id, name, gender, score from students order by score desc limit 3 offset 3;
````
- 查询第3页，offset设为6
````bash
select id, name, gender, score from students order by score desc limit 3 offset 6
````
### 5.聚合查询
- 查询 students 表有多少条记录
````bash
select count(*) from students
````
- count(*)表示查询表所有列的行数，要注意聚合的计算结果虽然是一个数字，但查询的结果仍然是一个二维表，只是这个二维表只有一行一列，并且列名是COUNT(*)。通常，使用聚合查询时，我们应该给列名设置一个别名，便于处理结果：
````bash
select count(*) num from students
````
- count(*)count(id)实际上是一样的效果。另外注意，聚合查询同样可以使用WHERE条件，因此我们可以方便地统计出有多少男生、多少女生、多少80分以上的学生等
````bash
select count(*) boys from students where gender = 'M'
````
- 除 count 以外的聚合函数
函数	说明
SUM	计算某一列的合计值，该列必须为数值类型
AVG	计算某一列的平均值，该列必须为数值类型
MAX	计算某一列的最大值
MIN	计算某一列的最小值

注意，MAX()和MIN()函数并不限于数值类型。如果是字符类型，MAX()和MIN()会返回排序最后和排序最前的字符。

要统计男生的平均成绩，我们用下面的聚合查询：

````bash
select avg(score) average from students where gender = 'M'
````
- 特别注意：如果聚合查询的WHERE条件没有匹配到任何行，COUNT()会返回0，而MAX()、MIN()、MAX()和MIN()会返回NULL：
````bash
select avg(score) average from students where gender = 'X'
````
#### 分组
如果我们要统计一班的学生数量，我们知道，可以用SELECT COUNT(*) num FROM students WHERE class_id = 1;。如果要继续统计二班、三班的学生数量，难道必须不断修改WHERE条件来执行SELECT语句吗？

对于聚合查询，SQL还提供了“分组聚合”的功能。我们观察下面的聚合查询：
- 按 class_id 分组
````bash
select count(*) num from students group by class_id
````
- 执行这个查询，COUNT()的结果不再是一个，而是3个，这是因为，GROUP BY子句指定了按class_id分组，因此，执行该SELECT语句时，会把class_id相同的列先分组，再分别计算，因此，得到了3行结果。但是这3行结果分别是哪三个班级的，不好看出来，所以我们可以把class_id列也放入结果集中：
````bash
select class_id, count(*) num from students group by class_id
````
- 再试试把name放入结果集
````bash
select name,class_id, count(*) num from students group by class_id
````
> 不出意外，执行这条查询我们会得到一个语法错误，因为在任意一个分组中，只有class_id都相同，name是不同的，SQL引擎不能把多个name的值放入一行记录中。因此，聚合查询的列中，只能放入分组的列
- 多个列进行分组。例如，我们想统计各班的男生和女生人数 按class_id, gender分组:
````bash
select class_id, gender, count(*) num from students group by class_id,gender
````

## 参考
- [廖雪峰 SQL教程](https://www.liaoxuefeng.com/wiki/001508284671805d39d23243d884b8b99f440bfae87b0f4000)