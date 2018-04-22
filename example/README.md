### 1. cookie与session比较
-----
cookie: 在浏览器保存一些数据，每次请求都会带过来

* 不安全
* 体积小 4k

session: 保存数据，存在服务器，安全性较高，大小理论无限制

* 基于cookie实现
* cookie中会有一个session的ID,服务器利用sessionid找到session文件
* 隐患: session劫持

### 2. cookie深入
-----
2.1 最简单的使用

```javascript
// 01.js
const express = require('express')

const server = express()
 
// cookie
// 1.0 父级路由可访问子级路由cookie,同级不可访问

server.use('/aaa/a.html',(req,res) => {
    res.cookie('user','my girl',{
        path: '/aaa',           // cookie所在路径，
        maxAge: 30*24*3600*1000 // 过期时间 此处为1个月 
    })
    res.send({status: 200})
})

server.listen(8080)
```
![image.png](https://upload-images.jianshu.io/upload_images/5809200-c9b4ebb870c2b7ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2.2 添加签名，防止篡改

```javascript
const express = require('express')
const cookieParser = require('cookie-parser')

const server = express()

server.use(cookieParser('sdfjdskljl'))
// sdfjdskljl ==> 签名  s%3Amy%20girl.LbvUIf2FvpcTaPU5w9qgUIJhNA1d9oVXI%2FXPbkAgINo
server.use('/aaa/a.html',(req,res) => {
    res.cookie('user','my girl',{
        signed: true,
        path: '/aaa',           // cookie所在路径，
        maxAge: 30*24*3600*1000 // 过期时间 此处为1个月 
    })
    // 使用cookieParser之后才能解析签名后的cookie
    console.log(req.signedCookies['user']) // my girl
    console.log(req.cookies['user']) // undefined
    res.send({status: 200})
})

server.listen(8080)
```
2.3 cookie加密

```javascript
const express = require('express')
const cookieParser = require('cookie-parser')
const cookieEncrypter = require('cookie-encrypter');
const server = express()
const secretKey = 'foobarbaz12345';
server.use(cookieParser(secretKey));
server.use(cookieEncrypter(secretKey))
// sdfjdskljl ==> 签名  s%3Amy%20girl.LbvUIf2FvpcTaPU5w9qgUIJhNA1d9oVXI%2FXPbkAgINo
server.use('/setcookies',(req,res) => {
    const cookieParams = {
        httpOnly: true,
        signed: true,
        maxAge: 300000,
      };
    // Set encrypted cookies 
    res.cookie('supercookie', 'my text is encrypted', cookieParams);//s%3Ae%3A2bb8b0c37fe05428b96f75003f1ef72f8232a056849b9f65d4183e05391239aa.loLedmM%2F4wFsTqQPBOdM3%2B01biw4%2BtfCTfRPu9G9E%2FE
    res.cookie('supercookie2', { myData: 'is encrypted' }, cookieParams); //s%3Ae%3Af7ce4ab473d1931c942e32804a02595f8f6939ef08ae10ae38279345efa185f2.EMBzHnZVEqT%2BNCBW8QKYLSYjv0XsJBV0nMsu2EEaTg0

    // You can still set plain cookies 
    res.cookie('plaincookie', 'my text is plain', { plain: true });//my%20text%20is%20plain
    res.cookie('plaincookie2', { myData: 'is plain' }, { plain: true });//j%3A%7B%22myData%22%3A%22is%20plain%22%7D

    res.end('new cookies set');
})
server.get('/getcookies', function(req, res) {
    console.log('Decrypted cookies: ', req.signedCookies)
    console.log('Plain cookies: ', req.cookies)
  });
server.listen(8080)
```
2.4 总结
* 发送cookie 
`res.cookie(名字,值,{path: '',maxAge: 毫秒 ,signed: true})`
* 读取cookie 
`server.use(cookieParser('sdfjdskljl'));`
`签名版：req.signedCookies['user']`
`未签名版：req.cookies['user']`
* 删除cookie
`res.clearCookie(名字)`

### 3. session使用
----
```javascript
const express = require('express')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const server = express()
 
// cookie
var arr = []
for(var i = 0;i<10000;i++){
    arr.push('qiu' + Math.random())
}
server.use(cookieParser())
server.use(cookieSession({
    name: 'sess',
    keys: arr,
    maxAge: 24*3600*1000
}))
server.use('/',(req,res) => {
    console.log(req.session)
    if(req.session['count']){
        req.session['count'] ++
    }else{
        req.session['count'] = 1
    }
    res.send(req.session['count'] + '')
})

server.listen(8080)
```
