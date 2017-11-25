

const Queue = require('bull');
const appRoot = require('app-root-path');

const DB = require(`${appRoot}/lib/rethinkdb`);
const bb = require('bluebird');
const r = bb.promisifyAll(require('rethinkdb'));

const config = require(`${appRoot}/config`);
const pythonTrainer = require(`${appRoot}/app/python/util`);

const imageQueue = new Queue('Image-Training', 'redis://127.0.0.1:'+ config.redis_port);
let conn;

(async () => {
  conn = await DB.init();
})();

const expVariables = pythonTrainer.experimentsVariables;

imageQueue.process(async (job, done) => {
  const { id } = job.data;
  if (!id) {
    done(new Error('No Model ID'));
  }
  const object = await r.table('nanomodels').get(id).run(conn);
  if (object) {
    const folderPath = `${appRoot}/uploads/${id}/testing`;
    try {
      let best = {
        i: '0.001', k: '1000', j: '1', image: '', accuracy: 0.14223534095829604,
      };
      const results = await Promise.all(expVariables.map(async (variables) => {
        const result = await pythonTrainer.train(folderPath, ...variables);
        const parsedResult = JSON.parse(result.replace(/'/g, '"'));
        if (parsedResult.accuracy > best.accuracy) best = parsedResult;
        return result;
      }));
      await r.table('nanomodels').get(id).update({
        results, best,
      }).run(conn);
      done(null, results);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error('Model Not found in DB');
  }
});

module.exports = imageQueue;
