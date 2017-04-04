'use strict'
var path = require('path')
var through = require('through2').obj
var consolidate = require('consolidate')

/*
 * Template renderer -------------------------------------
 * Custom through-stream used to interpolate
 * content files with specified templates.
 */
module.exports = function rendertemplate (name, opts) {
    return through(function (file, enc, cb) {
        var stream = this
        if (!opts) opts = {}
        if ( !opts.hasOwnProperty('basedir') ) {
            opts.basedir = ''
        }
        // Pass through data if no template is specified
        if ( !file.hasOwnProperty('data') || !file.data.hasOwnProperty('template') ) {
            this.push(file)
            return cb()
        }
        var template = path.join( opts.basedir, file.data.template )
        // Add file data to `opts` before passing it to template engine
        Object.keys(file.data).forEach(function (key) {
            opts[key] = file.data[key]
        })
        // Convert buffer and strip newline characters
        if ( file.hasOwnProperty('contents') ) {
            opts.content = file.contents
                .toString()
                .replace(/(\r\n|\n|\r)/gm,'')
        }

        consolidate[name](template, opts, function(err, html) {
            if (err) return stream.emit('error', err)
            file.contents = new Buffer(html)
            stream.push(file)
            cb()
        })
    })
}
