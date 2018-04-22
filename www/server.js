const express = require('express')
const path = require("path")
const fs = require("fs")
const static = require("express-static")
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const cookieSession = require("cookie-session")
// const jade = require("jade")
// const ejs = require("ejs")
const multer = require("multer")
const app = express()
app.listen(8090)

// 1.0 解析cookie
app.use(cookieParser('qiuzhilin'))

// 2.0 使用session
var keys = []
for(var i=0;i<100000;i++){
    keys.push('keys_' + Math.random())
}
app.use(cookieSession({
    name: 'sess',
    keys,
    maxAge: 20*3600*1000
}))
// 3.0 post数据
app.use(bodyParser.urlencoded({extended: false}))

// 用户请求
app.use(multer({
    dest: './www/upload'
}).any())
app.post('/',function (req, res, next) {
    const newName = req.files[0]['path'] +  path.extname(req.files[0]['originalname'])
    fs.rename(req.files[0]['path'],newName,(err)=>{
        if(err){
            res.send("上传失败")
        }else{
            res.send("成功")
        }
    })
});
// 4.0 static数据
app.use(static('./www'))