

const Queue = require('bull');
const appRoot = require('app-root-path');

const DB = require(`${appRoot}/lib/rethinkdb`);
const bb = require('bluebird');
const r = bb.promisifyAll(require('rethinkdb'));

const pythonTrainer = require(`${appRoot}/app/python/util`);

const imageQueue = new Queue('Image-Training', 'redis://127.0.0.1:32773');
let conn;

(async () => {
  conn = await DB.init();
})();

const exp_variables = pythonTrainer.experiments_variables;

imageQueue.process(async (job, done) => {
  const { id } = job.data;
  if (!id) {
    done(new Error('No Model ID'));
  }
  const object = await r.table('models').get(id).run(conn);
  if (object) {
    const folderPath = `${appRoot}/uploads/${id}/testing`;
    try {
      let best = {
        i: '0.001', k: '1000', j: '1', image: '', accuracy: 0.14223534095829604,
      };
      const results = await Promise.all(exp_variables.map(async (variables) => {
        const result = await pythonTrainer.train(folderPath, ...variables);
        const parsed_result = JSON.parse(result.replace(/'/g, '"'));
        if (parsed_result.accuracy > best.accuracy) best = parsed_result;
        return result;
      }));
      const updateResults = await r.table('models').get(id).update({
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
