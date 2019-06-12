const prod = process.env.NODE_ENV === 'production';
const memjs = require('memjs');
const cacheSeconds = 600; // Memcache length
const client = prod ? memjs.Client.create() : undefined;

// Helper to get from memcache
const getMemcache = async key => {
  return prod ?
    await client.get(key) :
    Promise.resolve({});
};

const setMemcache = async (key, val) => {
  return prod ?
    await client.set(key, val, {expires: cacheSeconds}) :
    Promise.resolve();
};

module.exports = {
  getMemcache,
  setMemcache
};
