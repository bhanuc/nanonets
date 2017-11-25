

const Joi = require('joi');

const request = {
  body: Joi.object().keys({
    name: Joi.string().required().description('Name of the Model'),
  }),
  type: 'json',
};

const meta = {
  swagger: {
    summary: 'Create a Model',
    description: 'Create a new model',
    tags: ['Model'],
  },
};

module.exports = {
  request,
  meta,
};
