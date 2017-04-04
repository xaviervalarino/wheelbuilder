'use strict'
var test = require('tap').test

var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn

var through = require('through2')
var combiner = require('stream-combiner2')
var Readable = require('stream').Readable

var tmp = require('os').tmpdir()
var cmd = path.join(__dirname, './../bin/cmd.js')

test('Test error when no inputs are specified', function (t) {
    var ps = spawn(process.execPath, [ cmd ],
        {   // Mock child_process.stdin.isTTY = true
            stdio: [ process.stdin, 'pipe', 'pipe' ]
        }
    )
    process.stdin
        .pipe(ps.stdout)
        .pipe(through( function (chunk) {
            var msg = chunk.toString()
            var err = 'No input file(s) specified\n'
            t.equal(msg, err, 'Show error message when no files are specified')
        }))
        ps.on('exit', function (code) {
            t.equal(code, 1, 'Process exits with error code 1')
            process.stdin.destroy() // close STDIN to keep test from hanging
            t.end()
        })
})

test('Test help file argument', function (t) {
    var ps = spawn(process.execPath, [
        cmd,
        '-h'
    ])
    ps.stdout
        .pipe(through( function (chunk) {
            var usageText = chunk.toString()
            var usageFile = fs.readFileSync(__dirname + '/../bin/usage.txt', 'utf8')
            t.equal(usageText, usageFile, 'Help argument returns contents of `usage.txt` file')
            t.end()
        }))
})

test('Test version number argument', function (t) {
    var ps = spawn(process.execPath, [
        cmd,
        '-v'
    ])
    ps.stdout
        .pipe(through( function (chunk) {
            var ver = chunk.toString().replace('\n', '')
            var pkg = require(__dirname + '/../package.json')
            t.equal(ver, pkg.version, 'Version argument returns version number')
            t.end()
        }))
})

test('Test input and output file arguments', function (t) {
    var input = path.join(__dirname, './fixtures/content/index.md')
    var output =  path.join(tmp, 'index.md')
    // run the CLI
    var ps = spawn(process.execPath, [
        cmd,
        '-o', output,
        // __dirname + './fixtures/content.md'
        input
    ])
    ps.on('close', function () {
        fs.readFile(output, 'utf8', function (err) {
            if (err) throw err
            fs.stat(output, function (_, stats) {
                t.ok(stats, 'Output file exists')
                t.end()
            })
        })
    })
})

test('Test STDIN and STDOUT', function (t) {
    var string = '# STDIN Streaming test\nTest out STDIN stream\n'

    var stream = new Readable()
    var ps = spawn(process.execPath, [ cmd ])
    // `pumpify` module makes test exit early
    var passthrough = combiner(ps.stdin, ps.stdout)

    stream._read = function noop() {/* keep cmd from crashing REPL */}
    stream.push(string)
    stream.push(null)

    stream
        .pipe(passthrough)
        .pipe(through( function (chunk) {
            t.equal(chunk.toString(), string, 'Standard output is the same as standard input')
            t.end()
        }))
})
