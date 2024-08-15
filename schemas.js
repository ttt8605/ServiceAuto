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
    // description:Joi.string().required().escapeHTML(),
    deleteImages:Joi.array()
 }).required()


 module.exports.CarSchema = Joi.object({
    model:Joi.string().required().escapeHTML(),
    plate:Joi.string().required().escapeHTML(),
    owner:Joi.string().required().escapeHTML(),
    status:Joi.string().required(),
   
 }).required()
