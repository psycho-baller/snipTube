# Chrome Extension TypeScript Starter

![build](https://github.com/chibat/chrome-extension-typescript-starter/workflows/build/badge.svg)

Chrome Extension, TypeScript and Visual Studio Code

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Option

* [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

* TypeScript
* Webpack
* React
* Jest
* Example Code
  * Chrome Storage
  * Options Version 2
  * content script
  * count up badge number
  * background

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Import as Visual Studio Code project

...

## Build

```
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory

## Test

`npx jest` or `npm run test`

## TODO

* [X] add sass and style the snips
* [X] make everything get updated instantly (e.g: when we make a new snip, reflect that in the video bar)
* [X] build the popup.tsx file
* [ ] style the tags in the popup and put them in tab 2 too
* [ ] make the tags clickable in the popup and make them filter the snips
* [ ] add notes and play button for both tabs
* [ ] add a delete button for the snips
* [ ] add a way users can change the name of the snip
  * [ ] before submitting the snip
  * [ ] after submitting the snip (in the popup)
