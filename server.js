const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const server = http;

//busca o front no diretorio 'public'
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../public'));

//converte html to ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', (req,res)=>{
    res.render('index.html');
});

let messages = [];

//conexão com o socket (isso que dá a magia do Real Time)
io.on('connection', socket=>{
    //tratativa usuários
    socket.on('username', function(username){
        io.emit('Está online', '# <i>' + socket.username + 'entrando no chat...</i>');
    });
    
    //tratativa saída de usuário
    socket.on('disconnect', function(username){
        io.emit('Não está online', '# <i>' + socket.username + 'saindo...</i>');
    });
    
    //tratativa mensagens
    socket.on('chatMessage', msg=>{
        messages.push(msg);
        socket.broadcast.emit('receivedMessage', msg);
    });
    
});



server.listen(3000);