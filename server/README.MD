## Login_Server

## 技术栈
* 开发环境：Node.js
* 服务器框架: Koa2
* JWT(JSON Web Token)：[jwt-simple](https://github.com/hokaccha/node-jwt-simple)

## 功能介绍
* 实现登陆token认证
* token过期自动更新
* 错误信息处理

## 使用
```
npm install
npm run start
```

## API
### toekn认证

 | 接口名 | method | 参数1 | 参数2 | 
| ------| ------ | ------ | ------ | 
| /auth |  post  | token_s|token_l | 

### 用户登陆

 | 接口名 | method | 参数1 | 参数2 | 
| ------| ------ | ------ | ------ | 
| /login |  post |username|password| 





> 未加入数据库功能，仅通过文件读取的方式获取用户数据.

