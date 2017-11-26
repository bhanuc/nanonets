

const _ = require('lodash');
const appRoot = require('app-root-path');
const r = require('rethinkdbdash')();

const pythonTrainer = require(`${appRoot}/app/python/util`);


const createModel = async (name) => {
  const object = await r.table('models').insert({ name }).run();
  return object;
};

const getModelById = async (id) => {
  const object = await r.table('models').get(id).run();
  if (object) {
    object.files = _.flatten(object.files);
    return object;
  }
  throw new Error('Model Not found');
};

const ModelexistsById = async (ctx, next) => {
  const { id } = ctx.params;
  const object = await r.table('models').get(id).run();
  if (object) {
    await next();
  } else {
    throw Error('Model Not Found');
  }
};
const uploadImage = async (id, files) => {
  const filesMatch = _.map(files, file => file.path);
  const update = await r.table('models').get(id).update({
    files: r.row('files').append(filesMatch).default([]),
  }).run();
  return { filesMatch, update };
};

const testImage = async (id, files) => {
  const object = await r.table('models').get(id).run();
  const bestVariables = object.best;
  const folderPath = `${appRoot}/uploads/${id}/testing/${JSON.stringify(files[0].path)}`;
  const result = await pythonTrainer.test(folderPath, bestVariables.i, bestVariables.j, bestVariables.k);
  return result.replace(/'/g, '"');
};

module.exports = {
  createModel, getModelById, uploadImage, ModelexistsById, testImage,
};
