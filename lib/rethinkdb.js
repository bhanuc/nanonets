

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
    const conn = await r.connect({ host: 'localhost', port: config.db_port });
    this.table = await r.db('test').tableList().run(conn);
    if (_.indexOf(this.table, 'nanomodels') < 0) {
      await r.db('test').tableCreate('nanomodels').run(conn);
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
