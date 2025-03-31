const fs = require('fs');

const logToFile = (level, ...args) => {
  // Process args to stringify any objects
  const processedArgs = args.map(arg => 
    typeof arg === 'object' && arg !== null 
      ? JSON.stringify(arg) 
      : arg
  );
  
  const message = `[${level.toUpperCase()}] ${processedArgs.join(' ')}\n`;
  fs.appendFileSync('../data/logs/exerci1.log', message);
  console[level](message.trim());
};

const Logger = {
  log: (...args) => logToFile('log', ...args),
  info: (...args) => logToFile('info', ...args),
  warn: (...args) => logToFile('warn', ...args),
  error: (...args) => logToFile('error', ...args),
};

module.exports = Logger;