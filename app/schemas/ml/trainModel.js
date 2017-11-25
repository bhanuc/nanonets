

const Joi = require('joi');

const request = {
  params: Joi.object().keys({
    id: Joi.string().required().description('ID of the model'),
  }),
  type: 'json',
};

const meta = {
  swagger: {
    summary: 'Train model by ID',
    description: 'Train a model using the images, by providing an id, you can send images with any key names using multipart',
    tags: ['Model'],
  },
};

module.exports = {
  request,
  meta,
};
