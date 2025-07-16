// this is for validations and stuffs
const Joi = require('joi');

const CreateAdminDTO = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(50).required(),
  role: Joi.string(),
  active: Joi.boolean(),
  bio: Joi.string(),
  fcmToken: Joi.string().allow(),
  website_link: Joi.string().allow(),
  location: Joi.string().allow(),
  rating: Joi.string().allow(),
  area_square_km: Joi.string().allow(),
  phone_number: Joi.string().allow()
});

const AdminLoginDTO = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().required(),
  fcmToken: Joi.string().allow()
});

const AssignRoleDTO = Joi.object({
  roleId: Joi.string().length(24).required()
});

const UpdateAdminDTO = Joi.object({
  name: Joi.string().min(3).max(30),
  role: Joi.string(),
  active: Joi.boolean(),
  bio: Joi.string(),
  fcmToken: Joi.string(),
  website_link: Joi.string(),
  location: Joi.string(),
  rating: Joi.string(),
  area_square_km: Joi.string(),
  phone_number: Joi.string()
});

module.exports = {
  CreateAdminDTO,
  AdminLoginDTO,
  AssignRoleDTO,
  UpdateAdminDTO
};
