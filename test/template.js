'use strict'
var test = require('tap').test
var template = require('../lib/template.js')
var Readable = require('stream').Readable
var path = require('path')
var through = require('through2').obj
var cheerio = require('cheerio')

function createStream (data) {
    var stream = new Readable({objectMode: true})
    stream._read = function noop() {/* keep cmd from crashing REPL */}
    stream.push(data)
    stream.push(null)
    return stream
}

test('Module passes through empty object', function (t) {
    createStream({})
        .pipe(template('pug'))
        .pipe(through(function (obj) {
            var length = Object.keys(obj).length
            t.ok(obj)
            t.equal(length, 0, 'Object length is equal to zero')
            t.end()
        }))
})

test('Module emits error', function (t) {
    var obj = {
        data: { template: 'no_file.pug' }
    }
    createStream(obj)
        .pipe(template('pug', { basedir: __dirname })
            .on('error', function (err) {
                t.ok(err)
                t.ok(err instanceof Error)
                t.end()
            })
        )
})

test('Test template renderer using Pug engine', function (t) {
    var string = 'His talent was as natural as the pattern that was made by the dust on a butterfly\'s wings'
    var filepath = path.join( __dirname, './fixtures/templates/test.pug' )

    var obj = {
        contents: string,
        data: { template: filepath }
    }
    createStream(obj)
        .pipe(template('pug'))
        .pipe(through(function (obj, enc, cb) {
            var $ = cheerio.load(obj.contents.toString())
            var text = $('.content').text()
            t.equal( text, string, 'Template has content div' )
            t.end()
        }))
})
