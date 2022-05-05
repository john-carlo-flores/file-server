const net = require('net');
const fs = require('fs');
const { PORT, FILE_PATH } = require('./constants');

let istream, serverSocket;

const startServer = () => {
  const server = net.createServer(socket => {
    // socket.pipe(process.stdout);
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

  if (request[0] === 'GET:') {

    if (fs.existsSync(FILE_PATH + request[1])) {

      client.write('HTTP/1.1 200 OK');
      console.log(`Begin sending file for ${request[1]}`);
      istream = fs.createReadStream(FILE_PATH + request[1]);
      istream.on('readable', function() {
        let data;
        
        while (data = this.read()) {
          serverSocket.write(data);
        }
      });
      istream.on('end', () => {
        console.log('Stream Ended..');
        serverSocket.write('END');
        istream.close();
      });

    } else {
      client.write('HTTP/1.1 404 Not Found');
    }
  }
}

startServer();


