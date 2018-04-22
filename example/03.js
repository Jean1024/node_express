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
    if(req.url !== '/favicon.ico'){
        if(req.session['count']){
            req.session['count'] ++
        }else{
            req.session['count'] = 1
        }
        res.send(req.session['count'] + '')
    }
    
})

server.listen(8080)