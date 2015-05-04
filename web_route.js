var dr = require('dir-requirer')(__dirname);
var routes = dr('./app/controllers');

module.exports = function (app) {
  routes.auth(app);
  routes.user(app);
  routes.profile(app);
  routes.engproj(app);
  routes.netproj(app);
  routes.citygovproj(app);
};