const log = require('bestikk-log');
const fs = require('fs');
const http = require('http');
const https = require('https');

const Download = function (opts) {
  this.followRedirect = (opts.followRedirect !== undefined) ? opts.followRedirect : true;
  this.maxRedirects = (opts.maxRedirects !== undefined) ? opts.maxRedirects : 10;
};

const hasHeader = function (header, headers) {
  let headersKey = Object.keys(headers)
  const headersLowerCase = headersKey.map(function (h) {
    return h.toLowerCase();
  });
  header = header.toLowerCase();
  for (let i = 0; i < headersLowerCase.length; i++) {
    if (headersLowerCase[i] === header) return headersKey[i];
  }
  return false;
};

Download.prototype._download = function (location, targetStream, redirectsCount) {
  let downloadModule;
  if (location.startsWith('https')) {
    downloadModule = https;
  } else {
    downloadModule = http;
  }
  const followRedirect = this.followRedirect;
  const maxRedirects = this.maxRedirects;
  const _download = this._download;
  downloadModule.get(location, function (response) {
    if (response.statusCode >= 300 && response.statusCode < 400 && hasHeader('location', response.headers)) {
      const location = response.headers[hasHeader('location', response.headers)];
      if (followRedirect && redirectsCount < maxRedirects) {
        _download(location, targetStream, redirectsCount + 1);
      } else {
        response.pipe(targetStream);
      }
    } else {
      response.pipe(targetStream);
    }
  });
}

Download.prototype.getContentFromURL = async function (source, target) {
  log.transform('get', source, target);
  const targetStream = fs.createWriteStream(target);
  this._download(source, targetStream, 0);
  targetStream.on('finish', function () {
    targetStream.close();
  });
  return new Promise(function(resolve) {
    targetStream.on('close', function () {
      resolve();
    });
  });
};

module.exports = Download;
