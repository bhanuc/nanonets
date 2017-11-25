

const _ = require('lodash');

module.exports = async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};
