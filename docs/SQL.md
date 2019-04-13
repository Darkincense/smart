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
### 6.多表查询
- 同时从 students 和 classes 表查询数据
````bash
select * from students, classes
````
- 上述查询结果有两列`id`和`name`,两列 `id`,一列是 students，一列是 classes 的数据，不好区分；利用投影查询设置列的别名来给两个表的列起别名
````bash
select students.id sid, students.name, students.gender, students.score,classes.id cid,classes.name cname from students, classes
````
- 多表查询给表设置别名，使得引用简洁些...
````bash
select s.id sid, s.name, s.gender, s.score, c.id cid, c.name cname from students s, classes c;
````
- 多表查询加where条件
````bash
select s.id sid, s.name, s.gender, s.score, c.id cid, c.name cname from students s, classes c where s.gender = 'M' and c.id = 1
````

### 7.连接查询
-  选出所有的学生信息
````bash
select s.id, s.name,s.class_id, s.gender, s.score from students s
````
- 内连接 `inner join`，加入 classes 表的 班级名称数据,选出所有的学生，同时返回班级名称
````bash
select s.id, s.name, s.class_id, s.gender, s.score from students s inner join classes c on s.class_id = c.id;
````
> 注意 inner join 的写法
> 1. 先确定主表，仍然使用FROM <表1>的语法
> 2. 再确定需要连接的表，使用INNER JOIN <表2>的语法；
> 3. 然后确定连接条件，使用ON <条件...>，这里的条件是s.class_id = c.id，表示students表的class_id列与classes表的id列相同的行需要连接；
> 4. 可选：加上WHERE子句、ORDER BY等子句。

> 使用别名不是必须的，但可以更好地简化查询语句 
- 内连接查询改成外连接查询，看看效果 `OUTER JOIN`：
````bash
select s.id, s.name, s.class_id, s.gender, s.score from students s right outer join classes c on s.class_id = c.id;
````
> 执行上述RIGHT OUTER JOIN可以看到，和INNER JOIN相比，RIGHT OUTER JOIN多了一行，多出来的一行是“四班”，但是，学生相关的列如name、gender、score都为NULL。
> 这也容易理解，因为根据ON条件s.class_id = c.id，classes表的id=4的行正是“四班”，但是，students表中并不存在class_id=4的行。

#### 有RIGHT OUTER JOIN，就有LEFT OUTER JOIN，以及FULL OUTER JOIN。它们的区别是：

- INNER JOIN只返回同时存在于两张表的行数据，由于students表的class_id包含1，2，3，classes表的id包含1，2，3，4，所以，INNER JOIN根据条件s.class_id = c.id返回的结果集仅包含1，2，3。

- RIGHT OUTER JOIN返回右表都存在的行。如果某一行仅在右表存在，那么结果集就会以NULL填充剩下的字段。

- LEFT OUTER JOIN则返回左表都存在的行。如果我们给students表增加一列，并添加class_id=5，由于classes表并不存在id=5的列，所以，LEFT OUTER JOIN的结果会增加一列，对应的class_name是NULL：
先在 students 增加  一列 `insert into  students(class_id,name,gender,score) values (5,'新生','M',88)`
- 使用 `left outer join`
````bash
select s.id, s.name, s.class_id, s.gender,s.score from students s left outer join class c on s.class_id = c.id
````
- 使用 `full outer join`, 会把两张表的所有记录全部选择出来，并且自动把对方不存在的列填充为 null
````bash
select s.id, s.name, s.class_id, s.gender, s.score from students s full outer join class c on s.class_id = c.id
```` 

> 小结
> JOIN查询需要先确定主表，然后把另一个表的数据“附加”到结果集上；

> INNER JOIN是最常用的一种JOIN查询，它的语法是SELECT ... FROM <表1> INNER JOIN <表2> ON <条件...>；

> JOIN查询仍然可以使用WHERE条件和ORDER BY排序
## 参考
- [廖雪峰 SQL教程](https://www.liaoxuefeng.com/wiki/001508284671805d39d23243d884b8b99f440bfae87b0f4000)