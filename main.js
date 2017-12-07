const joi = require('joi');
const createRouter = require('@arangodb/foxx/router');
const crypto = require("@arangodb/crypto");

const nonceIdSchema = joi.string().required().description('The id of the nonce');

const router = createRouter();
module.context.use(router);

module.exports.createNonce = () => { return crypto.createNonce() }
module.exports.checkAndMarkNonce = (id) => { return crypto.checkAndMarkNonce(id) }
module.exports.router = router

// Creates a new nonce and returns it.
router.post(function(req, res) {
    res.json({nonce: crypto.createNonce()})
})
.summary('Create nonce')
.description('Creates a new nonce and returns it')
.response(joi.object({
    nonce: nonceIdSchema
}).label('Object'))

// Reads and uses nonce. Returns 'true' if nonce was valid.
router.put(':id', function(req, res) {
    let id = crypto.checkAndMarkNonce(req.pathParams.id);
    res.json(id);
})
.pathParam('id', nonceIdSchema)
.summary('Check nonce')
.description(`Reads and uses nonce. Returns 'true' if nonce was valid`)
.errorResponse(404, 'The nonce could not be found');

router.tag('nonce')
