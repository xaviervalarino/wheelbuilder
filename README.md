# Wheel Builder
A streaming static site generator

## Usage
```
WHEELBUILDER
A streaming static site generator

SYNOPSIS
    wb [input file]... [options]...

OPTIONS
    -h, --help     Show this message
    -o, --out-dir  Directory where files are outputted
    -v, --version  Output version information and exit

EXAMPLES
    cat file.md | wb > file.html

    wb file.md -t ./templates/ -o ./dest/

    wb 'src/**/*.md' -t ./templates -o ./dest/

```

## API
The CLI uses a simple API that streams input files, transforms them (soon!), and then writes them to a specified destination directory.

Wheelbuilder's API is a thin wrapper around [Vinyl-fs](https://github.com/gulpjs/vinyl-fs), so all of its options can be used.

* **`Wheelbuilder`**: Create a new Wheelbuilder object
* **`src`**: See [vinyl-fs `src`](https://github.com/gulpjs/vinyl-fs#srcglobs-options)
* **`dest`**: Se [vinyl-fs `dest`](https://github.com/gulpjs/vinyl-fs#destfolder-options)

### Example
```js
var Wheelbuilder = require('wheelbuilder')
var wb = new Wheelbuilder()

wb.src('./glob_pattern/**.md').pipe(wb.dest('./destination'))
```
