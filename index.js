#!/usr/bin/env node

global.ROOT_DIR = __dirname;
const program = require('./program');

program.parse();
