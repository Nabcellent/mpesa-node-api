const Joi = require('joi');

export const MpesaRequest = {
    initiateStk: Joi.object({
        relation_id: Joi.allow(Joi.string(), Joi.number()),
        phone      : Joi.number().integer().required(),
        amount     : Joi.number().integer().required(),
        description: Joi.string().default('Mpesa Payment'),
        reference  : Joi.string().default('Mpesa Payment')
    }),
    queryStatus: Joi.object({
        checkout_request_id: Joi.string().required(),
    }),
};
