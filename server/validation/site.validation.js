import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = (value, helpers) => {
    
    if (!value) return value;
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

const listSites = {
    query: Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        search: Joi.string().trim().allow('').optional(),
        status: Joi.string().valid('active', 'inactive').optional(),
    }),
};

const createSite = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(200).required(),
        location: Joi.string().trim().allow('').optional(),
        timezone: Joi.string().trim().allow('').optional(),
        status: Joi.string().valid('active', 'inactive').optional(),
    }),
};

const getSite = {
    params: Joi.object({
        id: Joi.string().custom(objectId).required(),
    }),
};

const updateSite = {
    params: Joi.object({
        id: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object({
        name: Joi.string().trim().min(2).max(200).optional(),
        location: Joi.string().trim().allow('').optional(),
        timezone: Joi.string().trim().allow('').optional(),
        status: Joi.string().valid('active', 'inactive').optional(),
    }).min(1),
};

const deleteSite = {
    params: Joi.object({
        id: Joi.string().custom(objectId).required(),
    }),
};

export default {
    listSites,
    createSite,
    getSite,
    updateSite,
    deleteSite,
};
