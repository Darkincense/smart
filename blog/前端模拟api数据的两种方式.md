## [mockapi](https://www.mockapi.io)
- [官方说明文档](https://www.mockapi.io/docs)
- [chrome插件postman安装](https://github.com/xiaoyueyue165/Awesome-Stars/tree/master/%E8%B0%B7%E6%AD%8C%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6/Postman%205.4.0)

初始化创建数据
````js
[
  {
    "id": "1",
    "date": "2018-05-17",
    "title": "title 1",
    "amount": 88
  },
  {
    "id": "2",
    "date": "2018-05-18",
    "title": "title 2",
    "amount": 23
  },
  {
    "id": "3",
    "date": "2018-05-19",
    "title": "title 3",
    "amount": 3
  },
  {
    "id": "4",
    "date": "2018-05-20",
    "title": "title 4",
    "amount": 8
  },
  {
    "id": "5",
    "date": "2018-05-21",
    "title": "title 5",
    "amount": 88
  }
]
````




### 1.get方法获取数据
![image](https://xiaoyueyue165.github.io/static/blog/getMockapi.png)

````bash

https://5b02556920848e001432c915.mockapi.io/api/v1/:records
````

### 2.post方法添加数据

**准备添加**
![image](https://xiaoyueyue165.github.io/static/blog/postMockapi1.png)

**send**
![image](https://xiaoyueyue165.github.io/static/blog/reMockapiGetData.png)

### 3.真实的数据更新
![image](https://xiaoyueyue165.github.io/static/blog/mockapiUpdate.png)

### 4.注意事项
测试访问ip数据时保证在浏览器中已开启 `https://www.mockapi.io/projects`，就是下面的页面

![image](https://xiaoyueyue165.github.io/static/blog/mockapi.png)

## [json-server](https://github.com/typicode/json-server)

### 1.全局安装
````bash
$ npm install -g json-server
````
### 2.创建`db.json`文件
````json
{
  "records": [
    {
        "id": "1",
        "date": "2018-05-17",
        "title": "title 1",
        "amount": 88
    },
    {
        "id": "2",
        "date": "2018-05-18",
        "title": "title 2",
        "amount": 23
    },
    {
        "id": "3",
        "date": "2018-05-19",
        "title": "title 3",
        "amount": 3
    },
    {
        "id": "4",
        "date": "2018-05-20",
        "title": "title 4",
        "amount": 8
    },
    {
        "id": "5",
        "date": "2018-05-21",
        "title": "title 5",
        "amount": 88
    }
]
}
````
### 3.开启服务并在指定端口更新

在`db.json`目录打开

![image](https://xiaoyueyue165.github.io/static/blog/listen3006.png)
````bash
json-server --watch db.json --port 3006
````
### 4.get获取数据
![image](https://xiaoyueyue165.github.io/static/blog/getlocalhost.png)

### 5.post添加数据
**准备添加**
![image](https://xiaoyueyue165.github.io/static/blog/reLocalhostGetData.png)

**send**
![image](https://xiaoyueyue165.github.io/static/blog/showDataByLocalhost.png)

### 6.真实的数据更新
![image](https://xiaoyueyue165.github.io/static/blog/localhostUpdate.png)
## useful links
- http://www.mockapi.io/

- https://github.com/typicode/json-server

- https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch

- https://github.com/github/fetch

- https://github.com/matthew-andrews/isomorphic-fetch

- https://github.com/mdn/fetch-examples

##### 参考链接
- [react 基础实践篇-小型财务系统 #3 前端模拟 API 数据的两种方式](https://www.rails365.net/movies/react-ji-chu-shi-jian-pian-xiao-xing-cai-wu-xi-tong-3-qian-duan-mo-ni-api-shu-ju-de-liang-zhong-fang-shi)
