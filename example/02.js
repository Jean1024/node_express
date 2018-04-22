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