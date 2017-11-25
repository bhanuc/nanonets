

const appRoot = require('app-root-path');

const app = require(`${appRoot}/app/app`);
const config = require(`${appRoot}/config`);

module.exports = async () => {
  console.info('Initializing the app ...');

  await app.init();
  console.log(`Server started and listeing in port ${config.api_port}`);
  await app.listen(config.api_port);
};

