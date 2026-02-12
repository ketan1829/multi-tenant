import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = (value, helpers) => {
  if (!value) return value;
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const listRoles = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().trim().allow('').optional(),
  }),
};

const createRole = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().allow('').optional(),
    permissions: Joi.array().items(Joi.string().trim()).default([]),
  }),
};

const getRole = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateRole = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    description: Joi.string().trim().allow('').optional(),
    permissions: Joi.array().items(Joi.string().trim()).optional(),
  }).min(1),
};

const deleteRole = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required(),
  }),
};

export default {
  listRoles,
  createRole,
  getRole,
  updateRole,
  deleteRole,
};
