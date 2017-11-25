

const appRoot = require('app-root-path');

const config = require(`${appRoot}/config`);
const _ = require('lodash');
const Promise = require('bluebird');
const r = Promise.promisifyAll(require('rethinkdb'));

class Rethinkdb {
  constructor() {
    this.db = null;
  }

  async init() {
    const conn = await r.connect({ host: 'localhost', port: 32771 });
    const table = await r.db('test').tableList().run(conn);
    if (_.indexOf(table, 'models') < 0) {
      const newTable = await r.db('test').tableCreate('models').run(conn);
    }
    return conn;
  }

  getConnection() {
    return this.db;
  }

  async testConnection() {
    if (!this.db) {
      throw new Error('Failed to init db.');
    }

    try {
      return await await r.db('test').tableList().run(this.db);
    } catch (err) {
      throw new Error('Failed to connect to Rethinkdb Instance');
    }
  }
}

module.exports = new Rethinkdb();