'use strict'
var vfs = require('vinyl-fs')

function Wheelbuilder () {
    var self = this
    return this
}
Wheelbuilder.prototype.src = function source (glob) {
    return vfs.src(glob)
}

Wheelbuilder.prototype.dest = function destination (dir) {
    return vfs.dest(dir)
}

module.exports = Wheelbuilder
