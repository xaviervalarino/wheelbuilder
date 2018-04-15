# Wheel Builder
A streaming static site generator

## Usage
```

WHEELBUILDER
A streaming static site generator

SYNOPSIS
    wb [options] [input file]...

OPTIONS
    -h, --help      Show this message
    -o, --out-dir   Write files to this directory
    -t, --templates Use templates in this directory
    -v, --version   Output version information and exit

EXAMPLES
    Convert markdown file to HTML, stream to standard output:
        wb file.md

    Specify templates and output to destination directory:
        wb file.md -t ./templates/ -o ./dest/

    Convert multiple markdown files and output to destination:
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

### TODO
- [ ] Publish on NPM registry
- [ ] Potentially move from Vinyl-fs to just using Node stream API
- [ ] Create Wheelbuilder API
    - [X] Create streaming file I/O
    - [ ] Implement FrontMatter parsing
    - [ ] Implement Template rendering
    - [ ] Use consolidate.js for wider template support?
- [ ] Document writing content files with frontMatter
- [ ] Parse stringified file objects through STDIN?
- [ ] Add `watch` option for caching templates (or create companion module)
