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
  if (key === '\u0003') { //CTRL + C
    process.exit();
  }

  if (key === '\u0014') { //CTRL + T
    return logInput = true;
  }

  if (key === '\r' && logInput) { //ENTER
    fileName = message.trim();
    console.log(`\nFile ${fileName} requested from server!`);
    connection.write(`GET: ${fileName}`);
    logInput = false;
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