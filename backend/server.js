const app = require("./app");
const debug = require("debug")("mean-demo");
const http = require("http");

const User = require('./models/user');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);

const io = require('./socket').init(server);
io.on('connection', (socket) => {
  console.log('User connected to Socket io');

  socket.on('sendNewMessage', (messageData) => {
    console.log("message: " + messageData.message);
    //io.emit('message', `${socket.id} Said ${messageData.message}`);
    User.findById(messageData.userId).populate('roleId', 'name').then(user => {
      if (user.roleId?.name === "Admin")
        socket.join('admin-role');

      // => sending to all clients, include sender:
      io.emit('message', `${user?.name || socket.id} Said ${messageData.message}`);

      // => sending to sender-client only:
      // socket.emit('message', messageData.message);

      // => sending to all clients except sender
      // socket.broadcast.emit('message', messageData.message);

      // => sending to all clients in 'game' room(channel) except sender
      // socket.broadcast.to('game').emit('message', messageData.message);

      // => sending to all clients in 'game' room(channel), include sender
      // io.in('game').emit('message', messageData.message);

      // => sending to sender client, only if they are in 'game' room(channel)
      // socket.to('game').emit('message', messageData.message);

      // => sending to all clients in namespace 'myNamespace', include sender
      // io.of('myNamespace').emit('message', messageData.message);

      // => sending to individual socketid
      // socket.broadcast.to(socket.id).emit('message', messageData.message);

      // => for list socketid
      //for (var socketid in io.sockets.sockets) {}
      // => OR
      //Object.keys(io.sockets.sockets).forEach((socketid) => {});
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected Socket io');
  });
});

server.listen(port, () => console.log(`app listening on http://localhost:${port}`));
