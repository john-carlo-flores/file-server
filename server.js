const net = require('net');
const fs = require('fs');
const { PORT, FILE_PATH } = require('./constants');

let istream, serverSocket, connectedClient;

const startServer = () => {
  const server = net.createServer(socket => {
    socket.pipe(process.stdout);
    serverSocket = socket;
  })
  .on('error', (err) => {
    throw Error(`Error: ${err}`);
  })
  .on('connection', (client) => {
    console.log(`Client connected!`);
    client.write('Welcome to the File Server!');
    client.setEncoding('utf8');
    client.on('data', handleClientRequest.bind(this, client));
  })
  .listen(PORT, () => { 
    console.log(`Server started. Listening on PORT ${PORT}`);
  });

  return server;
};

const handleClientRequest = (client, data) => {
  const request = data.split(' ');

  console.log(data);

  if (request[0] === 'GET:') {
    if (fs.existsSync(FILE_PATH + request[1])) {

      client.write('HTTP/1.1 200 OK');

      istream = fs.createReadStream(FILE_PATH + request[1]);
      istream.on('readable', function() {
        let data;
  
        while (data = this.read()) {
          serverSocket.write(data)
        }
      });
      istream.on('end', () => istream.close());

    } else {
      client.write('HTTP/1.1 404 Not Found');
    }
  }
}

startServer();


