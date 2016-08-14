'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash-addons');

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.option('debug', {
      desc: 'Run generator in debug mode without installing dependencies',
      defaults: false
    });
  },

  prompting: function () {
    this.log(yosay('Welcome to the ' + chalk.red('mini project') + ' generator!'));

    var done = this.async();
    return this.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Mini Project title',
        default: 'Mini Project demo'
      },
      {
        type: 'input',
        name: 'name',
        required: true,
        message: 'Project folder',
        default: _.slugify(this.appname)
      },
      {
        type: 'confirm',
        name: 'normalizecss',
        message: 'Would you like to use Normalize CSS?',
        default: false
      }
    ]).then(function(answers) {
      this.props = answers;
      done();
    }.bind(this));
  },

  default: function() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log('\n');
      this.log(chalk.yellow('-----------------------------------------------------------------'));
      this.log(chalk.yellow('Creating a folder named ') + chalk.green(this.props.name) + chalk.yellow(' for your project.'));
      this.log(chalk.yellow('-----------------------------------------------------------------'));
      this.log('\n');
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  },

  writing: function () {
    var copyTemplates = function(files) {
      files.forEach(function(file) {
        this.fs.copyTpl(this.templatePath(file.src), this.destinationPath(file.dest), this);
      }.bind(this));
    }.bind(this);

    copyTemplates([
      { src: 'index.html', dest: 'index.html' },
      { src: 'scss/style.scss', dest: 'scss/style.scss' }
    ]);

    this.fs.copy([
      this.templatePath() + '/js/*',
      this.templatePath() + '/**/.*',
      this.templatePath('gulpfile.js')
    ], this.destinationPath());

    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        process: function(file) {
          var manifiest = JSON.parse(file.toString());
          manifiest.name = this.props.name;

          // remove unwanted dependencies (normalize-scss)
          if (!this.props.normalizecss) {
            delete manifiest.devDependencies['normalize-scss'];
          }

          return JSON.stringify(manifiest, null, 2);
        }.bind(this)
      }
    );
  },

  install: function () {
    if (!this.options.debug) {
      this.installDependencies({
        bower: false
      });
    }
  },

  end: function() {
    this.log('\n');
    this.log(chalk.yellow('-----------------------------------------------------------------'));
    this.log(chalk.green('All done!'));
    this.log(chalk.yellow('Run gulp inside ') + chalk.green(this.props.name) + chalk.yellow(' folder to build and serve your project.'));
    this.log(chalk.yellow('-----------------------------------------------------------------'));
    this.log('\n');
  }
});
