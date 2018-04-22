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