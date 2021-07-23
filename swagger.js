const yaml = require('js-yaml');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
function documentacionSwagger(server) {
    try {
        const doc = yaml.load(fs.readFileSync('./swagger.yaml'));
        server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(doc));
    } catch (e) {
        console.log(e);
    }
};
module.exports = {
    documentacionSwagger
};
