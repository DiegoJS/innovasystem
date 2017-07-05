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
        //PRECAUCIÓN
        // var id = users.indexOf(data.userId);
        //!PRECAUCIÓN
        // console.log('a user ' + socket.id + ' connected');
        //saving userId to array with socket ID
        users.push(data.userId);
        ident.push(socket.id);
        // users.push(data.userId);
        io.emit('login', users, data.userId);
    });

    socket.on('disconnect', function(){
        var id = ident.indexOf(socket.id);
        // console.log('user ' + ident[id] + ' disconnected');
        console.log(id + ' | user ' + users[id] + ' disconnected');

        if (id >= 0) {
            users.splice(id, 1);
            ident.splice(id, 1); 
        }
        
        // users.splice(users.indexOf(socket.id), 1);

        // delete users[socket.id];

        io.emit('disconnect', users);
    });

    socket.on('conectarVendedor', function(datos){
        io.emit('conectarVendedor',datos);
    });

    socket.on('conectarComprador', function(datos){
        io.emit('conectarComprador',datos);
    });
    
    socket.on('actualizarEstrellas', function(datos){
        io.emit('actualizarEstrellas',datos);
    });
    socket.on('marcar', function(datos){
        io.emit('marcar',datos);
    });
    socket.on('iniciarPartida', function(datos){
        io.emit('iniciarPartida',datos);
    });
    socket.on('listaTurnos', function(datos){
        io.emit('listaTurnos',datos);
    });
    socket.on("enviaReto",function(datos){
        io.emit("enviaReto",datos);
    });
    socket.on("aceptaReto",function(datos){
        io.emit("aceptaReto",datos);
    });
    socket.on("terminaJuego",function(datos){
        io.emit("terminaJuego",datos);
    });
    socket.on("categoriaItems",function(datos){
        io.emit("categoriaItems",datos);
    });
    socket.on("abandonarPartida",function(datos){
        io.emit("abandonarPartida",datos);
    });
    socket.on("actualizaEstadisticas",function(datos){
        io.emit("actualizaEstadisticas",datos);
    });
    socket.on("turnoPorFinDeTiempo",function(datos){
        io.emit("turnoPorFinDeTiempo",datos);
    });
    socket.on("usuarioDisponible",function(datos){
        io.emit("usuarioDisponible",datos);
    });
});

http.listen(PORT,function(){
    console.log('el servidor esta escuchando el puerto %s',PORT);
});
