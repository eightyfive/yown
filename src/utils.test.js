const Utils = require('./utils');

const fp = Utils.getFilepath;

describe('Filepath', () => {
  test('Simple', () => {
    expect(fp('', 'foo\\bar.js')).toEqual('./foo/bar.js');
  });

  test('Patch', () => {
    expect(fp('', 'foo\\bar.js.patch')).toEqual('./foo/bar.js');
  });

  test('Dir', () => {
    expect(fp('/', 'foo\\bar.js')).toEqual('./foo/bar.js');
    expect(fp('./', 'foo\\bar.js')).toEqual('./foo/bar.js');

    expect(fp('deep', 'foo\\bar.js')).toEqual('./deep/foo/bar.js');
    expect(fp('deep/', 'foo\\bar.js')).toEqual('./deep/foo/bar.js');
    expect(fp('./deep/', 'foo\\bar.js')).toEqual('./deep/foo/bar.js');
  });
});
