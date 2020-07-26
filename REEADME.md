# TodoList安装说明

### 1.clone或者下载所有文件到本地

​	先安装Node

### 2.服务端部署

#### 	(1).安装依赖

​		命令行工具cd至server目录下，运行以下命令

```
npm install
```

#### 	(2).数据库

​		找到server/db/config/config.json文件，修改数据库配置

```
{
  "development": {
    "username": "root",//用户名
    "password": null,//密码
    "database": "todo_development",//数据库名
    "host": "127.0.0.1",//主机
    "dialect": "mysql",//数据库类型
    "timezone": "+08:00"
  }
}
```

#### 	(3).创建数据库表

​		命令行工具打开server/db目录，确保数据库能连接，运行以下命令

```
npx sequelize-cli db:migrate
```

 		运行之后查看数据库表是否创建成功

#### 	(4).运行服务端

​		命令行工具打开server目录，运行以下命令

```
npm start
```

​		显示“启动成功”即可





### 3.部署应用端

#### 	(1).安装依赖

​		命令行工具打开app目录，运行以下命令

```
npm install
```

#### 	(2).API配置

​		服务端的url和port可以在app/src/config/config.js文件中配置，默认情况下不需要修改

#### 	(3).运行

​		命令行工具在app目录运行以下命令

```
npm start
```

​		运行成功后浏览器访问http://localhost:3000