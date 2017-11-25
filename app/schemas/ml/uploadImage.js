

const Joi = require('joi');

const request = {
  params: Joi.object().keys({
    id: Joi.string().required().description('ID of the model'),
  }),
  type: 'json',
};

const meta = {
  swagger: {
    summary: 'Get model by ID',
    description: 'Get a model object, by providing an id',
    tags: ['Model'],
  },
};

module.exports = {
  request,
  meta,
};
