let connection;
let message = '';
let logInput = false;
let fileName = '';

const setupInput = (conn) => {
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  stdin.resume();
  stdin.on('data', handleUserInput);
  connection = conn;
  return stdin;
};

const handleUserInput = (key) => {
  if (key === '\u0003') {
    process.exit();
  }

  if (key === '\u0014') {
    return logInput = true;
  }

  if (key === '\u0008') {
    console.log('backspace');
  }

  if (key === '\r' && logInput) {
    logInput = false;
    connection.write(`GET: ${message}`);
    console.log(`File ${message} requested from server!`);
    fileName = message.trim();
    console.log(fileName);
    message = '';
    return;
  }

  if (logInput) {
    message += key;
  }

  process.stdout.write(key);
};

const fileRequested = () => {
  return fileName;
}

const clearFileRequested = () => {
  fileName = '';
}

module.exports = { setupInput, fileRequested, clearFileRequested };