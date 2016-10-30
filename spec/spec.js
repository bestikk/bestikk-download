var fs = require('fs');
var path = require('path');
var os = require('os');
var chai = require('chai');
var bfs = require('bestikk-fs');
var assert = chai.assert;

var main = require('../index.js');

describe('Bestikk', function() {
  var TEST_DIR;

  beforeEach(function () {
    TEST_DIR = path.join(os.tmpdir(), 'test', 'bestikk-download');
    bfs.removeSync(TEST_DIR);
  });

  afterEach(function () {
    bfs.removeSync(TEST_DIR);
  });

  describe('+ getContentFromURL()', function () {
    it('should get content from HTTPS', function (done) {
      var dest = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());
      bfs.mkdirsSync(dest);
      var license = path.join(dest, 'LICENSE');
      main.getContentFromURL('https://raw.githubusercontent.com/bestikk/bestikk-log/master/LICENSE', license, function() {
        assert(fs.existsSync(license));
        assert.include(fs.readFileSync(license, {encoding: 'utf8'}), 'bestikk');
        done();
      });
    });
  });

});
