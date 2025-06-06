// Fixes for app.js to work with Node.js 22
// Add this at the top of app.js after the requires

// Fix for fetch not being a function
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Fix for readdirp.promise
const readdirp = require('readdirp');
// Modern readdirp uses different API
const readdirpAsync = (path) => {
  return new Promise((resolve, reject) => {
    const files = [];
    readdirp(path, { type: 'files' })
      .on('data', (entry) => files.push(entry))
      .on('end', () => resolve(files))
      .on('error', reject);
  });
};

// Replace readdirp.promise with readdirpAsync