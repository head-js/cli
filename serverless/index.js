const fs = require('fs');
const path = require('path');


const PROJECT_PATH = process.cwd();


module.exports = function serverless(options) {
  console.assert(options.package === 'midway', 'Only "midway" packaging is supported at the moment');

  const pkg = JSON.parse(fs.readFileSync(path.resolve(PROJECT_PATH, 'package.json')));
  console.log(pkg);

  const DIR = path.resolve(PROJECT_PATH);
  console.log(DIR);

  return Promise.resolve();
};
