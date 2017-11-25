

const _ = require('lodash');
const Promise = require('bluebird');
const appRoot = require('app-root-path');
const r = Promise.promisifyAll(require('rethinkdb'));

const pythonTrainer = require(`${appRoot}/app/python/util`);


const createModel = async (conn, name) => {
  const object = await r.table('models').insert({ name }).run(conn);
  return object;
};

const getModelById = async (conn, id) => {
  const object = await r.table('models').get(id).run(conn);
  if (object) {
    object.files = _.flatten(object.files);
    return object;
  }
  throw new Error('Model Not found');
};

const ModelexistsById = async (ctx, next) => {
  const { id } = ctx.params;
  const object = await r.table('models').get(id).run(ctx.db);
  if (object) {
    await next();
  } else {
    throw Error('Model Not Found');
  }
};
const uploadImage = async (conn, id, files) => {
  const filesMatch = _.map(files, file => file.path);
  const update = await r.table('models').get(id).update({
    files: r.row('files').append(filesMatch).default([]),
  }).run(conn);
  return { filesMatch, update };
};

const testImage = async (conn, id, files) => {
  const object = await r.table('models').get(id).run(conn);
  const best_variables = object.best;
  const folderPath = `${appRoot}/uploads/${id}/testing/${JSON.stringify(files[0].path)}`;
  const result = await pythonTrainer.test(folderPath, best_variables.i, best_variables.j, best_variables.k);
  return result.replace(/'/g, '"');
};

module.exports = {
  createModel, getModelById, uploadImage, ModelexistsById, testImage,
};
