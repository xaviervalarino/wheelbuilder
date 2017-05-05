'use strict'
var test = require('tap').test

var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')

var Wheelbuilder = require('../')
var Vinyl = require('vinyl')
var through = require('through2')

var tmp = require('os').tmpdir()

test('Test Wheelbuilder I/O API', function (t) {
    var wb = new Wheelbuilder()
    var input = path.join(__dirname, './fixtures/content/index.md')
    wb.src(input)
        .pipe(through.obj(function (file, enc, cb) {
            t.ok(Vinyl.isVinyl(file), 'Input is streamed as a Vinyl file object')
            this.push(file)
            cb()
        }))
        .pipe(wb.dest(tmp))
        .on('finish', function () {
            var filename = path.basename(input)
            var infile = fs.readFileSync(input, 'utf8')
            var outfile = fs.readFileSync(path.join(tmp, filename), 'utf8')
            t.equal(infile, outfile, 'Output file matches input file')
            rimraf(outfile, t.end)
        })
})
