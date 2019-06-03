const database = require('../config/dbconfig');

// Helper to wrap database interactions in a Promise
const dbToPromise = (cmd, stmt, args) => {
  return new Promise((resolve, reject) => {
    database.db[cmd](stmt, args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
};

module.exports = {
  dbToPromise
};
