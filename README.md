# eight-hundred
For eight hundred to do a string compressor

## Requirements
* Nodejs
* Yarn

## Installation
```shell
yarn
```

## Build
build a random string file (64KB) out to `dist/64k_random_string_***time***.txt`
```shell
npm run build
```

## Build and test
build a random string file (64KB) and test some target code with this random string file
```shell
npm run build:targetName
```
for example, work with root file that `src/salam/index.js`
```shell
npm run build:salam
```
