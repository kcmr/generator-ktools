'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-ktools:minip', function () {
  before(function (done) {
    return helpers.run(path.join(__dirname, '../generators/minip'))
      .withPrompts({
        name: 'test-minip'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'js/script.js',
      'scss/style.scss',
      '.editorconfig',
      '.gitignore',
      'gulpfile.js',
      'index.html',
      'package.json'
    ]);
  });

  it('package.json does not include normalize-scss dependency', function() {
    assert.noFileContent('package.json', /normalize-scss/gm);
  });

  it('style.scss does not import normalize-scss', function() {
    assert.noFileContent('scss/style.scss', /normalize-scss/gm);
  });

  context('with normalize-scss', function() {
    before(function (done) {
      return helpers.run(path.join(__dirname, '../generators/minip'))
        .withPrompts({
          normalizecss: true
        })
        .on('end', done);
    });

    it('package.json includes normalize-scss dependency', function() {
      assert.fileContent('package.json', /normalize-scss/gm);
    });

    it('style.scss imports normalize-scss', function() {
      assert.fileContent('scss/style.scss', /normalize-scss/gm);
    });
  });
});
