const Utils = require('./utils');

const fp = Utils.getFilePath;

describe('Filepath', () => {
  test('Simple', () => {
    expect(fp('foo\\bar.js', '')).toEqual('./foo/bar.js');
  });

  test('Patch', () => {
    expect(fp('foo\\bar.js.patch', '')).toEqual('./foo/bar.js');
  });

  test('Dir', () => {
    expect(fp('foo\\bar.js', '/')).toEqual('./foo/bar.js');
    expect(fp('foo\\bar.js', './')).toEqual('./foo/bar.js');

    expect(fp('foo\\bar.js', 'deep')).toEqual('./deep/foo/bar.js');
    expect(fp('foo\\bar.js', 'deep/')).toEqual('./deep/foo/bar.js');
    expect(fp('foo\\bar.js', './deep/')).toEqual('./deep/foo/bar.js');
  });
});
