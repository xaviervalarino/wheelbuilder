'use strict'

var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2), {
	default: {
	},
	alias: {
		'h': 'help',
		'o': 'outDir',
	}
})

// show help
if (argv.h) {
	// TODO: show help when no options or files specfied?
	// i.e., Object.keys(argv).length === 1 && argv._.length === 0
	// need to make sure STDIN is not being used
    return fs.createReadStream(__dirname + '/usage.txt')
		.pipe(process.stdout)
}

// use STDIN/STDOUT or open read/write streams
if (argv._.length) {
	var sources = argv._.map(function createReadStreams (filename) {
		return fs.createReadStream(filename)
	})
} else {
	sources = [ process.stdin ]
}

if (argv.o) {
	// TODO: write file in wb to access input filename
	// Right now this just writes the output dir as the
	// filename, which is clearly not how it should work.
	var destination = fs.createWriteStream(argv.o)
} else {
	destination = process.stdout
}

sources.forEach(function (src) {
	src.pipe(destination)
})


// Possible API for `wheelbuilder` up for consideration
// ----------------------------------------------------
// var Wheelbuilder = require('../')
// var wb = new Wheelbuilder()

// wb.src(sources)
// 	.pipe(wb.frontMatter())
// 	.pipe(wb.template(argv.t))
// 	.pipe(wb.dest(destination))
