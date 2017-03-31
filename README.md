# Wheel Builder
A streaming static site generator

## Usage
```sh
SYNOPSIS
    wb [input file]... [options]...

OPTIONS
    -o, --outDir   Directory where files are outputted
    -h, --help     Show this message


EXAMPLES
    cat file.md | wb > file.html

    wb file.md -t ./templates/ -o ./dest/

    wb 'src/**.md' -t ./templates -o ./dest/

```
