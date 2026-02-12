
import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = (value, helpers) => {
  if (!value) return value;
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const listUsers = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().trim().allow('').optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    site: Joi.string().custom(objectId).optional(),
    role: Joi.string().custom(objectId).optional(),
  }),
};

const createUser = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().custom(objectId).required(),
    site: Joi.string().custom(objectId).optional().allow(null, ''),
    status: Joi.string().valid('active', 'inactive').optional(),
  }),
};

const updateUser = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
  
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().custom(objectId).optional(),
    site: Joi.string().custom(objectId).optional().allow(null, ''),
    status: Joi.string().valid('active', 'inactive').optional(),
  }).min(1),
};

const getUser = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
};

const deactivateUser = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
};

export default {
  listUsers,
  createUser,
  updateUser,
  getUser,
  deactivateUser,
};
