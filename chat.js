var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;

var users = []
    ident = [];

app.get('/',function(req,res)
{
    // request : son cabeceras y datos que nos envia el navegador.
    // response : son todo lo que enviamos desde el servidor.
    res.sendFile(__dirname + '/index.html');
    //res.status(200).send("<p> Usuarios" + JSON.stringify(users) + "</p>");
});

io.sockets.on('connection', function(socket)
{
    io.emit('new_client', []);

    socket.on('login', function(data)
    {
        if (users.indexOf(data.userId) !== -1)
        {
            // console.log('data');
        } else {
            users.push(data.userId);
            ident.push(socket.id);
        }
        io.emit('login', users, data.userId);
    });

    socket.on('disconnect', function()
    {
        var id = ident.indexOf(socket.id);
        // console.log(id + ' | user ' + users[id] + ' disconnected');
        if (id >= 0) {
            users.splice(id, 1);
            ident.splice(id, 1);
        }
        io.emit('disconnect', users);
    });

    socket.on('notificacion', function(datos)
    {
        io.emit('notificar',datos);
    });

    socket.on('respuestaNotificacion', function(datos)
    {
        io.emit('respuesta',datos);
    });

    socket.on('alertaUsuario', function(datos)
    {
        io.emit('notificarUsuario',datos);
    });

    socket.on('enviarMensaje', function(datos)
    {
       io.emit('mensajeUsuario',datos); 
    });

    socket.on('new_publication', function(datos)
    {
        io.emit('publication_received', datos);
    });

    socket.on('publication_like', function(datos)
    {
        io.emit('publication_like', datos);
    });

});

http.listen(PORT,function(){
    console.log('el servidor esta escuchando el puerto %s',PORT);
});
