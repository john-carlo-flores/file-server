const net = require('net');
const fs = require('fs');
const { IP, PORT, SAVE_PATH } = require('./constants');
const { setupInput, fileRequested, clearFileRequested } = require('./input');

let date, size, writeToFile = false;
let ostream;

const connectFileServer = () => {
  const conn = net.createConnection({
    host: IP,
    port: PORT
  })
  .setEncoding('utf8')
  .on('connect', () => console.log('Connecting..'))
  .on('data', data => {
    if (data.toLowerCase().includes('welcome')) {
      return console.log(data);
    }

    const response = data.split(' ');
    // console.log(data);

    if (writeToFile) {
      size += data.length;
      const elapsed = new Date() - date;
      socket.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`)
      process.stdout.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s`);
      ostream.write(data);
      return;
    }

    if (response[1] === '200') {
      writeToFile = true;
      console.log(data);
      console.log(fileRequested());
      date = new Date();
      size = 0;
      ostream = fs.createWriteStream(SAVE_PATH + fileRequested());
    } else if (response[1] === '404') {
      console.log(`File ${fileRequested()} requested does not exist.`)
      clearFileRequested();
      return;
    }
  });

  return conn;
};

const socket = connectFileServer();
socket.on('end', () => {
  if (writeToFile) {
    clearFileRequested();
    console.log(`FILE: ${fileRequested()}`);
    writeToFile = false;
    // ostream.end();
  }
});

setupInput(socket);