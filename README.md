# ![SAPUES](http://lrtrln.fr/opensource/sapues/screenshot.png)

## Boilerplate for frontend development
_SA--PU--ES = Sass + Pug + ES6 & automation_

The purpose of the SAPUES is to provide a consistent file structure with a normalized code and a collection of helpers and resets (soon).
 It wraps [ITCSS](http://itcss.io/) principles.

# Features

## Pug as templating system
- Layouts and partials to power static websites

## Sass structure
- It follows [ITCSS](https://www.youtube.com/watch?v=1OKZOV-iLj4) concepts
- A simple font sizing : 1.6em = 16px
- A collection of variables to manage default sizing, fonts and colors

## Gulp to make life more funky
- Compiles `*.pug` pages
- Compiles `*.sass` files
- Prefixes css
- Bundles `*.js` files with [browserify](http://browserify.org/) and [Babeljs](http://babeljs.io)
- Minify css and uglify js
- Serves all files
- Synchronizes and reloads modifications across browsers

# Usage
  For sure the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) are required.

## Plug and play

### Manual installation
Get it from github:  

1. Download [latest release](https://github.com/lrtrln/sapues/releases)
- Run `npm install` to install all dependencies
- To build in `dist` directory `pug`, `css` and`js` run `gulp build`

```shell
curl -L https://github.com/lrtrln/sapues/archive/master.tar.gz | tar zx && cd ./sapues/ && npm i && gulp
```

### Play (with madness)

1. To start working and serving files run `gulp`
- Browsersync will prompt the server url (`localhost:3000`)
- You can now edit `*.sass` & `*.js` & `*.pug` files, `*.css` & `*.js` & `*.html` will be overwritten



