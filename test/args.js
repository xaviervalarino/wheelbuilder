'use strict'
var test = require('tap').test

var fs = require('fs')
var spawn = require('child_process').spawn
var through = require('through2')

var cmd = __dirname + '/../bin/cmd.js'

test('Test help file argument', function (t) {
    t.plan(1)
    var str = ''
    var ps = spawn(process.execPath, [
        cmd,
        '-h'
    ])
    ps.stdout
        .pipe(through( function (chunk) {
            var usageText = chunk.toString()
            var usageFile = fs.readFileSync(__dirname + '/../bin/usage.txt', 'utf8')
            t.equal(usageText, usageFile, 'Help argument returns contents of `usage.txt` file')
        }))
})

test('Test input and output file arguments', function (t) {
    t.plan(1)
    var input = __dirname + '/fixtures/content/index.md'
    var output = require('os').tmpdir() + '/output.txt'
    // run the CLI
    var ps = spawn(process.execPath, [
        cmd,
        '-o', output,
        // __dirname + './fixtures/content.md'
        input
    ])
    ps.on('close', function (code, signal) {
        fs.readFile(output, 'utf8', function (err, contents) {
            if (err) throw err
            fs.stat(output, function (_, stats) {
                t.ok(stats, 'output file exists')
            })
        })
    })
})

test('Test STDIN and STDOUT', function (t) {
    t.plan(1)
    var string = '# STDIN Streaming test\nTest out STDIN stream\n'

    var Readable = require('stream').Readable
    var Combiner = require('stream-combiner')
    var through = require('through2')

    var stream = new Readable()
    var ps = spawn(process.execPath, [ cmd ])
    var combine = new Combiner([ps.stdin, ps.stdout])

    stream._read = function noop() {/* keep cmd from crashing REPL */}
    stream.push(string)
    stream.push(null)

    stream
        .pipe(combine)
        .pipe(through( function (chunk, enc, cb) {
            t.equal(chunk.toString(), string, 'Standard output is the same as standard input')
            cb()
        }))
})
