const express = require('express');
const app = express();
// [NOTE] Socket.io는 Express를 직접 받지 못하므로, HTTP로 먼저 연결한다.
const http = require('http').Server(app);
const io = require('socket.io')(http);

const generateUsername = () => {
  const randonNumber = Math.random() * 10;
  const userNumber = Math.floor(randonNumber);

  return `User #${userNumber}`
};

app.get('/', (req, res) => { 
  res.sendFile(`${__dirname}/client.html`);
});

io.on('connection', (userSocket) => {
  console.log(`[Client Connetcted] User ID - ${userSocket.id}`);

  // 새로운 사용자 이름을 생성해 전달한다.
  io.to(userSocket.id).emit('username', generateUsername());

  userSocket.on('disconnect', () => {
    console.log(`[Client Disconnected] User ID - ${userSocket.id}`);
  });

  userSocket.on('message', (username, message) => {
    const sharedMessage = `${username} : ${message}`;
    
    io.emit('broadcast', sharedMessage);
    
    console.log(`${username} has sent a message: ${message}`);
  });
})

http.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});