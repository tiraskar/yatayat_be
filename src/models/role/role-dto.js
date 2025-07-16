const Joi = require('joi');

const CreateRoleDTO = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  permissions: Joi.array().items(Joi.string()).required(),
  description: Joi.string()
});

const RoleDTO = {
  CreateRoleDTO
};

module.exports = RoleDTO;
