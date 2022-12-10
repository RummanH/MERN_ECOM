const http = require('http');

require('dotenv').config();
const SocketIO = require('socket.io');

process.on('uncaughtException', (err) => {
  console.log(`Uncaught exception: ${err.name}, ${err.message}`);
  console.log('App is shutting down...');
  process.exit(1);
});

const { mongoConnect } = require('./services/mongo');
const app = require('./app');

const server = http.createServer(app);

const io = SocketIO(server);
const users = [];
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      console.log('Offline', user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', user);
      }
    }
  });
  socket.on('onLogin', (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    };
    const existUser = users.find((x) => x._id === updatedUser._id);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    console.log('Online', user.name);
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      io.to(admin.socketId).emit('updateUser', updatedUser);
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit('ListUsers', users);
    }
  });

  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit('selectUser', existUser);
    }
  });

  socket.on('onMessage', (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id && x.online);
      if (user) {
        io.to(user.socketId).emit('message', message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('message', message);
        const user = users.find((x) => x._id === message._id && x.online);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit('message', {
          name: 'Admin',
          body: 'Sorry. I am not available now',
        });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await mongoConnect();
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}....`);
    });
  } catch (err) {
    console.log(err);
    console.log('There was an error starting the server!');
  }
})();

process.on('unhandledRejection', (err) => {
  console.log(`Unhandled rejection: ${err.name} ${err.message}`);
  console.log('App is shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
