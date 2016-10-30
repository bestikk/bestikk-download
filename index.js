var log = require('bestikk-log');
var fs = require('fs');
var http = require('http');
var https = require('https');

var Download = function() {
};

Download.prototype.getContentFromURL = function (source, target, callback) {
  log.transform('get', source, target);
  var targetStream = fs.createWriteStream(target);
  var downloadModule;
  // startWith alternative
  if (source.lastIndexOf('https', 0) === 0) {
    downloadModule = https;
  } else {
    downloadModule = http;
  }
  downloadModule.get(source, function (response) {
    response.pipe(targetStream);
    targetStream.on('finish', function () {
      targetStream.close(callback);
    });
  });
};

module.exports = new Download();
