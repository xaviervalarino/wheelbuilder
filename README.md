# Wheel Builder
A streaming static site generator

## Usage
```sh
WHEELBUILDER
A streaming static site generator

SYNOPSIS
    wb [input file]... [options]...

OPTIONS
    -h, --help     Show this message
    -o, --outDir   Directory where files are outputted
    -v, --version  Output version information and exit

EXAMPLES
    cat file.md | wb > file.html

    wb file.md -t ./templates/ -o ./dest/

    wb 'src/**.md' -t ./templates -o ./dest/

```
