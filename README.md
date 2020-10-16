# 电商后台管理系统

## 项目介绍

### 功能介绍

1. 登录页:不同用户登录后台系统根据给的角色会拥有不同的权限
2. 用户列表页:用户可以进行添加、修改、删除、搜索
3. 角色列表页:角色可以进行添加、修改、删除，并且可以给不同的角色添加不同的权限
4. 权限列表页:可以查看全部的权限及权限层级
5. 商品列表页:商品可以进行添加、修改、删除、搜索
6. 分类参数页:三级分类参数可以进行对静态和动态参数的添加、修改、删除
7. 商品分类页:分类数据可以进行树形展开查看每一级的参数，并且每一级的参数都可以进行添加、修改、删除
8. 订单列表页:可以查看全部订单，并且可以对订单进行修改
9. 数据报表页:可以查看用户来源的数据形成的图表，并且可以下载图表

## 项目搭建

| 目录           | 作用                           |
| -------------- | ------------------------------ |
| build          | 项目打包的配置文件             |
| config         | 不同环境下的配置文件           |
| gitosis        | git 文件                       |
| src            | 存放项目开发的文件             |
| static         | 静态资源文件                   |
| 后端文件       | 存放前端页面运行需要的后端文件 |
| 项目效果展示图 | 整个项目运行的界面效果都在里面 |

## 搭建项目的页面

| 页面名称   | 名称        |
| ---------- | ----------- |
| 登录页     | login       |
| 首页       | home        |
| 用户列表⻚ | user        |
| 角色列表⻚ | role        |
| 权限列表⻚ | right       |
| 商品列表⻚ | goods       |
| 添加商品⻚ | goodsAdd    |
| 分类参数⻚ | goodsParams |
| 商品分类⻚ | goodsCate   |
| 订单列表⻚ | order       |
| 数据报表⻚ | reports     |

## 项目运行说明

1. 想要运行前端的项目，必须先将后端文件中的 db 文件下的 mydb.sql 数据库文件导入到自己本地的 MySQL 数据库中,导入成功后，配置好相关的数据库接口，配置完成后，在后端文件下打开终端，执行命令 node app.js 或直接打开后端文件中的 start.bat 文件，文件运行成功后，才能运行实现前端页面的完整效果。

> A Vue.js project

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
