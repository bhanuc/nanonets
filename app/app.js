

const requireAll = require('require-all');
const Koa = require('koa');
const appRoot = require('app-root-path');
const _ = require('lodash');

const errorHandler = require(`${appRoot}/app/middlewares/error_handler`);
const controllers = requireAll(`${appRoot}/app/controllers`);
const bodyParser = require('koa-bodyparser');
const path = require('path');

const DB = require(`${appRoot}/lib/rethinkdb`);

const { generator } = require('koa-joi-router-2');

const schemasBasePath = path.join(appRoot.path, 'app/schemas');
const baseSpec = require('./utils/base-spec');


const ENV = process.env.NODE_ENV || 'development';
const DEV = ENV === 'development';

class App {
  constructor() {
    this.app = null;
  }

  async init() {
    const app = new Koa();
    if (DEV) {
      const transformed_controllers = _.map(controllers, controller => controller.getRouter());
      const cors = require('@koa/cors');
      const docRouter = generator(transformed_controllers, schemasBasePath, baseSpec);
      app.use(cors());
      app.use(docRouter.middleware());
    }

    app.use(errorHandler);
    app.use(bodyParser());

    _.each(controllers, (ctl) => {
      const router = ctl.getRouter();
      app.use(router.middleware());
    });
    this.app = app;
    return app;
  }

  listen(port) {
    return this.app.listen(port);
  }
}

module.exports = new App();
