var _ = require('lodash'),
  fs = require('fs'),
  async = require('async'),
  pathUtil = require('path');

module.exports = function (done) {
  var self = this;

  var controllers = self.controllers = {};
  var controllersPath = self.config.paths.controllers = pathUtil.join(self.config.paths.root, 'api/controllers');

  fs.readdir(controllersPath, function (err, fileNames) {
    async.each(fileNames, function (fileName, done) {
      var filePath = pathUtil.join(controllersPath, fileName);
      var extname = pathUtil.extname(filePath);
      if(extname !== '.js') {
        return done();
      }
      fs.stat(filePath, function (err, stat) {
        if(err) {
          return done();
        }

        if(stat.isFile()) {
          var moduleName = pathUtil.basename(fileName, extname);
          controllers[moduleName] = require(filePath);
        }
        done();
      });
    }, done);
  });
};