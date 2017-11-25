const {
  execFile,
} = require('child_process');

const train = async (filepath, i, j, k) => new Promise((resolve, reject) => {
  execFile('python', ['./train.py', i, j, k, filepath], { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      reject(error);
    }
    resolve(stdout);
  });
});
const test = async (filepath, i, j, k) => new Promise((resolve, reject) => {
  execFile('python', ['./test.py', i, j, k, filepath], { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      reject(error);
    }
    resolve(stdout);
  });
});

const experiments_variables = [
  [0.001, 1, 1000],
  [0.001, 1, 2000],
  [0.001, 1, 4000],
  [0.001, 2, 1000],
  [0.001, 2, 2000],
  [0.001, 2, 4000],
  [0.001, 4, 1000],
  [0.001, 4, 2000],
  [0.001, 4, 4000],
  [0.01, 1, 1000],
  [0.01, 1, 2000],
  [0.01, 1, 4000],
  [0.01, 2, 1000],
  [0.01, 2, 2000],
  [0.01, 2, 4000],
  [0.01, 4, 1000],
  [0.01, 4, 2000],
  [0.01, 4, 4000],
  [0.1, 1, 1000],
  [0.1, 1, 2000],
  [0.1, 1, 4000],
  [0.1, 2, 1000],
  [0.1, 2, 2000],
  [0.1, 2, 4000],
  [0.1, 4, 1000],
  [0.1, 4, 2000],
  [0.1, 4, 4000],
];
module.exports = {
  train,
  experiments_variables,
  test,
};
