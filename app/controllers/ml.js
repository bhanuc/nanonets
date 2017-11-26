

const Router = require('koa-router');
const appRoot = require('app-root-path');
// const {validator} = require('koa-joi-router-2');

const model = require(`${appRoot}/app/models/model.js`);
const path = require('path');

const schemasBasePath = path.join(appRoot.path, 'app/schemas');
// const joiValidator = validator(schemasBasePath);
const multer = require('koa-multer');
const mime = require('mime');
const mkdirp = require('mkdirp');
const worker = require('../workers/train');

const storageTraining = multer.diskStorage({
  destination(req, file, cb) {
    const id = req.url.split('models/')[1];
    mkdirp(`uploads/${id}/training`, (err) => {
      if (err) {
        cb(err);
      } else {
        cb(null, `uploads/${id}/training`);
      }
    });
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${mime.extension(file.mimetype)}`); // Appending .jpg
  },
});

const storageTesting = multer.diskStorage({
  destination(req, file, cb) {
    const id = req.url.split('models/')[1];
    mkdirp(`uploads/${id}/testing`, (err) => {
      if (err) {
        cb(err);
      } else {
        cb(null, `uploads/${id}/testing`);
      }
    });
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${mime.extension(file.mimetype)}`); // Appending .jpg
  },
});
const uploadTraining = multer({
  storage: storageTraining,
});
const uploadTest = multer({
  storage: storageTesting,
});

const Models = {
  putModel: async (ctx) => {
    const { name } = ctx.request.body;
    ctx.body = await model.createModel(name);
  },
  getModel: async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await model.getModelById(id);
  },
  trainModel: async (ctx) => {
    const { id } = ctx.params;
    worker.add({ id });
    ctx.body = { message: 'Your Job has been added to the queue. You will get an email once the training is complete.' };
  },
  uploadImage: async (ctx) => {
    const { id } = ctx.params;
    const { files } = ctx.req;
    const resp = await model.uploadImage(id, files);
    ctx.body = resp;
  },
  testImage: async (ctx) => {
    const { id } = ctx.params;
    const { files } = ctx.req;
    const resp = await model.testImage(id, files);
    ctx.body = resp;
  },
  getRouter: () => {
    const router = Router();
    router.post('ml_putTask', '/v1/models/create', Models.putModel);
    router.get('ml_getTask', '/v1/models/:id', Models.getModel);
    router.get('ml_trainModel', '/v1/models/:id/train', Models.trainModel);
    router.put('ml_uploadImage', '/v1/models/:id', model.ModelexistsById, uploadTraining.any(), Models.uploadImage);
    router.put('ml_testImage', '/v1/models/:id/test', model.ModelexistsById, uploadTest.any(), Models.testImage);
    return router;
  },
};

module.exports = Models;
