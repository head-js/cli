const path = require('path');
const assert = require('node:assert/strict');
const globby = require('globby');
const { existsSync, stat, unlink } = require('fs-extra');


const PROJECT_PATH = process.cwd();


// https://github.com/midwayjs/cli/blob/master/packages/cli-plugin-package/src/utils.ts
// https://github.com/midwayjs/mininm/blob/main/src/uselessFilesMatch.ts
// https://github.com/yarnpkg/yarn/blob/master/src/cli/commands/autoclean.js
// https://github.com/tj/node-prune/blob/master/internal/prune/prune.go

const uselessFilesMatch = [
  '**/*.md',
  '**/*.markdown',
  '**/LICENSE',
  '**/license',
  '**/LICENSE.txt',
  '**/MIT-LICENSE.txt',
  '**/LICENSE-MIT.txt',
  '**/*.d.ts',
  '**/*.ts.map',
  '**/*.js.map',
  '**/*.test.js',
  '**/*.test.ts',
  '**/travis.yml',
  '**/.travis.yml',
  '**/src/**/*.ts',
  '**/test/',
  '**/tests/',
  '**/coverage/',
  '**/.github/',
  '**/.coveralls.yml',
  '**/.npmignore',
  '**/AUTHORS',
  '**/HISTORY',
  '**/Makefile',
  '**/.jshintrc',
  '**/.eslintrc',
  '**/.eslintrc.json',
  '**/@types/',
  '**/.mwcc-cache/',
];


async function removeUselessFiles(target) {
  const nm = path.join(target, 'node_modules');
  const list = await globby(uselessFilesMatch, {
    cwd: nm,
    deep: 10,
  });
  console.log('  - Useless files Count', list.length);

  let size = 0;
  for (const file of list) {
    const filepath = path.join(nm, file);
    if (existsSync(filepath)) {
      const stats = await stat(filepath);
      size += stats.size;
      // console.log(`  - Remove Useless file ${filepath}`);
      await unlink(filepath);
    }
  }

  console.log(
    `  - Remove Useless file ${Number(size / (2 << 19)).toFixed(2)} MB`
  );
};


module.exports = function serverless(options) {
  assert.equal(options.package, 'midway', 'Only "midway" packaging is supported at the moment');

  const DIR = path.resolve(PROJECT_PATH);
  // console.log(DIR);

  removeUselessFiles(DIR);

  return Promise.resolve();
};
