var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;

var users = []
    ident = [];

app.get('/',function(req,res){
    //request : son cabeceras y datos que nos envia el navegador.
    //response : son todo lo que enviamos desde el servidor.
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    socket.on('login', function(data) {
        console.log('a user ' + data.userId + ' connected');
        users.push(data.userId);
        ident.push(socket.id);
        io.emit('login', users, data.userId);
    });

    socket.on('disconnect', function(){
        var id = ident.indexOf(socket.id);
        console.log(id + ' | user ' + users[id] + ' disconnected');
        if (id >= 0) {
            users.splice(id, 1);
            ident.splice(id, 1); 
        }
        io.emit('disconnect', users);
    });

    socket.on('notificacion', function(datos){
        io.emit('notificar',datos);
    });

    socket.on('respuestaNotificacion', function(datos){
        io.emit('respuesta',datos);
    });

    socket.on('alertaUsuario', function(datos){
        io.emit('notificarUsuario',datos);
    });

});

http.listen(PORT,function(){
    console.log('el servidor esta escuchando el puerto %s',PORT);
});
