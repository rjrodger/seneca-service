/* Copyright (c) 2013 Richard Rodger, MIT License */
"use strict";


var fs            = require('fs')
var child_process = require('child_process')
var buffer        = require('buffer')

var _       = require('underscore')
var async   = require('async')
var connect = require('connect')
var request = require('request')

var nid = require('nid')


module.exports = function( options ) {
  var seneca = this
  var plugin = 'service'
  


  options = seneca.util.deepextend({
    startport:8200,
    folder:'./services'
  },options)
  





  seneca.add({init:plugin}, function( args, done ){
    var seneca = this

    fs.readdir( options.folder, function(err,files){
      if( err ) return done(err);

      files = _.filter(files,function(file){return /\.js$/.exec(file)})

      var port = options.startport
      async.map(files,function(file,next){
        start_service( file, port++, next )
      },done)

      function start_service( path, port, next ) {
        var cmdline = 'node -e "require(\'../..\')().use(\''+options.folder+'/'+path+'\').listen('+port+')"'
        seneca.log.debug('service',cmdline)

        child_process.exec(cmdline,{},function(){
          seneca.log.debug('service',cmdline,arguments)
        })
        setTimeout(next,1111)
      }
    })
  })


  return {
    name: plugin,
  }
}
