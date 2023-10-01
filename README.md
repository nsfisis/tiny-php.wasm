# tiny-php.wasm

A tiny example to compile PHP runtime ([php/php-src](https://github.com/php/php-src)) to WebAssembly.

Article about this repo (Japanese): https://blog.nsfisis.dev/posts/2023-10-02/compile-php-runtime-to-wasm/


## Build

```
$ docker build -t php-wasm .
```

## Run

```
$ echo 'echo "Hello, World!", PHP_EOL;' | docker run --rm -i php-wasm
```

## License

Public Domain
