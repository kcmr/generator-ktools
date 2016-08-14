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
});
