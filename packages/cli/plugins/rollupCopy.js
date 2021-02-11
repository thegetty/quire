import { copyDirRecursive } from '../lib/utils.js';

export default function(paths) {
  paths.forEach(({ from, to, exclude }) => {
    copyDirRecursive(from, to, exclude);
  });
};
