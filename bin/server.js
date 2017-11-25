

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const Promise = require('bluebird');

const tasks = [
  // require('./bootstrap_task/init_rethinkdb')(),
  require('./bootstrap_task/init_app')(),
  require('./bootstrap_task/init_bull_ui')(),
];


async function init() {
  await Promise.resolve(tasks)
    .mapSeries(asyncMethodPassed => 0);
}

(async () => {
  try {
    await init();
  } catch (error) {
    console.error(error);
    console.info(`Server bootstrap failed. - ${error.message}`);
    process.exit(1);
  }
})();

