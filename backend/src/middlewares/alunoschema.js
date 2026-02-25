const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const schema = require('../alunoSchema.json');

const ajv = new Ajv({ 
  loadSchema: async (uri) => {
    if (uri === 'https://json-schema.org/draft/2020-12/schema') {
      return {};
    }
  }
});
addFormats(ajv);
const validate = ajv.compile(schema);

module.exports = (req, res, next) => {
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json({
      status: "error",
      erros: validate.errors.map(err => ({
        campo: err.instancePath.replace('/', '') || 'root',
        motivo: err.message
      }))
    });
  }
  next();
};