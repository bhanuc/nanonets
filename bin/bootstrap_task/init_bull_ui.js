

const express = require('express');

const router = express.Router();

const app = express();
const appRoot = require('app-root-path');
const config = require(`${appRoot}/config`);

const queues = [{
  name: 'Image-Training',
  port: config.redis_port,
  host: '127.0.0.1',
  hostId: 'AWS',
}];

const arena = require('bull-arena')({ queues });

router.use('/', arena);


module.exports = async () => {
  console.info('Initializing the bulls ui ...');
};

