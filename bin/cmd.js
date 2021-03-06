#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')

var through = require('through2')
var pipeline = require('pumpify')
var Vinyl = require('vinyl')

var chalk = require('chalk')
var argv = require('minimist')(process.argv.slice(2), {
    string: [
        '_',
        'out-dir'
    ],
    boolean: true,
    default: {
    },
    alias: {
        'h': 'help',
        'o': 'out-dir',
        't': 'templates',
        'v': 'version'
    }
})

// show help
if (argv._.length === 0 && Object.keys(argv).length === 1 || argv.h) {
    // TODO: check to make sure STDIN is not being used
    if ( argv._.length === 0 && argv._ ) {
        return fs.createReadStream(__dirname + '/usage.txt')
            .pipe(process.stdout)
    }
}

// show version number
if (argv.v) {
    var packageJSON  = path.resolve(__dirname + '/../package.json')
    return fs.createReadStream(packageJSON)
        .pipe(through(function getSemver (data) {
            console.log(JSON.parse(data).version)
        }))
}

// no input file or STDIN pipe
if ( process.stdin.isTTY && !argv._.length ) {
    console.log(chalk.red('No input file(s) specified'))
    return process.exit(1)
}

// TODO: ambiguous error message?
if ( !process.stdin.isTTY && argv._.length ) {
    console.log(chalk.red('Input from file and STDIN is ambiguous'))
    return process.exit(1)
}

//  ----------------------------------------------------------------------------

var Wheelbuilder = require('../')
var wb = new Wheelbuilder()

// use STDIN/STDOUT or open read/write streams
if (argv._.length) {
    var source = wb.src(argv._)
} else {
    source = process.stdin
}

if (argv.o) {
    var destination = wb.dest(argv.o)
} else {
    destination = pipeline.obj(
        through.obj(function (file, enc, cb) {
            var out = Vinyl.isVinyl(file) ?
                file.contents.toString() :
                file.toString()
            this.push(out)
            cb()
        }),
        process.stdout
    )
}

source.pipe(destination)
