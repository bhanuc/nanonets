

const Joi = require('joi');

const request = {
  params: Joi.object().keys({
    id: Joi.string().required().description('ID of the model'),
  }),
  type: 'json',
};

const meta = {
  swagger: {
    summary: 'Test a model',
    description: 'Get a model object, by uploading an image, you need send an image with any key names via multipart',
    tags: ['Model'],
  },
};

module.exports = {
  request,
  meta,
};
