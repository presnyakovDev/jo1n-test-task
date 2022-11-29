const fs = require('fs');

const jsrsasign_lib_filename = 'node_modules/jsrsasign/lib/jsrsasign.js';
var jsrsasign_lib_stub = 'module.exports.KEYUTIL = { getKey: b => null }; module.exports.KJUR = { jws: { JWS: { verifyJWT: (...a) => null } } };';
fs.writeFile(jsrsasign_lib_filename, jsrsasign_lib_stub, 'utf8', function (err) {
  if (err) return console.log(err);
});
