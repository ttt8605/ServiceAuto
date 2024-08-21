const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')
const extension = (joi) => ({
   type: 'string',
   base: joi.string(),
   messages: {
       'string.escapeHTML': '{{#label}} must not include HTML!',
       'string.noURL': '{{#label}} must not include a URL!'
   },
   rules: {
       escapeHTML: {
           validate(value, helpers) {
               const clean = sanitizeHtml(value, {
                   allowedTags: [],
                   allowedAttributes: {},
               });
               if (clean !== value) return helpers.error('string.escapeHTML', { value })
               return clean;
           }
       },
       noURL: {
        validate(value, helpers) {
            const urlPattern = /(https?:\/\/[^\s]+)/g;
            if (urlPattern.test(value)) {
                return helpers.error('string.noURL', { value });
            }
            return value;
        }
    }
   }
});

const Joi = BaseJoi.extend(extension)


module.exports.ServiciiSchema = Joi.object({
    name:Joi.string().required().escapeHTML(),
    description:Joi.string().required().escapeHTML(),
    deleteImages:Joi.array()
 }).required()


 module.exports.PostariSchema = Joi.object({
    name:Joi.string().required().escapeHTML(),
    description:Joi.string().required().escapeHTML(),
    deleteImages:Joi.array()
 }).required()


 module.exports.CarSchema = Joi.object({
    model:Joi.string().required().escapeHTML(),
    plate:Joi.string().required().escapeHTML(),
    owner:Joi.string().required().escapeHTML(),
    status:Joi.string().required(),
   
 }).required()

 module.exports.GetPlateSchema = Joi.object({
    plate: Joi.string().alphanum().min(1).max(8).required().escapeHTML(),
 })

 module.exports.AngajatiSchema = Joi.object({
    name:Joi.string().required().escapeHTML(),
    role:Joi.string().required().escapeHTML(),
    deleteImages:Joi.array()
 }).required()


 module.exports.AppointmentSchema = Joi.object({
    name:Joi.string().required().escapeHTML(),
    phone:Joi.string().required().escapeHTML(),
    ora: Joi.string().required().pattern(/^(0[0-9]|1[0-9]|2[0-3]):([0-5]\d)$/).escapeHTML(),
    date: Joi.date().iso().required()
 }).required()
