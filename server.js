require('dotenv').config();
const http = require('http');
const express = require('express');
const websocket = require('ws');
const app = express()
const server = http.createServer(app);
const wss = new websocket.Server({server})
const route = require('./routes/route')
const path = require('path');
const body = require('body-parser');
const urlencoded = body.urlencoded({extended:false})

app.set('view engine', 'ejs');

app.use('/',new route({express:express,path:path,websocket:wss,urlencoded:urlencoded}).router);
app.use(express.static(path.join(__dirname,'./static/botGame')))
app.use(express.static(path.join(__dirname,'./static/signUp')))
app.use(express.static(path.join(__dirname,'./static/login')))
app.use(express.static(path.join(__dirname,'./static/home')))
app.use(express.static(path.join(__dirname,'./static/multiGame')))
app.use(express.static(path.join(__dirname,'./static/invite')))
app.use(express.static(path.join(__dirname,'./static/gameRoom')))
app.use(express.static(path.join(__dirname,'./static/tournament')))
app.use(express.static(path.join(__dirname,'./static')))
app.use(express.static(path.join(__dirname)))

server.listen(process.env.PORT, () =>{
    console.log(`server listening at port ${process.env.PORT}`)
})

//ADD THE body-parser TO PACKAGE.JSON