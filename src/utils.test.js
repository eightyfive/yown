const Utils = require('./utils');

const fp = Utils.getFilePath;

describe('Utils', () => {
  test('Simple filepath', () => {
    expect(fp('foo\\bar.js', '')).toEqual('./foo/bar.js');
  });

  test('Dir filepath', () => {
    expect(fp('foo\\bar.js', '/')).toEqual('./foo/bar.js');
    expect(fp('foo\\bar.js', './')).toEqual('./foo/bar.js');

    expect(fp('foo\\bar.js', 'deep')).toEqual('./deep/foo/bar.js');
    expect(fp('foo\\bar.js', 'deep/')).toEqual('./deep/foo/bar.js');
    expect(fp('foo\\bar.js', './deep/')).toEqual('./deep/foo/bar.js');
  });

  test('isName', () => {
    expect(Utils.isName('@rnna/navigator')).toEqual(true);
    expect(Utils.isName('@rnna')).toEqual(false);
    expect(Utils.isName('rnna')).toEqual(false);
  });

  test('isAppend', () => {
    expect(Utils.isAppend('>>index.js')).toEqual(true);
  });

  test('isPrepend', () => {
    expect(Utils.isPrepend('<<index.js')).toEqual(true);
  });
});
