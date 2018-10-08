const fs = require('fs');
const path = require('path');
const os = require('os');
const chai = require('chai');
const bfs = require('bestikk-fs');
const assert = chai.assert;

const Module = require('../index.js');

describe('Bestikk', function () {
  let TEST_DIR;

  beforeEach(function () {
    TEST_DIR = path.join(os.tmpdir(), 'test', 'bestikk-download');
    bfs.removeSync(TEST_DIR);
  });

  afterEach(function () {
    bfs.removeSync(TEST_DIR);
  });

  describe('+ getContentFromURL()', () => {
    it('should get content from HTTPS', function (done) {
      const dest = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());
      bfs.mkdirsSync(dest);
      const license = path.join(dest, 'LICENSE');
      new Module({}).getContentFromURL('https://raw.githubusercontent.com/bestikk/bestikk-log/master/LICENSE', license).then(() => {
        assert(fs.existsSync(license));
        assert.include(fs.readFileSync(license, { encoding: 'utf8' }), 'bestikk');
        done();
      });
    });
    it('should follow redirect', function(done) {
      const dest = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());
      bfs.mkdirsSync(dest);
      const license = path.join(dest, 'LICENSE');
      new Module({}).getContentFromURL('https://github.com/bestikk/bestikk-download/releases/download/1.0.0-rc1/LICENSE', license).then(() => {
        assert(fs.existsSync(license));
        assert.include(fs.readFileSync(license, { encoding: 'utf8' }), 'bestikk');
        done();
      });
    })
    it('should not follow redirect', function(done) {
      const dest = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random());
      bfs.mkdirsSync(dest);
      const license = path.join(dest, 'LICENSE');
      new Module({
        followRedirect: false,
        maxRedirects: 10
      }).getContentFromURL('https://github.com/bestikk/bestikk-download/releases/download/1.0.0-rc1/LICENSE', license).then(() => {
        assert(fs.existsSync(license));
        assert.include(fs.readFileSync(license, { encoding: 'utf8' }), 'redirected');
        done();
      });
    })
  });

});
