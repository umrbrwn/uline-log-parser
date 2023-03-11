import transformLog from '../src/transform';

describe('Unit tests for parsing logs', () => {
  test('should return null for garbage log', () => {
    const log = 'zxcvbn';
    expect(transformLog(log, '')).toEqual(null);
  });

  test('should return null when there is no log date', () => {
    const log = ' - info - {"details":"test"}';
    expect(transformLog(log, '')).toEqual(null);
  });

  test('should return null when there is no log level', () => {
    const log = '2044-08-09T02:12:51.253Z - {"details":"test"}';
    expect(transformLog(log, '')).toEqual(null);
  });

  test('should return null when log level is different', () => {
    const log = '2044-08-09T02:12:51.253Z - info - {"details":"test"}';
    expect(transformLog(log, '')).toEqual(null);
  });

  test('should return error object with empty err property when message is undefined', () => {
    const log = '2044-08-09T02:12:51.253Z - error';
    const actual = transformLog(log, 'error');
    expect(actual).toBeDefined();
    expect(actual?.err).toEqual('');
  });

  test('should have timestamp in milliseconds for valid error', () => {
    const log = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","err":"Not found"}';
    const actual = transformLog(log, 'error');
    expect(actual?.timestamp).toEqual(new Date('2021-08-09T02:12:51.259Z').getTime());
  });

  test('should have log level when its accepted', () => {
    const log = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","err":"Not found"}';
    const actual = transformLog(log, 'error');
    expect(actual?.loglevel).toEqual('error');
  });

  test('should have a transactionId', () => {
    const log = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","err":"Not found"}';
    const actual = transformLog(log, 'error');
    expect(actual?.transactionId).toEqual('9abc55b2-807b-4361-9dbe-aa88b1b2e978');
  });

  test('should have err property from the error message', () => {
    const log = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","err":"Not found"}';
    const actual = transformLog(log, 'error');
    expect(actual?.err).toEqual('Not found');
  });

  test('should throw an error when message is not a valid json object', () => {
    const log = '2021-08-09T02:12:51.259Z - error - plain text error message which is not json';
    try {
      transformLog(log, 'error');
      expect(false).toBeTruthy();
    } catch {
      expect(true).toBeTruthy();
    }
  });
});
